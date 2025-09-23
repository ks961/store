import { Task } from "@libs/lifecycle-manager";
import { FileLogger } from "@adapters/logger/file";
import { container } from "./container";



export const logger = new FileLogger("logs");
export const fileLogger = new Task(
    "File Logger",
    async () => {
        await logger.init();
        
        container.singleton(
            FileLogger,
            () => logger
        );
    },
    () => logger.close()
);