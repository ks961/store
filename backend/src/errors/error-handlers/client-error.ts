import type { Response } from "express";
import type { ClientError } from "../error-classes/client-error";
import { configs } from "src/configs";
import type { ErrorResponse } from "@types";
import { isDevMode } from "@libs/utils";

export function clientError(
    error: ClientError,
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
