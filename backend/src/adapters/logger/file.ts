import fs from "node:fs";
import path from "node:path";
import type { ILogger } from "@ports/logging/ILogger";

type InitOpts = {
    fileSizeLimit?: number
};

export class FileLogger implements ILogger {

    private isFlushing = false;
    private queue: string[] = [];
    private writer: fs.WriteStream | null = null;
    private currentLogFile: string | null = null;
    private fileSizeLimit = 50 * 1024 * 1024; // 50MB

    constructor(private readonly logDirectory: string) {}

    async init(opts?: InitOpts) {
        if (opts?.fileSizeLimit) this.fileSizeLimit = opts.fileSizeLimit;

        await fs.promises.mkdir(this.logDirectory, { recursive: true });

        await this.createNewLogFile();

        this.flushQueue();
    }

    private async createNewLogFile() {
        const timestamp = new Date().toISOString().replace(/[\:\.]/g, "-");
        const logFilepath = path.join(this.logDirectory, `${timestamp}.log`);

        if (this.writer) {
            this.writer.end();
        }

        this.writer = fs.createWriteStream(
            logFilepath, 
            { encoding: "utf8" }
        );
        this.writer.on("error", this.handleWriterError.bind(this));
        this.currentLogFile = logFilepath;
    }

    private buildLog(
        logType: Uppercase<keyof ILogger>,
        message: string,
        context?: Record<string, any>
    ) {
        const time = new Date().toLocaleString();
        const contextStr = context ? JSON.stringify(context) : '';
        return `[${time}] [${logType}]: ${message} ${contextStr}\n`;
    }

    private async getFileSize() {
        if (!this.currentLogFile) return 0;
        try {
            const stats = await fs.promises.stat(this.currentLogFile);
            return stats.size;
        } catch {
            return 0;
        }
    }

    private async flushQueue() {
        if (!this.writer || this.isFlushing || this.queue.length === 0) return;

        this.isFlushing = true;

        while (this.queue.length > 0) {
            const log = this.queue.shift()!;
            const canWrite = this.writer.write(log);

            const size = await this.getFileSize();
            if (size >= this.fileSizeLimit) {
                await this.createNewLogFile();
            }

            if (!canWrite) {
                await new Promise<void>((resolve) => this.writer!.once("drain", resolve));
            }
        }

        this.isFlushing = false;
    }

    private queueOrLog(log: string) {
        this.queue.push(log);
        if (this.writer) this.flushQueue();
    }

    info(message: string, context?: Record<string, any>) {
        const log = this.buildLog(
            "INFO", 
            message, 
            context
        );
        this.queueOrLog(log);
    }

    warn(message: string, context?: Record<string, any>) {
        const log = this.buildLog(
            "WARN", 
            message, 
            context
        );
        this.queueOrLog(log);
    }

    error(message: string, context?: Record<string, any>) {
        const log = this.buildLog(
            "ERROR", 
            message, 
            context
        );
        this.queueOrLog(log);
    }

    private handleWriterError(err: Error) {
        console.error("FileLogger encountered an error:", err);
    }

    async close() {
        if (this.writer) {
            await new Promise((resolve) => this.writer!.end(resolve));
            this.writer = null;
        }
    }
}
