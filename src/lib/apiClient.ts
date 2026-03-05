import type { HttpMethod } from "@/types/http";
import { ApiError } from "@/lib/ApiError";

const DEFAULT_TIMEOUT = 10000;

interface RequestOptions {
    headers?: Record<string, string>;
    timeout?: number;
    signal?: AbortSignal;
}

interface ApiClientOptions<TBody = unknown> extends RequestOptions {
    method: HttpMethod;
    body?: TBody;
}

// ─── Core ─────────────────────────────────────────────────────────────────────

async function request<TResponse, TBody = unknown>(
    endpoint: string,
    { method, body, headers = {}, timeout = DEFAULT_TIMEOUT, signal }: ApiClientOptions<TBody>
): Promise<TResponse> {

    // Timeout via AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    const combinedSignal = signal ?? controller.signal;

    try {
        const response = await fetch(`${endpoint}`, {
            method,
            headers: {
                'Content-Type': 'application/json',
                ...headers, // caller can override anything
            },
            body: body ? JSON.stringify(body) : undefined,
            signal: combinedSignal,
        });

        clearTimeout(timeoutId);

        // Normalize fetch's silent error problem
        if (!response.ok) {
            const errorData = await response.json().catch(() => null);
            throw new ApiError(
                response.status,
                errorData?.message ?? `HTTP Error ${response.status}`,
                errorData
            );
        }

        return response.json() as Promise<TResponse>;

    } catch (error) {
        clearTimeout(timeoutId);

        if (error instanceof ApiError) throw error;

        if (error instanceof DOMException && error.name === 'AbortError') {
            throw new ApiError(408, 'Request timeout');
        }

        throw new ApiError(0, 'Network error — no connection');
    }
}

// ─── Public API ───────────────────────────────────────────────────────────────

export const apiClient = {
    get: <TResponse>(endpoint: string, options?: RequestOptions) =>
        request<TResponse>(endpoint, { method: 'GET', ...options }),

    post: <TResponse, TBody = unknown>(endpoint: string, body: TBody, options?: RequestOptions) =>
        request<TResponse, TBody>(endpoint, { method: 'POST', body, ...options }),

    put: <TResponse, TBody = unknown>(endpoint: string, body: TBody, options?: RequestOptions) =>
        request<TResponse, TBody>(endpoint, { method: 'PUT', body, ...options }),

    patch: <TResponse, TBody = unknown>(endpoint: string, body: TBody, options?: RequestOptions) =>
        request<TResponse, TBody>(endpoint, { method: 'PATCH', body, ...options }),

    delete: <TResponse>(endpoint: string, options?: RequestOptions) =>
        request<TResponse>(endpoint, { method: 'DELETE', ...options }),
};