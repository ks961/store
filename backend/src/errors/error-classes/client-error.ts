import { AppError } from "./app-error";
import { HttpClientError } from "@libs/http-response-codes";

export class ClientError extends AppError {
    statusCode;
    
    constructor(
        message: string,
        httpError: HttpClientError
    ) {
        super(message);
        this.name = httpError.errorName;
        this.statusCode = httpError.statusCode;
    }
}
