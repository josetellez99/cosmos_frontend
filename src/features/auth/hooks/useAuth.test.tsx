import { renderHook, act } from "@testing-library/react";
import { useAuth } from "./useAuth";
import { AuthContext } from "@/contexts/AuthContext";
import { loginService } from "@/features/auth/services/login";
import { registerUserService } from "@/features/auth/services/register";
import { verifyEmailService } from "@/features/auth/services/verify-email-service";
import type { ReactNode } from "react";

// Replace the real services with mocks — we control what they return per test
vi.mock("@/features/auth/services/login");
vi.mock("@/features/auth/services/register");
vi.mock("@/features/auth/services/verify-email-service");

const mockSetUser = vi.fn();

// A wrapper component that provides AuthContext — hooks need this to run
function createWrapper(user: { name: string; lastName: string; email: string } | null = null) {
    return function Wrapper({ children }: { children: ReactNode }) {
        return (
            <AuthContext.Provider value={{ user, setUser: mockSetUser }}>
                {children}
            </AuthContext.Provider>
        );
    };
}

describe("useAuth", () => {
    afterEach(() => {
        vi.restoreAllMocks();
        mockSetUser.mockClear();
    });

    // ─── Context requirement ────────────────────────────────────────────────

    it("throws an error when used outside AuthProvider", () => {
        // renderHook tries to call useAuth() without wrapping it in AuthContext.
        // useAuth checks for context and throws — this is by design.
        const spy = vi.spyOn(console, "error").mockImplementation(() => {});

        expect(() => renderHook(() => useAuth())).toThrow(
            "useAuth must be used within an AuthProvider"
        );

        spy.mockRestore();
    });

    // ─── loginUser ──────────────────────────────────────────────────────────

    describe("loginUser", () => {
        it("calls setUser with response data on successful login", async () => {
            const userData = { name: "Maria", lastName: "Rodriguez", email: "maria@test.com" };

            // Tell the mocked loginService to return a successful response
            vi.mocked(loginService).mockResolvedValue({
                ok: true,
                message: "Login successful",
                data: userData,
            });

            const { result } = renderHook(() => useAuth(), {
                wrapper: createWrapper(),
            });

            // act() is required because loginUser updates React state (setUser)
            await act(async () => {
                await result.current.loginUser({ email: "maria@test.com", password: "password123" });
            });

            expect(mockSetUser).toHaveBeenCalledWith(userData);
        });

        it("does NOT call setUser on failed login", async () => {
            vi.mocked(loginService).mockResolvedValue({
                ok: false,
                message: "Invalid credentials",
                status: 401,
                error: { code: "INVALID_CREDENTIALS", details: {} },
            });

            const { result } = renderHook(() => useAuth(), {
                wrapper: createWrapper(),
            });

            await act(async () => {
                await result.current.loginUser({ email: "bad@test.com", password: "wrong" });
            });

            expect(mockSetUser).not.toHaveBeenCalled();
        });

        it("returns the response from loginService", async () => {
            const successResponse = {
                ok: true as const,
                message: "Login successful",
                data: { name: "Maria", lastName: "Rodriguez", email: "maria@test.com" },
            };
            vi.mocked(loginService).mockResolvedValue(successResponse);

            const { result } = renderHook(() => useAuth(), {
                wrapper: createWrapper(),
            });

            let response;
            await act(async () => {
                response = await result.current.loginUser({
                    email: "maria@test.com",
                    password: "password123",
                });
            });

            expect(response).toEqual(successResponse);
        });
    });

    // ─── registerUser ───────────────────────────────────────────────────────

    describe("registerUser", () => {
        it("calls registerUserService and returns its response", async () => {
            
            const successResponse = {
                ok: true as const,
                message: "User registered",
                data: {
                    userId: "user-123",
                    email: "maria@test.com",
                    name: "Maria",
                    lastName: "Rodriguez",
                    csfrToken: "token-abc",
                },
            };
            vi.mocked(registerUserService).mockResolvedValue(successResponse);

            const { result } = renderHook(() => useAuth(), {
                wrapper: createWrapper(),
            });

            let response;
            await act(async () => {
                response = await result.current.registerUser({
                    email: "maria@test.com",
                    password: "password123",
                    confirmPassword: "password123",
                    name: "Maria",
                    lastName: "Rodriguez",
                    birthDate: "2000-01-01",
                });
            });

            expect(response).toEqual(successResponse);
        });
    });

    // ─── verifyEmail ────────────────────────────────────────────────────────

    describe("verifyEmail", () => {
        it("calls verifyEmailService and returns its response", async () => {
            const successResponse = {
                ok: true as const,
                message: "Email verified",
                data: null,
            };
            vi.mocked(verifyEmailService).mockResolvedValue(successResponse);

            const { result } = renderHook(() => useAuth(), {
                wrapper: createWrapper(),
            });

            let response;
            await act(async () => {
                response = await result.current.verifyEmail({
                    tokenHash: "abc123",
                    type: "signup",
                });
            });

            expect(response).toEqual(successResponse);
        });
    });
});
