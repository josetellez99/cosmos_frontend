import type { HttpMethod } from "@/types/http";
import type { ApiResponse } from "@/types/api_responses";
import { removeCookies } from "@/helpers/cookies";
import { CSRF_COOKIE_NAME, USER_SESSION_COOKIE } from "@/lib/constants/global_constants";

const AUTH_COOKIES = [CSRF_COOKIE_NAME, USER_SESSION_COOKIE];

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
): Promise<ApiResponse<TResponse>> {

    // Timeout via AbortController
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), timeout);
    const combinedSignal = signal ?? controller.signal;

    try {
        const response = await fetch(`${endpoint}`, {
            method,
            credentials: 'include',
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
            if (response.status === 401) {
                removeCookies(AUTH_COOKIES);
            }
            const errorResponse = await response.json().catch(() => null);
            return {
                ok: false,
                message: errorResponse?.message ?? `HTTP Error ${response.status}`,
                status: response.status,
                error: errorResponse?.error ?? {
                    code: 'UNKNOWN_ERROR',
                    details: {}
                }
            };
        }

        const rawResponse = await response.json();
        return {
            ok: true,
            message: rawResponse.message,
            data: rawResponse.data
        };

    } catch (error) {
        clearTimeout(timeoutId);

       if ( error instanceof Error && error.name === 'AbortError') {
            return {
                ok: false,
                message: 'Request timeout',
                status: 408,
                error: { code: 'REQUEST_TIMEOUT', details: {} }
            }
        }

        return {
            ok: false,
            message: 'Network error — no connection',
            status: 0,
            error: { code: 'NETWORK_ERROR', details: {} }
        }
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

    delete: <TResponse, TBody = unknown>(endpoint: string, body?: TBody, options?: RequestOptions) =>
        request<TResponse, TBody>(endpoint, { method: 'DELETE', body, ...options }),
};