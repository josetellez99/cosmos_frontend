import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "@/tests/mocks/server";
import { renderWithProviders } from "@/tests/helpers/render-with-providers";
import { LoginForm } from "@/features/auth/components/login-form";

const API_URL = "http://localhost:8080/api/v1";

describe("LoginForm", () => {
    // ─── Rendering ──────────────────────────────────────────────────────────

    it("renders the email and password fields", () => {
        renderWithProviders(<LoginForm />);

        // getByLabelText finds an input by its associated <label> text.
        // We use a regex with /i (case-insensitive) to be resilient to minor text changes.
        expect(screen.getByLabelText(/correo electr.nico/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/contrase.a/i)).toBeInTheDocument();
    });

    it("renders the submit button", () => {
        renderWithProviders(<LoginForm />);

        // getByRole("button") finds the <button> element.
        // { name: /entrar/i } matches the button's accessible name (its text content).
        expect(screen.getByRole("button", { name: /entrar/i })).toBeInTheDocument();
    });

    it("renders the register link", () => {
        renderWithProviders(<LoginForm />);

        expect(screen.getByRole("link", { name: /reg.strate/i })).toBeInTheDocument();
    });

    // ─── Client-side validation (Zod) ───────────────────────────────────────
    //
    // Note: We test empty-field validation here because it's the form's job to
    // show errors. Specific Zod validation rules (email format, password length)
    // are tested in the schema unit tests (login-schema.test.ts).

    it("shows validation errors when submitting an empty form", async () => {
        const user = userEvent.setup();
        renderWithProviders(<LoginForm />);

        await user.click(screen.getByRole("button", { name: /entrar/i }));

        // findByText returns a Promise — it waits for the element to appear.
        // We use it for async content (validation messages appear after submit).
        expect(await screen.findByText(/correo electr.nico es obligatorio/i)).toBeInTheDocument();
        expect(await screen.findByText(/contrase.a es obligatoria/i)).toBeInTheDocument();
    });

    // ─── Successful submission ──────────────────────────────────────────────

    it("submits the form and calls setUser on success", async () => {
        // The default handler in handlers.ts accepts maria@test.com / password123
        const user = userEvent.setup();
        const mockSetUser = vi.fn();

        renderWithProviders(<LoginForm />, {
            authValue: { user: null, setUser: mockSetUser },
        });

        await user.type(screen.getByLabelText(/correo electr.nico/i), "maria@test.com");
        await user.type(screen.getByLabelText(/contrase.a/i), "password123");
        await user.click(screen.getByRole("button", { name: /entrar/i }));

        // Wait for the async submission to complete and verify setUser was called.
        // This proves the full chain worked: form → useAuth → loginService → apiClient → MSW
        await waitFor(() => {
            expect(mockSetUser).toHaveBeenCalledWith({
                name: "Maria",
                lastName: "Rodriguez",
                email: "maria@test.com",
            });
        });
    });

    // ─── Server errors ──────────────────────────────────────────────────────

    it("displays field-level errors when server returns error details", async () => {
        // Override the default handler to return field-specific errors.
        // The form iterates response.error.details and calls setError() per field.
        server.use(
            http.post(`${API_URL}/auth/login`, () => {
                return HttpResponse.json(
                    {
                        message: "Validation error",
                        error: {
                            code: "VALIDATION_ERROR",
                            details: { email: "Este correo no existe" },
                        },
                    },
                    { status: 422 }
                );
            })
        );

        const user = userEvent.setup();
        renderWithProviders(<LoginForm />);

        await user.type(screen.getByLabelText(/correo electr.nico/i), "unknown@test.com");
        await user.type(screen.getByLabelText(/contrase.a/i), "somepassword");
        await user.click(screen.getByRole("button", { name: /entrar/i }));

        // The server error should appear next to the email field
        expect(await screen.findByText(/este correo no existe/i)).toBeInTheDocument();
    });

    it("displays password field error from server", async () => {
        server.use(
            http.post(`${API_URL}/auth/login`, () => {
                return HttpResponse.json(
                    {
                        message: "Validation error",
                        error: {
                            code: "VALIDATION_ERROR",
                            details: { password: "Contraseña incorrecta" },
                        },
                    },
                    { status: 401 }
                );
            })
        );

        const user = userEvent.setup();
        renderWithProviders(<LoginForm />);

        await user.type(screen.getByLabelText(/correo electr.nico/i), "maria@test.com");
        await user.type(screen.getByLabelText(/contrase.a/i), "wrongpassword");
        await user.click(screen.getByRole("button", { name: /entrar/i }));

        expect(await screen.findByText(/contrase.a incorrecta/i)).toBeInTheDocument();
    });
});
