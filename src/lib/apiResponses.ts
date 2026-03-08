export interface BaseApiResponse {
    ok: boolean;
    message: string;
}

export interface SuccessApiResponse<T> extends BaseApiResponse {
    ok: true,
    data: T;
}

export interface ErrorApiResponse extends BaseApiResponse {
    ok: false,
    status: number,
    error: {
        code: string,
        details: Record<string, string>
    }
}

export type ApiResponse<T> =
    SuccessApiResponse<T> |
    ErrorApiResponse