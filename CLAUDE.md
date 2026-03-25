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

`@/*` maps to `./src/*` (always use this importing strategy).

### API Pattern

Services call `apiClient` methods and return `ApiResponse<T>` — a discriminated union (`SuccessApiResponse<T> | ErrorApiResponse`). Check `response.ok` to narrow the type. API base URL comes from `VITE_API_URL` env var.

### Data Flow Pattern (TanStack Query)

**Standard flow for all async data:**
```
UI Component → Custom Hook (useQuery/useMutation) → Service Layer → apiClient
```

**For queries (fetching data):**
1. Create query key factory in `src/features/<feature>/helpers/queryKeys.ts` with hierarchical structure (see `goalQueryKeys`)
2. Create `useGet<Feature>()` hook in `src/features/<feature>/hooks/` that wraps `useQuery()`
3. Hook calls service function from `src/features/<feature>/services/`
4. Service calls `apiClient.get()` and returns `ApiResponse<T>`
5. Hook extracts data via `response.ok` check, exposes `{ data, isLoading, error, refetch }`
6. UI component renders based on states; no `useEffect` needed — query hook handles fetching on mount

**For mutations (create/update/delete):**
1. Create `useCreate<Feature>()`, `useUpdate<Feature>()`, `useDelete<Feature>()` hooks in `src/features/<feature>/hooks/`
2. Hook wraps `useMutation()` with service function
3. Implement `onMutate` for optimistic updates (snapshot current cache, update UI immediately)
4. Implement `onError` for rollback (restore snapshot if mutation fails)
5. Implement `onSuccess` for query invalidation (invalidate related list queries to refetch)
6. Hook exposes `{ mutate, isPending, error, data }`

**Query key hierarchy pattern:**
- `all: ['<feature>']` — top-level scope
- `lists: () => [... , 'list']` — all list queries
- `list: (filters?) => [... , { filters }]` — specific list with filters
- `details: () => [... , 'detail']` — all detail queries
- `detail: (id) => [... , id]` — specific item detail

This enables granular invalidation: invalidate `lists()` to refetch all filtered views, but `detail(id)` stays cached if only one item changes.

**See implementation:** Goals feature (`src/features/goals/`) is the reference implementation.

### Suspense Pattern for Async Sections

For components that fetch data, use `useSuspenseQuery` via a dedicated `use<Feature>Suspense` hook alongside the standard `use<Feature>` hook:

- **`useFeature`** — wraps `useQuery`. Use for mutations context or when you need manual `isLoading`/`error` control.
- **`useFeatureSuspense`** — wraps `useSuspenseQuery`. Use when the component lives inside a Suspense boundary. Returns `data` typed as non-nullable (never undefined). Does not return `isLoading`.

**When to use Suspense:** when a page has independent data sections that should render as soon as each one is ready, without blocking each other.

**When NOT to use Suspense:** for mutations, imperative error handling (e.g. toasts), or simple pages with a single loading state.

**`AsyncBoundary` — the standard wrapper** (`src/components/async-boundary.tsx`):

Combines `QueryErrorResetBoundary` + `ErrorBoundary` + `Suspense`. Always use this instead of bare `<Suspense>` so errors are caught and retryable per section.

```tsx
<AsyncBoundary loadingFallback={<YourSkeleton />}>
  <YourSuspendingSection />
</AsyncBoundary>
```

**Page structure pattern** (see `src/pages/goals-page.tsx`):

```
Page (pure layout, no hooks)
├── <AsyncBoundary loadingFallback={<SkeletonA />}>
│     └── SectionA  ← calls useFeatureSuspense(), renders immediately when ready
└── <AsyncBoundary loadingFallback={<SkeletonB />}>
      └── SectionB  ← independent, renders independently
```

**Filter state + Suspense:** when a section owns filter state, wrap `setFilters` in `startTransition` so React keeps the current data visible while the new query loads instead of re-suspending:

```tsx
const [, startTransition] = useTransition()
const handleChange = useCallback((updated) => {
  startTransition(() => setFilters(prev => ({ ...prev, ...updated })))
}, [])

### Form Pattern

Forms use React Hook Form + Zod schema + `zodResolver`. Schemas live in `src/zodSchemas/`, form components in feature directories.
We have a component @/components/ui/FormField which is the standard component to use in the forms as inputs of different types

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

- Pages components assemble other components
- Lists of elements that can be rendered in the page component must to be to a generic list of components
- No magic strings, try all the time to look for a way of abstracting strings to re use them.
- When want reusable components and standarization in styles, things like margins or gaps, are not define in a unit element like a button or an element that will be use in a list. We delegate that responsability to the parent component that will set a <div> with className with styles that are the standard. (you can see the implementation of this in @/pages/goals-apge.tsx)
- In the file /index.css we define the global styles and always we look for standarization 
- All text in the app should be define with the <Typography> component
- We always use the <Suspense> approach for components that needs to perform a request. We create wrapper components that custom childs components that are intended to be reusable. So, the wrapper component is the one that holds the async request
- We will create custom loaders when necessary in the features/[name]/components/loaders´5