# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

Cosmos is the Frontend app that consumes an api rest. This app pretends to be a way to organize your life and track your goals.

## Commands

- `npm run dev` — Start Vite dev server
- `npm run build` — TypeScript check + Vite production build
- `npm run lint` — ESLint check
- `npm run preview` — Preview production build

## Architecture

React 19 + TypeScript + Vite app with Tailwind CSS v4 and shadcn UI components.

### Project Structure

- **Feature-based organization:** Domain logic lives in `src/features/<feature>/` with its own `services/`, `components/`, `hooks/`, and `types/` subdirectories.
- **Pages:** Route-level components in `src/pages/`.
- **Shared UI:** shadcn components in `src/components/ui/`, layouts in `src/components/layouts/`.
- **API layer:** Custom fetch wrapper in `src/lib/apiClient.ts` with typed generic methods (`get`, `post`, `put`, `patch`, `delete`). Endpoints defined in `src/lib/endpointsMap.ts`.
- **Validation:** Zod schemas in `src/zodSchemas/` paired with React Hook Form via `@hookform/resolvers`.
- **State:** React Context API for auth state (`src/contexts/` + `src/providers/`). Auth state is seeded on mount from the `cosmos_user_session` cookie (see **Authentication** below).
- **Types:** Shared types in `src/types/`, feature-specific types in `src/features/<feature>/types/` split into `request/` and `response/`.

### Path Alias

`@/*` maps to `./src/*` (configured in tsconfig and vite).

### API Pattern

Services call `apiClient` methods and return `ApiResponse<T>` — a discriminated union (`SuccessApiResponse<T> | ErrorApiResponse`). Check `response.ok` to narrow the type. API base URL comes from `VITE_API_URL` env var.

### Form Pattern

Forms use React Hook Form + Zod schema + `zodResolver`. Schemas live in `src/zodSchemas/`, form components in feature directories.

### Styling

Tailwind CSS v4 with CSS variables for theming (defined in `src/index.css`). Component variants use `class-variance-authority` (CVA). The `cn()` utility from `src/lib/utils.ts` merges classes via `clsx` + `tailwind-merge`.

### Authentication

Two-cookie strategy — the backend sets both on login and token refresh, clears both on logout:

| Cookie | `httpOnly` | Accessible by JS | Purpose |
|--------|-----------|-----------------|---------|
| `cosmos_access_token` | yes | no | Signs every API request |
| `cosmos_user_session` | no | yes | Stores `{ name, lastName, email }` as URL-encoded JSON |

**Checking auth state:** read `AuthContext` via `useContext(AuthContext)`. `user !== null` means logged in.

**On app load:** `AuthContextProvider` calls `useUserSession()` (`src/features/auth/hooks/useUserSession.ts`) to parse the cookie and seed the initial state — no API request needed.

**On login:** after a successful login API call, call `setUser({ name, lastName, email })` to sync in-memory state with the newly set cookie.

**`UserSession` type:** `src/features/auth/types/UserSession.ts` — `{ name: string; lastName: string; email: string }`.

### Supabase

Database types are generated from Supabase. To regenerate: `npx supabase gen types --lang=typescript --project-id "$PROJECT_REF" --schema public > src/types/database.types.ts`

### TypeScript

Strict mode enabled with `noUnusedLocals` and `noUnusedParameters`. Target ES2022, bundler module resolution.

### Conventions

- Always use the absolute import strategy "@/features/auth/..."