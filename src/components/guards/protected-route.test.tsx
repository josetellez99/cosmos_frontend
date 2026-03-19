import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { AuthContext } from "@/contexts/AuthContext";
import { ProtectedRoute } from "./protected-route";
import type { UserSession } from "@/features/auth/types/UserSession";

function renderWithAuth(user: UserSession | null) {
    return render(
        <AuthContext.Provider value={{ user, setUser: vi.fn() }}>
            <MemoryRouter initialEntries={["/dashboard"]}>
                <Routes>
                    <Route element={<ProtectedRoute />}>
                        <Route path="/dashboard" element={<p>Dashboard Content</p>} />
                    </Route>
                    <Route path="/login" element={<p>Login Page</p>} />
                </Routes>
            </MemoryRouter>
        </AuthContext.Provider>
    );
}

describe("ProtectedRoute", () => {
    it("renders child route when user is authenticated", () => {
        renderWithAuth({ name: "Maria", lastName: "Rodriguez", email: "maria@test.com" });

        expect(screen.getByText("Dashboard Content")).toBeInTheDocument();
    });

    it("redirects to /login when user is null", () => {
        renderWithAuth(null);

        // The dashboard should NOT render
        expect(screen.queryByText("Dashboard Content")).not.toBeInTheDocument();
        // Instead, we should see the login page
        expect(screen.getByText("Login Page")).toBeInTheDocument();
    });
});
