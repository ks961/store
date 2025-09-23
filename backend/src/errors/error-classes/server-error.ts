import { AppError } from "./app-error";
import { HttpServerError } from "@libs/http-response-codes";

export class ServerError extends AppError {
    statusCode;
    
    constructor(
        message: string,
        httpError: HttpServerError 
    ) {
        super(message);
        this.name = httpError.errorName;
        this.statusCode = httpError.statusCode;
    }
}
