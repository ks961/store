import { logger } from "src/tasks/file-logger";
import type { NextFunction, Request, Response } from "express";


export function reqResLogger(req: Request, res: Response, next: NextFunction) {
    const startTime = Date.now();

    logger.info(`Incoming request: ${req.method} ${req.originalUrl}`, {
        ip: req.ip,
        query: req.query,
        params: req.params,
        headers: req.headers,
        body: req.body ? JSON.stringify(req.body) : undefined
    });

    res.on("finish", () => {
        const duration = Date.now() - startTime;
        logger.info(`Response sent: ${req.method} ${req.originalUrl}`, {
            statusCode: res.statusCode,
            durationMs: duration,
            responseSize: res.getHeader("Content-Length"),
        });
    });

    next();
}