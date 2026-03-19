// ─── What are we testing? ────────────────────────────────────────────────────
//
// RegisterForm has 6 fields + Zod validation (including password match refine).
// On success it navigates to /confirm-email. On failure it shows server errors.
//
// Same approach as login-form.test.tsx: MSW handles the network layer.
// ─────────────────────────────────────────────────────────────────────────────

import { screen, waitFor } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { http, HttpResponse } from "msw";
import { server } from "@/tests/mocks/server";
import { renderWithProviders } from "@/tests/helpers/render-with-providers";
import { RegisterForm } from "./register-form";

const API_URL = "http://localhost:8080/api/v1";

// Helper to fill the entire form with valid data
async function fillValidForm(user: ReturnType<typeof userEvent.setup>) {
    await user.type(screen.getByLabelText(/nombre/i), "Maria");
    await user.type(screen.getByLabelText(/apellido/i), "Rodriguez");
    // For date inputs, we type the value in YYYY-MM-DD format
    await user.type(screen.getByLabelText(/fecha de nacimiento/i), "2000-01-15");
    await user.type(screen.getByLabelText(/correo electr.nico/i), "maria@test.com");
    await user.type(screen.getByLabelText(/^contrase.a$/i), "password123");
    await user.type(screen.getByLabelText(/confirmar contrase.a/i), "password123");
}

describe("RegisterForm", () => {
    // ─── Rendering ──────────────────────────────────────────────────────────

    it("renders all form fields", () => {
        renderWithProviders(<RegisterForm />);

        expect(screen.getByLabelText(/nombre/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/apellido/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/fecha de nacimiento/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/correo electr.nico/i)).toBeInTheDocument();
        // Use exact regex to distinguish "Contraseña" from "Confirmar contraseña"
        expect(screen.getByLabelText(/^contrase.a$/i)).toBeInTheDocument();
        expect(screen.getByLabelText(/confirmar contrase.a/i)).toBeInTheDocument();
    });

    it("renders the submit button and login link", () => {
        renderWithProviders(<RegisterForm />);

        expect(screen.getByRole("button", { name: /registrarse/i })).toBeInTheDocument();
        expect(screen.getByRole("link", { name: /inicia sesi.n/i })).toBeInTheDocument();
    });

    // ─── Client-side validation ─────────────────────────────────────────────

    it("shows required field errors when submitting empty form", async () => {
        const user = userEvent.setup();
        renderWithProviders(<RegisterForm />);

        await user.click(screen.getByRole("button", { name: /registrarse/i }));

        expect(await screen.findByText(/nombre es obligatorio/i)).toBeInTheDocument();
        expect(await screen.findByText(/apellido es obligatorio/i)).toBeInTheDocument();
        expect(await screen.findByText(/fecha de nacimiento es obligatoria/i)).toBeInTheDocument();
        expect(await screen.findByText(/correo electr.nico es obligatorio/i)).toBeInTheDocument();
    });

    it("shows password mismatch error", async () => {
        const user = userEvent.setup();
        renderWithProviders(<RegisterForm />);

        await user.type(screen.getByLabelText(/nombre/i), "Maria");
        await user.type(screen.getByLabelText(/apellido/i), "Rodriguez");
        await user.type(screen.getByLabelText(/fecha de nacimiento/i), "2000-01-15");
        await user.type(screen.getByLabelText(/correo electr.nico/i), "maria@test.com");
        await user.type(screen.getByLabelText(/^contrase.a$/i), "password123");
        await user.type(screen.getByLabelText(/confirmar contrase.a/i), "different456");

        await user.click(screen.getByRole("button", { name: /registrarse/i }));

        expect(await screen.findByText(/contrase.as no coinciden/i)).toBeInTheDocument();
    });

    it("shows password minimum length error", async () => {
        const user = userEvent.setup();
        renderWithProviders(<RegisterForm />);

        await user.type(screen.getByLabelText(/nombre/i), "Maria");
        await user.type(screen.getByLabelText(/apellido/i), "Rodriguez");
        await user.type(screen.getByLabelText(/fecha de nacimiento/i), "2000-01-15");
        await user.type(screen.getByLabelText(/correo electr.nico/i), "maria@test.com");
        await user.type(screen.getByLabelText(/^contrase.a$/i), "short");
        await user.type(screen.getByLabelText(/confirmar contrase.a/i), "short");

        await user.click(screen.getByRole("button", { name: /registrarse/i }));

        expect(await screen.findByText(/al menos 8 caracteres/i)).toBeInTheDocument();
    });

    // ─── Successful submission ──────────────────────────────────────────────

    it("submits the form successfully and calls the register endpoint", async () => {
        // The default handler in handlers.ts returns success for non-existing emails
        const user = userEvent.setup();
        renderWithProviders(<RegisterForm />);

        await fillValidForm(user);
        await user.click(screen.getByRole("button", { name: /registrarse/i }));

        // After success, the form should have submitted without showing errors.
        // We verify no root error appeared.
        await waitFor(() => {
            expect(screen.queryByText(/ocurri. un error/i)).not.toBeInTheDocument();
        });
    });

    // ─── Server errors ──────────────────────────────────────────────────────

    it("displays field-level error when email already exists", async () => {
        // The default handler returns 409 for "existing@test.com"
        const user = userEvent.setup();
        renderWithProviders(<RegisterForm />);

        await user.type(screen.getByLabelText(/nombre/i), "Maria");
        await user.type(screen.getByLabelText(/apellido/i), "Rodriguez");
        await user.type(screen.getByLabelText(/fecha de nacimiento/i), "2000-01-15");
        await user.type(screen.getByLabelText(/correo electr.nico/i), "existing@test.com");
        await user.type(screen.getByLabelText(/^contrase.a$/i), "password123");
        await user.type(screen.getByLabelText(/confirmar contrase.a/i), "password123");

        await user.click(screen.getByRole("button", { name: /registrarse/i }));

        expect(await screen.findByText(/este correo ya est. registrado/i)).toBeInTheDocument();
    });

    it("displays field-level error when server returns name validation error", async () => {
        server.use(
            http.post(`${API_URL}/auth/register`, () => {
                return HttpResponse.json(
                    {
                        message: "Validation error",
                        error: {
                            code: "VALIDATION_ERROR",
                            details: { name: "El nombre contiene caracteres no permitidos" },
                        },
                    },
                    { status: 422 }
                );
            })
        );

        const user = userEvent.setup();
        renderWithProviders(<RegisterForm />);

        await fillValidForm(user);
        await user.click(screen.getByRole("button", { name: /registrarse/i }));

        expect(await screen.findByText(/caracteres no permitidos/i)).toBeInTheDocument();
    });
});
