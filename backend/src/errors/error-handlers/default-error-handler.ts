import { ClientError } from "../error-classes/client-error";
import { clientError } from "./client-error";
import { ServerError } from "../error-classes/server-error";
import { serverError } from "./server-error";
import type { NextFunction, Request, Response } from "express";
import { HttpServerError } from "../../libs/http-response-codes";
import type { ErrorResponse } from "../../types";
import { isDevMode } from "../../libs/utils";
import { configs } from "@configs";


export function defaultErrorHandler(
    error: unknown,
    _req: Request,
    res: Response,
    _next: NextFunction
) {
    
    if(error instanceof ClientError) {
        return clientError(
            error,
            res
        );
    }

    if(error instanceof ServerError) {
        return serverError(
            error,
            res
        );
    }
    
    isDevMode(configs.BUN_ENV) ? console.error(error) : undefined;
    const response: ErrorResponse = {
        success: false,
        errorName: "unknown",
        message: "Something went wrong!",
        stackTrace: isDevMode(configs.BUN_ENV) && (error instanceof Error) ?
            error.stack : undefined
    }

    res.status(HttpServerError.InternalServerError.statusCode)
        .json(response);
}
