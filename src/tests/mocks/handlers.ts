import { http, HttpResponse } from "msw";

const API_URL = "http://localhost:8080/api/v1";

export const handlers = [
    // ─── Login ──────────────────────────────────────────────────────────────
    http.post(`${API_URL}/auth/login`, async ({ request }) => {
        const body = (await request.json()) as { email: string; password: string };

        if (body.email === "maria@test.com" && body.password === "password123") {
            return HttpResponse.json({
                message: "Login successful",
                data: { name: "Maria", lastName: "Rodriguez", email: "maria@test.com" },
            });
        }

        return HttpResponse.json(
            {
                message: "Credenciales inválidas",
                error: { code: "INVALID_CREDENTIALS", details: {} },
            },
            { status: 401 }
        );
    }),

    // ─── Register ───────────────────────────────────────────────────────────
    http.post(`${API_URL}/auth/register`, async ({ request }) => {
        const body = (await request.json()) as { email: string };

        if (body.email === "existing@test.com") {
            return HttpResponse.json(
                {
                    message: "Email already exists",
                    error: {
                        code: "DUPLICATE_EMAIL",
                        details: { email: "Este correo ya está registrado" },
                    },
                },
                { status: 409 }
            );
        }

        return HttpResponse.json({
            message: "User registered",
            data: {
                userId: "user-123",
                email: body.email,
                name: "Maria",
                lastName: "Rodriguez",
                csfrToken: "token-abc",
            },
        }, { status: 201 });
    }),

    // ─── Verify Email ───────────────────────────────────────────────────────
    http.post(`${API_URL}/auth/confirm-email`, () => {
        return HttpResponse.json({
            message: "Email verified",
            data: null,
        });
    }),
];
