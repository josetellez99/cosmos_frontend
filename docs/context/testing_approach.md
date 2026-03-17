# Cosmos Frontend — Testing Strategy

This document defines the testing standards, structure, and guidelines for the Cosmos frontend project. It covers unit testing (with Vitest + React Testing Library), integration testing, and end-to-end (E2E) testing, along with CI integration via GitHub Actions.

---

## Table of Contents

1. [Testing Philosophy](#1-testing-philosophy)
2. [Testing Stack](#2-testing-stack)
3. [Project Setup](#3-project-setup)
4. [File Structure & Naming](#4-file-structure--naming)
5. [Unit Testing Guidelines](#5-unit-testing-guidelines)
   - [Phase 1: Manual Mocks (`vi.mock`)](#phase-1-manual-mocks-vimock)
   - [Phase 2: MSW (Mock Service Worker)](#phase-2-msw-mock-service-worker)
6. [What to Test — Priority Map](#6-what-to-test--priority-map)
7. [Detailed Test Specifications by Module](#7-detailed-test-specifications-by-module)
8. [Coverage Goals](#8-coverage-goals)
9. [Testing Patterns & Conventions](#9-testing-patterns--conventions)
10. [Integration Testing](#10-integration-testing)
11. [End-to-End (E2E) Testing](#11-end-to-end-e2e-testing)
12. [CI Integration — GitHub Actions](#12-ci-integration--github-actions)
13. [Quick Reference Cheatsheet](#13-quick-reference-cheatsheet)

---

## 1. Testing Philosophy

  We follow the **Testing Trophy** model (Kent C. Dodds), which prioritizes:

  ```
          ╱ E2E ╲            ← Few: critical user journeys
        ╱────────╲
        ╱Integration╲        ← Some: feature flows across components
      ╱──────────────╲
      ╱  Unit Tests     ╲     ← Many: pure logic, utilities, schemas
    ╱────────────────────╲
    ╱   Static Analysis     ╲  ← TypeScript + ESLint (already in place)
  ```
## 2. Testing Stack

  | Tool | Purpose | When to Install |
  |------|---------|----------------|
  | **Vitest** | Test runner + assertions | Already in `devDependencies` |
  | **@testing-library/react** | Component rendering + queries | Phase 1 |
  | **@testing-library/jest-dom** | DOM matchers (`toBeInTheDocument`, etc.) | Phase 1 |
  | **@testing-library/user-event** | Realistic user interactions (click, type) | Phase 1 |
  | **jsdom** | Browser-like DOM for Node.js | Phase 1 |
  | **msw** (Mock Service Worker) | Network-level request mocking | Phase 2 |

### 3 Project setup

  | Script | Purpose |
  |--------|---------|
  | `npm test` | Run Vitest in **watch mode** — re-runs tests on file changes (use during development) |
  | `npm run test:run` | Run all tests **once** and exit (use in CI) |
  | `npm run test:coverage` | Run tests once + generate coverage report |
  | `npm run test:ui` | Open Vitest's browser-based UI to explore tests visually |

## 4. File Structure & Naming

### 4.1 Co-location Strategy

  Test files live **next to the file they test**, with the suffix `.test.ts` or `.test.tsx`:

  ```
  src/
  ├── lib/
  │   ├── apiClient.ts
  │   ├── apiClient.test.ts          ← unit test
  │   ├── utils.ts
  │   └── utils.test.ts              ← unit test
  ├── features/
  │   └── auth/
  │       ├── helpers/
  │       │   ├── getUserSession.ts
  │       │   └── getUserSession.test.ts
  │       ├── services/
  │       │   ├── login.ts
  │       │   └── login.test.ts
  │       ├── hooks/
  │       │   ├── useAuth.ts
  │       │   └── useAuth.test.ts
  │       └── components/
  │           ├── login-form.tsx
  │           └── login-form.test.tsx
  ├── components/
  │   └── guards/
  │       ├── protected-route.tsx
  │       └── protected-route.test.tsx
  ├── zodSchemas/
  │   └── auth/
  │       ├── login-schema.ts
  │       └── login-schema.test.ts
  └── tests/                          ← shared test infrastructure only
      ├── setup.ts
      ├── helpers/                    ← reusable test utilities
      │   └── render-with-providers.tsx
      └── mocks/                      ← shared mock data & MSW handlers (Phase 2)
          └── handlers.ts
  ```

### 4.3 Naming Rules

  | Rule | Example |
  |------|---------|
  | Test file matches source file | `login.ts` → `login.test.ts` |
  | Use `.test.tsx` for files that render JSX | `login-form.test.tsx` |
  | Use `.test.ts` for pure logic | `getUserSession.test.ts` |
  | Describe blocks match the export name | `describe("loginService", ...)` |
  | Test names describe behavior | `it("returns error when credentials are invalid", ...)` |

## 5. Unit Testing Guidelines

  ### Phase 1: Manual Mocks (`vi.mock`)

    This is your starting approach. You mock dependencies directly using Vitest's `vi.mock()`.

    **How it works:** `vi.mock("@/lib/apiClient")` replaces the real `apiClient` module with a mock. You then control what `apiClient.post` returns per test.

  ### Phase 2: MSW (Mock Service Worker)

    After you're comfortable with Phase 1, migrate to MSW. Instead of mocking JavaScript modules, MSW intercepts actual `fetch()` calls at the network level.

    **Why MSW is the professional standard:**
    - Tests exercise the **real** `apiClient` code (serialization, headers, error handling).
    - Mocks match what the backend actually sends — if the API changes, tests catch it.
    - The same handlers work in unit tests, integration tests, and even in-browser development.

## 6. What to Test — Priority Map

Modules are prioritized by **impact** (how much breaks if it's wrong) and **testability** (how easy it is to test). Start from Priority 1 and work your way down.

### Priority 1 — Pure Logic (No dependencies, no DOM)

These are the fastest to test and give the most confidence per line of test code.

| Module | File | What to Test |
|--------|------|-------------|
| Zod Schemas | `zodSchemas/auth/login-schema.ts` | Valid input passes, invalid input returns correct errors |
| Zod Schemas | `zodSchemas/auth/register-schema.ts` | All validations including password match refine |
| Helpers | `features/auth/helpers/getUserSession.ts` | Cookie parsing, missing cookie, malformed JSON |
| Utilities | `lib/utils.ts` | `cn()` merges classes correctly |

### Priority 2 — API Layer (Mock fetch or use MSW)

| Module | File | What to Test |
|--------|------|-------------|
| API Client | `lib/apiClient.ts` | Success responses, HTTP errors, timeouts, network errors |
| Services | `features/auth/services/login.ts` | Correct endpoint + body, success/error propagation |
| Services | `features/auth/services/register.ts` | Same as login |
| Services | `features/auth/services/verify-email-service.ts` | Same as login |

### Priority 3 — Hooks (Require wrapper providers)

| Module | File | What to Test |
|--------|------|-------------|
| useAuth | `features/auth/hooks/useAuth.ts` | Calls correct service, updates context on login, throws without provider |

### Priority 4 — Components (Require DOM + user interactions)

| Module | File | What to Test |
|--------|------|-------------|
| LoginForm | `features/auth/components/login-form.tsx` | Renders fields, validates on submit, shows errors, navigates on success |
| RegisterForm | `features/auth/components/register-form.tsx` | Same + password match validation |
| ProtectedRoute | `components/guards/protected-route.tsx` | Redirects when no user, renders outlet when authenticated |
| GuestRoute | `components/guards/guest-route.tsx` | Redirects when user exists, renders outlet when guest |

## 7. Detailed Test Specifications by Module

### 7.1 Zod Schemas

**File:** `src/zodSchemas/auth/login-schema.test.ts`

```ts
import { loginSchema } from "./login-schema";

describe("loginSchema", () => {
  it("passes with valid email and password", () => {
    const result = loginSchema.safeParse({
      email: "user@example.com",
      password: "password123",
    });
    expect(result.success).toBe(true);
  });

  it("fails when email is empty", () => {
    const result = loginSchema.safeParse({ email: "", password: "123" });
    expect(result.success).toBe(false);
    if (!result.success) {
      const emailError = result.error.issues.find((i) => i.path[0] === "email");
      expect(emailError).toBeDefined();
    }
  });

  it("fails when email format is invalid", () => {
    const result = loginSchema.safeParse({ email: "not-an-email", password: "123" });
    expect(result.success).toBe(false);
  });

  it("fails when password is empty", () => {
    const result = loginSchema.safeParse({ email: "user@test.com", password: "" });
    expect(result.success).toBe(false);
  });
});
```

**File:** `src/zodSchemas/auth/register-schema.test.ts`

Test cases to write:
- Valid full input passes
- Each required field empty produces an error
- Email format validation
- Password minimum length (8 chars)
- Password mismatch fails with `"Las contrasenas no coinciden"` on `confirmPassword` path
- Password match passes

---

### 7.2 `getUserSession` Helper

**File:** `src/features/auth/helpers/getUserSession.test.ts`

```ts
import { getUserSession } from "./getUserSession";

describe("getUserSession", () => {
  afterEach(() => {
    // Clean up cookies between tests
    document.cookie = "cosmos_user_session=; Max-Age=0";
  });

  it("returns null when cookie does not exist", () => {
    expect(getUserSession()).toBeNull();
  });

  it("parses a valid session cookie", () => {
    const session = { name: "Maria", lastName: "Rodriguez", email: "maria@test.com" };
    document.cookie = `cosmos_user_session=${encodeURIComponent(JSON.stringify(session))}`;

    expect(getUserSession()).toEqual(session);
  });

  it("returns null when cookie contains malformed JSON", () => {
    document.cookie = "cosmos_user_session=not-valid-json";
    expect(getUserSession()).toBeNull();
  });
});
```

---

### 7.3 `cn` Utility

**File:** `src/lib/utils.test.ts`

```ts
import { cn } from "./utils";

describe("cn", () => {
  it("merges multiple class strings", () => {
    expect(cn("px-2", "py-1")).toBe("px-2 py-1");
  });

  it("handles conditional classes", () => {
    expect(cn("base", false && "hidden", "visible")).toBe("base visible");
  });

  it("resolves Tailwind conflicts (last wins)", () => {
    expect(cn("px-2", "px-4")).toBe("px-4");
  });
});
```

---

### 7.4 `apiClient`

**File:** `src/lib/apiClient.test.ts`

This is the most important unit to test thoroughly because every service depends on it.

Test cases:
- **Successful GET** — returns `{ ok: true, data }` from JSON response
- **Successful POST** — sends JSON body, correct Content-Type header, credentials: include
- **HTTP error (e.g. 401)** — returns `{ ok: false, status: 401, error }` with parsed error body
- **HTTP error with unparseable body** — falls back to `"HTTP Error {status}"` message
- **Network error** — fetch throws, returns `{ ok: false, status: 0, error: { code: "NETWORK_ERROR" } }`
- **Timeout** — returns `{ ok: false, status: 408, error: { code: "REQUEST_TIMEOUT" } }`
- **Custom headers** — caller's headers are merged with defaults

> For `apiClient` tests, mock `fetch` globally with `vi.stubGlobal("fetch", vi.fn())` since this module calls `fetch` directly. In Phase 2 (MSW), these tests become even cleaner.

---

### 7.5 Auth Services (`login`, `register`, `verify-email-service`)

See the Phase 1 and Phase 2 examples in [Section 5](#5-unit-testing-guidelines). Each service is a thin wrapper around `apiClient`, so tests should verify:

1. The correct endpoint is called
2. The request body is forwarded
3. The response is returned as-is (no transformation)

---

### 7.6 `useAuth` Hook

**File:** `src/features/auth/hooks/useAuth.test.ts`

Hooks can't be tested directly — they must run inside a component. Use `renderHook` from `@testing-library/react`:

```ts
import { renderHook, act } from "@testing-library/react";
import { useAuth } from "./useAuth";
import { AuthContext } from "@/contexts/AuthContext";
import { loginService } from "@/features/auth/services/login";
import type { ReactNode } from "react";

vi.mock("@/features/auth/services/login");
vi.mock("@/features/auth/services/register");
vi.mock("@/features/auth/services/verify-email-service");

const mockSetUser = vi.fn();

// Wrapper that provides AuthContext
function wrapper({ children }: { children: ReactNode }) {
  return (
    <AuthContext.Provider value={{ user: null, setUser: mockSetUser }}>
      {children}
    </AuthContext.Provider>
  );
}

describe("useAuth", () => {
  afterEach(() => vi.restoreAllMocks());

  it("throws if used outside AuthProvider", () => {
    // Suppress React error boundary console output
    const spy = vi.spyOn(console, "error").mockImplementation(() => {});
    expect(() => renderHook(() => useAuth())).toThrow(
      "useAuth must be used within an AuthProvider"
    );
    spy.mockRestore();
  });

  it("calls setUser with response data on successful login", async () => {
    const userData = { name: "Maria", lastName: "Rodriguez", email: "maria@test.com" };
    vi.mocked(loginService).mockResolvedValue({
      ok: true,
      message: "Success",
      data: userData,
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.loginUser({ email: "maria@test.com", password: "pass123" });
    });

    expect(mockSetUser).toHaveBeenCalledWith(userData);
  });

  it("does NOT call setUser on failed login", async () => {
    vi.mocked(loginService).mockResolvedValue({
      ok: false,
      message: "Invalid",
      status: 401,
      error: { code: "INVALID_CREDENTIALS", details: {} },
    });

    const { result } = renderHook(() => useAuth(), { wrapper });

    await act(async () => {
      await result.current.loginUser({ email: "bad@test.com", password: "wrong" });
    });

    expect(mockSetUser).not.toHaveBeenCalled();
  });
});
```

---

### 7.7 Route Guards (`ProtectedRoute`, `GuestRoute`)

**File:** `src/components/guards/protected-route.test.tsx`

```ts
import { render, screen } from "@testing-library/react";
import { MemoryRouter, Route, Routes } from "react-router";
import { AuthContext } from "@/contexts/AuthContext";
import { ProtectedRoute } from "./protected-route";

function renderWithAuth(user: { name: string; lastName: string; email: string } | null) {
  return render(
    <AuthContext.Provider value={{ user, setUser: vi.fn() }}>
      <MemoryRouter initialEntries={["/dashboard"]}>
        <Routes>
          <Route element={<ProtectedRoute />}>
            <Route path="/dashboard" element={<p>Dashboard</p>} />
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
    expect(screen.getByText("Dashboard")).toBeInTheDocument();
  });

  it("redirects to /login when user is null", () => {
    renderWithAuth(null);
    expect(screen.getByText("Login Page")).toBeInTheDocument();
  });
});
```

Apply the same pattern for `GuestRoute` (inverse logic).

---

### 7.8 Form Components (`LoginForm`, `RegisterForm`)

**File:** `src/features/auth/components/login-form.test.tsx`

Form component tests need a helper that wraps with all required providers (AuthContext + Router). Create this shared helper:

**`src/tests/helpers/render-with-providers.tsx`:**

```tsx
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
        <MemoryRouter initialEntries={initialEntries}>{children}</MemoryRouter>
      </AuthContext.Provider>
    );
  }

  return render(ui, { wrapper: Wrapper, ...renderOptions });
}
```

**LoginForm test cases:**

```tsx
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "./login-form";
import { renderWithProviders } from "@/tests/helpers/render-with-providers";
import { loginService } from "@/features/auth/services/login";

vi.mock("@/features/auth/services/login");

describe("LoginForm", () => {
  afterEach(() => vi.restoreAllMocks());

  it("renders email and password fields", () => {
    renderWithProviders(<LoginForm />);
    expect(screen.getByLabelText(/correo electr.nico/i)).toBeInTheDocument();
    expect(screen.getByLabelText(/contrase.a/i)).toBeInTheDocument();
  });

  it("shows validation errors when submitting empty form", async () => {
    const user = userEvent.setup();
    renderWithProviders(<LoginForm />);

    await user.click(screen.getByRole("button", { name: /entrar/i }));

    // Zod validation messages should appear
    expect(await screen.findByText(/correo electr.nico es obligatorio/i)).toBeInTheDocument();
  });

  it("calls loginUser and navigates on success", async () => {
    const user = userEvent.setup();
    vi.mocked(loginService).mockResolvedValue({
      ok: true,
      message: "Success",
      data: { name: "Maria", lastName: "Rodriguez", email: "maria@test.com" },
    });

    renderWithProviders(<LoginForm />);

    await user.type(screen.getByLabelText(/correo electr.nico/i), "maria@test.com");
    await user.type(screen.getByLabelText(/contrase.a/i), "password123");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    expect(loginService).toHaveBeenCalledWith({
      email: "maria@test.com",
      password: "password123",
    });
  });

  it("displays server error on failed login", async () => {
    const user = userEvent.setup();
    vi.mocked(loginService).mockResolvedValue({
      ok: false,
      message: "Credenciales invalidas",
      status: 401,
      error: { code: "INVALID_CREDENTIALS", details: {} },
    });

    renderWithProviders(<LoginForm />);

    await user.type(screen.getByLabelText(/correo electr.nico/i), "bad@test.com");
    await user.type(screen.getByLabelText(/contrase.a/i), "wrong");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    expect(await screen.findByText(/credenciales invalidas/i)).toBeInTheDocument();
  });
});
```

---

## 8. Coverage Goals

Industry-standard thresholds for a growing project:

| Category | Target | Rationale |
|----------|--------|-----------|
| **Utilities & Helpers** | 90%+ | Pure functions — easy to test exhaustively |
| **Zod Schemas** | 90%+ | Validation is critical — bugs here mean bad data |
| **API Client** | 85%+ | Central to every feature; all error paths matter |
| **Services** | 80%+ | Thin wrappers — high value per test |
| **Hooks** | 80%+ | Business logic lives here |
| **Form Components** | 75%+ | Complex interactions but high user impact |
| **Route Guards** | 80%+ | Security-critical — wrong redirect = broken UX |
| **UI Components** | 60%+ | Only test components with logic (variants, conditional rendering) |
| **Overall Project** | 80%+ | Industry standard for production applications |

Configure thresholds in `vitest.config.ts`:

```ts
coverage: {
  // ... existing config
  thresholds: {
    statements: 80,
    branches: 80,
    functions: 80,
    lines: 80,
  },
},
```

> **Note:** Start without thresholds enforced. Add them after you've written your first round of tests and know where you stand. Enforcing 80% on day one will just block your CI.

---

## 9. Testing Patterns & Conventions

### 9.1 Test Structure: Arrange-Act-Assert (AAA)

Every test follows this pattern:

```ts
it("returns null when cookie is missing", () => {
  // Arrange — set up preconditions
  document.cookie = "cosmos_user_session=; Max-Age=0";

  // Act — execute the code under test
  const result = getUserSession();

  // Assert — verify the outcome
  expect(result).toBeNull();
});
```

### 9.2 `describe` / `it` Naming

```ts
// describe: name of the unit being tested
describe("loginService", () => {
  // it: describes the expected behavior starting with a verb
  it("returns user data on successful login", () => { ... });
  it("returns error when credentials are invalid", () => { ... });
});
```

### 9.3 Querying DOM Elements (Priority Order)

When testing components, prefer queries in this order (most accessible first):

| Priority | Query | When to Use |
|----------|-------|-------------|
| 1 | `getByRole` | Buttons, links, headings, inputs with labels |
| 2 | `getByLabelText` | Form inputs with `<label>` |
| 3 | `getByPlaceholderText` | Inputs without visible labels |
| 4 | `getByText` | Non-interactive text content |
| 5 | `getByTestId` | **Last resort** — add `data-testid` only when nothing else works |

### 9.4 Async Assertions

For content that appears after an async operation (API calls, state updates):

```ts
// Use findBy* (returns a promise, waits up to 1s by default)
expect(await screen.findByText(/error message/i)).toBeInTheDocument();

// DO NOT use getBy* for async content — it will fail immediately
```

### 9.5 User Interactions

Always use `@testing-library/user-event` over `fireEvent`:

```ts
import userEvent from "@testing-library/user-event";

// Setup at the top of each test (or in beforeEach)
const user = userEvent.setup();

// Simulates real user behavior (focus, keystrokes, blur)
await user.type(input, "hello@test.com");
await user.click(button);
await user.clear(input);
```

### 9.6 Mock Cleanup

```ts
afterEach(() => {
  vi.restoreAllMocks(); // Restores original implementations
});
```

### 9.7 Avoiding Common Mistakes

| Mistake | Fix |
|---------|-----|
| Testing implementation details (e.g., state values) | Test what the user sees or what the function returns |
| Snapshot testing for everything | Only snapshot complex, stable markup. Prefer explicit assertions. |
| `getByTestId` as default query | Use accessible queries (`getByRole`, `getByLabelText`) first |
| Not awaiting async operations | Use `findBy*` or wrap in `waitFor()` |
| Testing third-party code (Zod internals, React Router) | Test YOUR integration with the library, not the library itself |

---

## 10. Integration Testing

Integration tests verify that **multiple units work together** to complete a feature flow. You'll implement these after unit tests are solid.

### 10.1 What Integration Tests Cover in Cosmos

| Test | What it Verifies |
|------|-----------------|
| Login flow | `LoginForm` → `useAuth` → `loginService` → `apiClient` → context update → navigation |
| Register flow | `RegisterForm` → `useAuth` → `registerUserService` → navigation to confirm-email |
| Auth guard + provider | `AuthContextProvider` reads cookie → `ProtectedRoute` grants/denies access |

### 10.2 How They Differ from Unit Tests

| Aspect | Unit Test | Integration Test |
|--------|-----------|-----------------|
| Scope | One function/component | Multiple modules together |
| Mocking | Mock direct dependencies | Mock only external boundaries (network via MSW) |
| Speed | Very fast (<10ms) | Fast (<100ms) |
| Confidence | Logic correctness | Feature works end-to-end |

### 10.3 Integration Test Example (Login Flow)

```tsx
// src/features/auth/components/__integration__/login-flow.test.tsx
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { LoginForm } from "../login-form";
import { renderWithProviders } from "@/tests/helpers/render-with-providers";
// No vi.mock — MSW handles the network layer

describe("Login Flow (integration)", () => {
  it("logs in and updates auth context on valid credentials", async () => {
    const mockSetUser = vi.fn();
    const user = userEvent.setup();

    renderWithProviders(<LoginForm />, {
      authValue: { user: null, setUser: mockSetUser },
    });

    await user.type(screen.getByLabelText(/correo electr.nico/i), "maria@test.com");
    await user.type(screen.getByLabelText(/contrase.a/i), "password123");
    await user.click(screen.getByRole("button", { name: /entrar/i }));

    // With MSW, the real apiClient runs, the real service runs.
    // We only verify the end result.
    await vi.waitFor(() => {
      expect(mockSetUser).toHaveBeenCalledWith({
        name: "Maria",
        lastName: "Rodriguez",
        email: "maria@test.com",
      });
    });
  });
});
```

### 10.4 File Placement

Integration tests live in an `__integration__` folder next to the feature components:

```
src/features/auth/components/
├── login-form.tsx
├── login-form.test.tsx              ← unit test
└── __integration__/
    └── login-flow.test.tsx          ← integration test
```

---

## 11. End-to-End (E2E) Testing

E2E tests run in a **real browser** and interact with the full application (frontend + backend). They simulate actual user sessions.

### 11.1 Recommended Tool: Playwright

| Why Playwright | Details |
|---------------|---------|
| Multi-browser | Chromium, Firefox, WebKit |
| Fast & reliable | Auto-waiting, no flaky selectors |
| Great DX | Codegen, trace viewer, VS Code extension |
| Industry standard | Used by Microsoft, Google, Vercel |

### 11.2 What E2E Tests Cover

Only test **critical user journeys** — the flows that, if broken, would make the app unusable:

1. **Registration flow** — Fill form → Submit → See confirm-email page
2. **Email verification** — Click verification link → Account confirmed
3. **Login flow** — Enter credentials → Redirected to dashboard
4. **Auth persistence** — Refresh page → Still logged in (cookie)
5. **Protected route** — Visit /dashboard without login → Redirected to /login
6. **Logout flow** — Click logout → Redirected to /login → Cookie cleared

### 11.3 Setup (Future)

```bash
npm install -D @playwright/test
npx playwright install
```

**`playwright.config.ts`:**

```ts
import { defineConfig } from "@playwright/test";

export default defineConfig({
  testDir: "./e2e",
  baseURL: "http://localhost:5173",
  use: {
    trace: "on-first-retry",
  },
  webServer: {
    command: "npm run dev",
    port: 5173,
    reuseExistingServer: !process.env.CI,
  },
});
```

### 11.4 File Structure

```
e2e/
├── auth/
│   ├── login.spec.ts
│   ├── register.spec.ts
│   └── logout.spec.ts
└── navigation/
    └── protected-routes.spec.ts
```

### 11.5 Example E2E Test

```ts
// e2e/auth/login.spec.ts
import { test, expect } from "@playwright/test";

test("user can log in with valid credentials", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel(/correo electr.nico/i).fill("maria@test.com");
  await page.getByLabel(/contrase.a/i).fill("password123");
  await page.getByRole("button", { name: /entrar/i }).click();

  // Should redirect to the home/dashboard page
  await expect(page).toHaveURL("/");
});

test("shows error with invalid credentials", async ({ page }) => {
  await page.goto("/login");

  await page.getByLabel(/correo electr.nico/i).fill("bad@test.com");
  await page.getByLabel(/contrase.a/i).fill("wrongpassword");
  await page.getByRole("button", { name: /entrar/i }).click();

  await expect(page.getByText(/error/i)).toBeVisible();
});
```

### 11.6 E2E vs Unit/Integration — When to Use What

| Scenario | Test Type |
|----------|-----------|
| Does `loginSchema` reject empty emails? | Unit |
| Does `LoginForm` show validation errors and call the service? | Unit |
| Does the login form + real service + context update work together? | Integration |
| Can a real user log in from the browser and see their dashboard? | E2E |

---

## 12. CI Integration — GitHub Actions

### 12.1 How CI Testing Works

**CI (Continuous Integration)** is a practice where every push or pull request automatically triggers a pipeline that builds and tests your code. This catches bugs before they reach the `main` branch.

**GitHub Actions** is GitHub's built-in CI service. You define workflows in YAML files inside `.github/workflows/`.

### 12.2 Workflow File

Create `.github/workflows/test.yml`:

```yaml
name: Tests

# When does this run?
on:
  push:
    branches: [main]       # Every push to main
  pull_request:
    branches: [main]       # Every PR targeting main

jobs:
  test:
    name: Unit & Integration Tests
    runs-on: ubuntu-latest

    steps:
      # 1. Check out the repository code
      - name: Checkout code
        uses: actions/checkout@v4

      # 2. Set up Node.js
      - name: Setup Node.js
        uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"       # Caches node_modules for faster installs

      # 3. Install dependencies
      - name: Install dependencies
        run: npm ci          # `ci` is faster than `install` and uses lockfile exactly

      # 4. Type check (catches errors without running the app)
      - name: TypeScript check
        run: npx tsc --noEmit

      # 5. Lint
      - name: Lint
        run: npm run lint

      # 6. Run tests with coverage
      - name: Run tests
        run: npm run test:run -- --coverage

      # 7. (Optional) Upload coverage report as artifact
      - name: Upload coverage report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: coverage-report
          path: coverage/
          retention-days: 30
```

### 12.3 What Each Step Does

| Step | Purpose |
|------|---------|
| `actions/checkout@v4` | Downloads your repo into the runner |
| `actions/setup-node@v4` | Installs Node.js and caches npm packages |
| `npm ci` | Clean install from `package-lock.json` (deterministic, no surprises) |
| `npx tsc --noEmit` | Type-checks without building — catches type errors early |
| `npm run lint` | ESLint check — enforces code quality |
| `npm run test:run -- --coverage` | Runs all tests once + generates coverage |
| `actions/upload-artifact@v4` | Saves the HTML coverage report so you can download it from the Actions tab |

### 12.4 Branch Protection (Recommended)

After the workflow is working, go to your repo's **Settings > Branches > Branch protection rules** and:

1. Add a rule for `main`
2. Check **"Require status checks to pass before merging"**
3. Select the **"Unit & Integration Tests"** check

This prevents merging PRs that have failing tests.

### 12.5 E2E in CI (Future)

When you add Playwright E2E tests, add a second job:

```yaml
  e2e:
    name: E2E Tests
    runs-on: ubuntu-latest
    needs: test  # Only run E2E if unit tests pass
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: "npm"
      - run: npm ci
      - run: npx playwright install --with-deps
      - run: npx playwright test
      - name: Upload Playwright report
        if: always()
        uses: actions/upload-artifact@v4
        with:
          name: playwright-report
          path: playwright-report/
```

---

## 13. Quick Reference Cheatsheet

### Run Commands

```bash
npm test                      # Watch mode (development)
npm run test:run              # Run once (CI)
npm run test:coverage         # Run once + coverage
npm run test:run -- login     # Run only tests matching "login"
npm run test:run -- --reporter=verbose  # Detailed output
```

### Test File Template (Pure Logic)

```ts
import { myFunction } from "./my-module";

describe("myFunction", () => {
  it("does X when given Y", () => {
    const result = myFunction(input);
    expect(result).toBe(expected);
  });
});
```

### Test File Template (Component)

```tsx
import { screen } from "@testing-library/react";
import userEvent from "@testing-library/user-event";
import { renderWithProviders } from "@/tests/helpers/render-with-providers";
import { MyComponent } from "./my-component";

describe("MyComponent", () => {
  it("renders correctly", () => {
    renderWithProviders(<MyComponent />);
    expect(screen.getByRole("button", { name: /submit/i })).toBeInTheDocument();
  });

  it("handles user interaction", async () => {
    const user = userEvent.setup();
    renderWithProviders(<MyComponent />);

    await user.click(screen.getByRole("button", { name: /submit/i }));

    expect(await screen.findByText(/success/i)).toBeInTheDocument();
  });
});
```

### Vitest Matchers (Most Used)

```ts
expect(value).toBe(exact)                    // Strict equality
expect(value).toEqual(deep)                  // Deep equality
expect(value).toBeTruthy()                   // Truthy check
expect(value).toBeNull()                     // Null check
expect(fn).toHaveBeenCalledWith(args)        // Mock was called with args
expect(fn).toHaveBeenCalledTimes(n)          // Mock call count

// DOM matchers (from @testing-library/jest-dom)
expect(element).toBeInTheDocument()          // Element exists in DOM
expect(element).toBeDisabled()               // Element is disabled
expect(element).toHaveTextContent("text")    // Element contains text
expect(element).toBeVisible()                // Element is visible
```

### Implementation Order

```
1. Unit testing over the pure functions> helpers, utilities.
Week 2:  apiClient + auth services (Phase 1 — vi.mock)
Week 3:  useAuth hook + route guards
Week 4:  LoginForm + RegisterForm components
Week 5:  Migrate services to MSW (Phase 2)
Week 6:  Integration tests with MSW
Future:  Playwright E2E setup
```