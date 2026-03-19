// ─── What are we testing? ────────────────────────────────────────────────────
//
// GuestRoute is the inverse of ProtectedRoute:
//   - If user is null (guest) → render the child route (login/register pages)
//   - If user is authenticated → redirect to / (home)
//
// This prevents logged-in users from seeing the login/register pages.
// ─────────────────────────────────────────────────────────────────────────────

import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { AuthContext } from "@/contexts/AuthContext";
import { GuestRoute } from "./guest-route";
import type { UserSession } from "@/features/auth/types/UserSession";

function renderWithAuth(user: UserSession | null) {
    return render(
        <AuthContext.Provider value={{ user, setUser: vi.fn() }}>
            <MemoryRouter initialEntries={["/login"]}>
                <Routes>
                    <Route element={<GuestRoute />}>
                        <Route path="/login" element={<p>Login Page</p>} />
                    </Route>
                    <Route path="/" element={<p>Home Page</p>} />
                </Routes>
            </MemoryRouter>
        </AuthContext.Provider>
    );
}

describe("GuestRoute", () => {
    it("renders child route when user is a guest (null)", () => {
        renderWithAuth(null);

        expect(screen.getByText("Login Page")).toBeInTheDocument();
    });

    it("redirects to / when user is authenticated", () => {
        renderWithAuth({ name: "Maria", lastName: "Rodriguez", email: "maria@test.com" });

        expect(screen.queryByText("Login Page")).not.toBeInTheDocument();
        expect(screen.getByText("Home Page")).toBeInTheDocument();
    });
});
