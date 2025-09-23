import type { Response } from "express";
import type { ServerError } from "../error-classes/server-error";
import { configs } from "src/configs";
import type { ErrorResponse } from "@types";
import { isDevMode } from "@libs/utils";


export function serverError(
    error: ServerError,
    res: Response
) {
        const response: ErrorResponse = {
            success: false,
            errorName: error.name,
            message: error.message,
            stackTrace: isDevMode(configs.BUN_ENV) ?  error.stack : undefined
        }
        
        res.status(error.statusCode).json(response);
}
