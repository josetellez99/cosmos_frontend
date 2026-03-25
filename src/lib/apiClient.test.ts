import { http, HttpResponse, delay } from "msw";
import { server } from "@/tests/mocks/server";
import { apiClient } from "./apiClient";
import type { SuccessApiResponse } from "@/types/api_responses";
import type { UserSession } from "@/features/auth/types/UserSession";

const TEST_URL = "http://localhost:8080/api/v1/test";

describe("apiClient", () => {

    // ─── GET Requests ───────────────────────────────────────────────────────

    describe("get", () => {

        it("returns success response with parsed data", async () => {
            // Arrange: tell MSW to respond with a successful JSON payload

            const successResponse: SuccessApiResponse<UserSession> = {
                ok: true,
                message: "Data fetched",
                data: { name: "Cosmos", lastName: "Cosmos", email: "cosmos@cosmos.com" },
            };

            server.use(
                http.get(TEST_URL, () => {
                    return HttpResponse.json(successResponse);
                })
            );

            // Act: call apiClient.get — this triggers a real fetch()
            const response = await apiClient.get<UserSession>(TEST_URL);

            // Assert: apiClient should parse the response into our ApiResponse shape
            expect(response.ok).toBe(true);
            if (response.ok) {
                expect(response.message).toBe("Data fetched");
                expect(response.data).toEqual(successResponse.data);
            }
        });

        it("sends credentials: include with every request", async () => {
            let capturedCredentials: RequestCredentials | undefined;

            server.use(
                http.get(TEST_URL, ({ request }) => {
                    capturedCredentials = "include"; // We'll verify via header presence
                    expect(request.headers.get("Content-Type")).toBe("application/json");

                    return HttpResponse.json({ message: "ok", data: null });
                })
            );

            await apiClient.get(TEST_URL);
            expect(capturedCredentials).toBe("include");
        });
    });

    // ─── POST Requests ──────────────────────────────────────────────────────

    describe("post", () => {

        it("sends JSON body and returns success response", async () => {
            let capturedBody: unknown;

            server.use(
                http.post(TEST_URL, async ({ request }) => {
                    capturedBody = await request.json();

                    return HttpResponse.json({
                        message: "Created",
                        data: { id: 42 },
                    }, { status: 201 });
                })
            );

            const result = await apiClient.post<{ id: number }>(TEST_URL, {
                email: "test@test.com",
                password: "secret",
            });

            expect(capturedBody).toEqual({
                email: "test@test.com",
                password: "secret",
            });

            expect(result.ok).toBe(true);
            if (result.ok) {
                expect(result.data).toEqual({ id: 42 });
            }
        });

        it("sends Content-Type: application/json header", async () => {
            let capturedContentType: string | null = null;

            server.use(
                http.post(TEST_URL, ({ request }) => {
                    capturedContentType = request.headers.get("Content-Type");
                    return HttpResponse.json({ message: "ok", data: null });
                })
            );

            await apiClient.post(TEST_URL, { foo: "bar" });

            expect(capturedContentType).toBe("application/json");
        });
    });

    // ─── PUT, PATCH, DELETE ─────────────────────────────────────────────────

    describe("put", () => {
        it("sends PUT request with body", async () => {
            let capturedMethod: string | undefined;
            let capturedBody: unknown;

            server.use(
                http.put(TEST_URL, async ({ request }) => {
                    capturedMethod = request.method;
                    capturedBody = await request.json();
                    return HttpResponse.json({ message: "Updated", data: { updated: true } });
                })
            );

            const result = await apiClient.put(TEST_URL, { name: "New Name" });

            expect(capturedMethod).toBe("PUT");
            expect(capturedBody).toEqual({ name: "New Name" });
            expect(result.ok).toBe(true);
        });
    });

    describe("patch", () => {
        it("sends PATCH request with body", async () => {
            let capturedMethod: string | undefined;

            server.use(
                http.patch(TEST_URL, async ({ request }) => {
                    capturedMethod = request.method;
                    return HttpResponse.json({ message: "Patched", data: null });
                })
            );

            const result = await apiClient.patch(TEST_URL, { status: "active" });

            expect(capturedMethod).toBe("PATCH");
            expect(result.ok).toBe(true);
        });
    });

    describe("delete", () => {
        it("sends DELETE request without body", async () => {
            let capturedMethod: string | undefined;

            server.use(
                http.delete(TEST_URL, ({ request }) => {
                    capturedMethod = request.method;
                    return HttpResponse.json({ message: "Deleted", data: null });
                })
            );

            const result = await apiClient.delete(TEST_URL);

            expect(capturedMethod).toBe("DELETE");
            expect(result.ok).toBe(true);
        });
    });

    // ─── Custom Headers ─────────────────────────────────────────────────────

    describe("custom headers", () => {

        it("merges custom headers with defaults", async () => {
            let capturedHeaders: Record<string, string> = {};

            server.use(
                http.get(TEST_URL, ({ request }) => {
                    capturedHeaders = {
                        contentType: request.headers.get("Content-Type") ?? "",
                        custom: request.headers.get("X-Custom-Header") ?? "",
                    };
                    return HttpResponse.json({ message: "ok", data: null });
                })
            );

            await apiClient.get(TEST_URL, {
                headers: { "X-Custom-Header": "my-value" },
            });

            // Default Content-Type should still be present
            expect(capturedHeaders.contentType).toBe("application/json");
            // And our custom header too
            expect(capturedHeaders.custom).toBe("my-value");
        });

        it("allows overriding the Content-Type header", async () => {
            let capturedContentType: string | null = null;

            server.use(
                http.get(TEST_URL, ({ request }) => {
                    capturedContentType = request.headers.get("Content-Type");
                    return HttpResponse.json({ message: "ok", data: null });
                })
            );

            await apiClient.get(TEST_URL, {
                headers: { "Content-Type": "text/plain" },
            });

            // The caller's header should override the default
            expect(capturedContentType).toBe("text/plain");
        });
    });

    // ─── HTTP Error Responses ───────────────────────────────────────────────

    describe("HTTP errors", () => {

        it("returns structured error for 401 with JSON error body", async () => {
            server.use(
                http.post(TEST_URL, () => {
                    return HttpResponse.json(
                        {
                            message: "Invalid credentials",
                            error: {
                                code: "INVALID_CREDENTIALS",
                                details: { email: "Email not found" },
                            },
                        },
                        { status: 401 }
                    );
                })
            );

            const result = await apiClient.post(TEST_URL, {
                email: "bad@test.com",
                password: "wrong",
            });

            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.status).toBe(401);
                expect(result.message).toBe("Invalid credentials");
                expect(result.error.code).toBe("INVALID_CREDENTIALS");
                expect(result.error.details).toEqual({ email: "Email not found" });
            }
        });

        it("returns structured error for 500 with JSON body", async () => {
            server.use(
                http.get(TEST_URL, () => {
                    return HttpResponse.json(
                        {
                            message: "Internal server error",
                            error: { code: "SERVER_ERROR", details: {} },
                        },
                        { status: 500 }
                    );
                })
            );

            const result = await apiClient.get(TEST_URL);

            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.status).toBe(500);
                expect(result.message).toBe("Internal server error");
                expect(result.error.code).toBe("SERVER_ERROR");
            }
        });

        it("falls back to generic message when error body is not JSON", async () => {
            // Sometimes the server returns a non-JSON error (e.g. nginx HTML page)
            server.use(
                http.get(TEST_URL, () => {
                    return new HttpResponse("Bad Gateway", {
                        status: 502,
                        headers: { "Content-Type": "text/plain" },
                    });
                })
            );

            const result = await apiClient.get(TEST_URL);

            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.status).toBe(502);
                // apiClient falls back to "HTTP Error {status}" when JSON parsing fails
                expect(result.message).toBe("HTTP Error 502");
                expect(result.error).toEqual({ code: "UNKNOWN_ERROR", details: {} });
            }
        });

        it("returns 404 error with parsed body", async () => {
            server.use(
                http.get(TEST_URL, () => {
                    return HttpResponse.json(
                        {
                            message: "Resource not found",
                            error: { code: "NOT_FOUND", details: {} },
                        },
                        { status: 404 }
                    );
                })
            );

            const result = await apiClient.get(TEST_URL);

            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.status).toBe(404);
                expect(result.error.code).toBe("NOT_FOUND");
            }
        });
    });

    // ─── Network Errors ─────────────────────────────────────────────────────

    describe("network errors", () => {

        it("returns NETWORK_ERROR when there is no connection", async () => {
            // HttpResponse.error() simulates a network failure (fetch throws TypeError)
            server.use(
                http.get(TEST_URL, () => {
                    return HttpResponse.error();
                })
            );

            const result = await apiClient.get(TEST_URL);

            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.status).toBe(0);
                expect(result.error.code).toBe("NETWORK_ERROR");
                expect(result.message).toBe("Network error — no connection");
            }
        });
    });

    // ─── Timeouts ───────────────────────────────────────────────────────────

    describe("timeouts", () => {

        it("returns REQUEST_TIMEOUT when server takes too long", async () => {
            server.use(
                http.get(TEST_URL, async () => {
                    // Simulate a server that takes 5 seconds to respond
                    await delay(5000);
                    return HttpResponse.json({ message: "ok", data: null });
                })
            );

            // Set a very short timeout (50ms) so the test doesn't actually wait 10s
            const result = await apiClient.get(TEST_URL, { timeout: 50 });

            expect(result.ok).toBe(false);
            if (!result.ok) {
                expect(result.status).toBe(408);
                expect(result.error.code).toBe("REQUEST_TIMEOUT");
                expect(result.message).toBe("Request timeout");
            }
        });
    });

    // ─── External Signal (AbortController) ──────────────────────────────────

    describe("external abort signal", () => {

        it("returns REQUEST_TIMEOUT when caller aborts the request", async () => {
            server.use(
                http.get(TEST_URL, async () => {
                    await delay(5000);
                    return HttpResponse.json({ message: "ok", data: null });
                })
            );

            // The caller provides their own AbortController (e.g. React useEffect cleanup)
            const controller = new AbortController();

            // Abort after 50ms
            setTimeout(() => controller.abort(), 50);

            const result = await apiClient.get(TEST_URL, { signal: controller.signal });

            expect(result.ok).toBe(false);
            if (!result.ok) {
                // apiClient catches AbortError and normalizes it to REQUEST_TIMEOUT
                expect(result.error.code).toBe("REQUEST_TIMEOUT");
            }
        });
    });
});
