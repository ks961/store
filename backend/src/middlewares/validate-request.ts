import { ZodType, ZodError } from "zod";
import type { Request, Response, NextFunction } from "express";
import { ClientError } from "@errors/error-classes/client-error";
import { ServerError } from "@errors/error-classes/server-error";
import { HttpClientError, HttpServerError } from "@libs/http-response-codes";

type RequestValitionSchema<T extends ZodType<any, any>> = {
    body?: T;
    query?: T;
    params?: T;
}

export function validateRequest<Schema extends ZodType<any, any>>(
    schemas: RequestValitionSchema<Schema>
) {
    return (
        req: Request, 
        _res: Response, 
        next: NextFunction
    ) => {
        try {
            if (schemas.body) {
                req.body = schemas.body.parse(req.body);
            }

            if (schemas.query) {
                schemas.query.parse(req.query);
            }
    
            if (schemas.params) {
                schemas.params.parse(req.params);
            }

            next();
        } catch (err: unknown) {

            if (err instanceof ZodError) {
                const messages = err.issues.map(issue => 
                    `${issue.path.join('.')}: ${issue.message}`
                ).join("\n");

                throw new ClientError(
                    messages, 
                    HttpClientError.BadRequest
                );
            }

            throw new ServerError(
                "Something went wrong while validating request.",
                HttpServerError.InternalServerError
            );
        }
    };
}