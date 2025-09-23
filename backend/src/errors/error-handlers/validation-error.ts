import { configs } from "src/configs";
import type { Response } from "express";
import { isDevMode } from "@libs/utils";
import type { HttpClientError } from "@libs/http-response-codes";


export function validationError(
    error: any,
    res: Response,
    clientError: HttpClientError
) {
    const response = {
        status: "error",
        error: clientError.errorName,
        message: `Key ${error.key}: ${error.message}`,
        stackTrace: isDevMode(configs.BUN_ENV) ?  error.stack : undefined
    }

    res.status(clientError.statusCode).json(response);
}
