


export class RequestFailedError extends Error {
    constructor(
        private readonly reason: string,
        private readonly statusCode?: number
    ) {
        super();
    }
}