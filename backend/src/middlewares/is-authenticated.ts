import { ClientError } from "@errors/error-classes/client-error";
import { HttpClientError } from "@libs/http-response-codes";
import { AuthenticationService } from "@services/authentication";
import { container } from "@tasks/container";
import type { Request, Response, NextFunction } from "express";


export async function isAuthenticated(
    req: Request,
    _res: Response,
    next: NextFunction
) {

    const token = (req as any).accessToken;

    if (!token || typeof token !== "string") {
        throw new ClientError(
            "User is not authenticated.",
            HttpClientError.Unauthorized
        );
    }

    const authSvc = container.resolve(AuthenticationService);
    const claims = await authSvc.validateToken(token);

    (req as any).claims = claims;
    next();
}