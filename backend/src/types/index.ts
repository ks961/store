

export type SuccessResponse<T> = T extends undefined | null
  ? { success: true; data?: T }
  : { success: true; data: T };   

export type ErrorResponse<E = string> = {
    errorName: string,
    message: E,
    success: false,
    stackTrace?: string
}

export type ApiResponse<T, E = string> = 
    SuccessResponse<T> | ErrorResponse<E>;