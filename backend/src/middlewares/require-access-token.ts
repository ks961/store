import { configs } from "@configs";
import { ClientError } from "@errors/error-classes/client-error";
import { HttpClientError } from "@libs/http-response-codes";
import type { Request, Response, NextFunction } from "express";


export function requireAccessToken(
    req: Request,
    _res: Response,
    next: NextFunction
) {
    const token = req.cookies[configs.ACCESS_TOKEN_COOKIE_TAG];

    if (!token) {
        throw new ClientError(
            "Access token not found",
            HttpClientError.BadRequest
        );
    }

    (req as any).accessToken = token;

    next();
}