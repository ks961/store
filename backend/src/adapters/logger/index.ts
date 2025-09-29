import type { ILogger } from "@ports/logging/ILogger";


export class Logger implements ILogger {

    constructor(
        private readonly logger: ILogger
    ) {};

    info(message: string, context?: Record<string, any>): void {
        this.logger.info(message, context);
    }
    
    warn(message: string, context?: Record<string, any>): void {
        this.logger.warn(message, context);
    }
    
    error(message: string, context?: Record<string, any>): void {
        this.logger.error(message, context);
    }

}