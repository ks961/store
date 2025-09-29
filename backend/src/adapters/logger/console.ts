import type { ILogger } from "@ports/logging/ILogger";


export class ConsoleLogger implements ILogger {

    buildLog(
        logType: Uppercase<keyof ILogger>,
        message: string,
        context?: Record<string, any>
    ) {
        const time = `${new Date().toLocaleString()}`;
        const contextStr = context ? JSON.stringify(context) : '';
        return `[${time}] [${logType}]: ${message} ${contextStr}`;
    }

    info(message: string, context?: Record<any, any>): void {
        const log = this.buildLog(
            "INFO",
            message,
            context
        );
        console.info(log);
    }
    
    warn(message: string, context?: Record<any, any>): void {
        const log = this.buildLog(
            "WARN",
            message,
            context
        );
        console.warn(log);
    }
    
    error(message: string, context?: Record<any, any>): void {
        const log = this.buildLog(
            "ERROR",
            message,
            context
        );
        console.error(log);
    }

}