import { render, type RenderOptions } from "@testing-library/react";
import { MemoryRouter } from "react-router";
import { AuthContext, type AuthContextType } from "@/contexts/AuthContext";
import type { ReactElement, ReactNode } from "react";

interface ProviderOptions {
    authValue?: AuthContextType;
    initialEntries?: string[];
}

export function renderWithProviders(
    ui: ReactElement,
    {
        authValue = { user: null, setUser: vi.fn() },
        initialEntries = ["/"],
        ...renderOptions
    }: ProviderOptions & Omit<RenderOptions, "wrapper"> = {}
) {
    function Wrapper({ children }: { children: ReactNode }) {
        return (
            <AuthContext.Provider value={authValue}>
                <MemoryRouter initialEntries={initialEntries}>
                    {children}
                </MemoryRouter>
            </AuthContext.Provider>
        );
    }

    return render(ui, { wrapper: Wrapper, ...renderOptions });
}
