# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project overview

Cosmos is a frontend app that consumes a rest api.
The purpose is provide the user the ability to organize its life through tracking their goals.
There are 4 entities that are independent: goals, systems, habits, projects.
Goals are the main entity because the user can create them to start tracking.
Goals can contain habits, systems, projects and other goals (as subgoals), the weighted progress of the subitems will be the progress of the goal
A system is a set of habits
A habit is an specific action that have to be repeated through a scheduling config
A project is a set of stages that contains task
With this basic structure, the user is able of setting all the

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

Services call `apiClient` methods and return `ApiResponse<T>` — a discriminated union (`SuccessApiResponse<T> | ErrorApiResponse`). Check `response.ok` to narrow the type.

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

**Filter state + Suspense:** when a section owns filter state, update it directly — this causes the component to re-suspend and show the skeleton while the new data loads, which is the desired UX:

```tsx
const handleChange = useCallback((updated) => {
  setFilters(prev => ({ ...prev, ...updated }))
}, [])
```

Avoid wrapping filter updates in `startTransition` — that would suppress the skeleton and keep stale data visible until the new data arrives.

### Filter System

Shared filter components live in `src/components/filters/`. Filters appear as a single **"Filtros ▼"** dropdown button (top-right of the section) that lists the available filters for that section. The caller (section component) decides which filters to include.

**Components:**

- **`FilterContainer`** — The "Filtros ▼" trigger button + Popover. Manages open/close state and which filter is currently expanded. Accepts `onClearAll` prop — a callback to reset all filters to their default state (e.g. `defaultProjectsPageReq`). Shows a "Limpiar todo" button in the root filter list.
- **`FilterItem`** — Each available filter inside the dropdown. Shows as `(icon) Label` in the list view. When clicked, replaces the list with that filter's content (back arrow header + children). Props: `id`, `icon` (LucideIcon), `label`, `isActive` (whether filter has a non-default value), `children` (the filter UI). Active filters show icon in `--primary` color and label in bold primary text.
- **`FilterOptionList`** — Single-select radio list for categorical filters (status, temporality). Shows options with a checkmark for the selected value + "Limpiar" button. Closes the entire popover on selection.
- **`FilterCalendar`** — Calendar-based filter supporting two modes via discriminated union: `mode: 'single'` (pick one date) or `mode: 'range'` (pick start + end). Uses a single-month calendar. In range mode, the popover stays open until both dates are selected. Includes a "Limpiar" button.

**Shared context (`FilterContainerContext`):** provides `close()`, `activeFilter`, and `setActiveFilter()`. `FilterOptionList` and `FilterCalendar` consume `close()` to auto-close the popover after a selection is made.

**Usage pattern** (see `src/features/projects/components/filtered-projects-section.tsx`):

```tsx
<FilterContainer onClearAll={handleClearAll}>
  <FilterItem id="status" icon={CircleDot} label="Estatus" isActive={isStatusActive}>
    <FilterOptionList options={STATUS_OPTIONS} value={...} onSelect={...} onClear={...} />
  </FilterItem>
  <FilterItem id="date" icon={CalendarIcon} label="Fecha limite" isActive={isDateActive}>
    <FilterCalendar mode="range" from={...} to={...} onChange={...} onClear={...} />
  </FilterItem>
</FilterContainer>
```

**Filter state ownership:** The section component (e.g. `FilteredProjectsSection`, `FilteredGoalsSection`) owns all filter state via `useState`. It defines the handlers (`onSelect`, `onClear`, `onClearAll`) and passes them down. `onClearAll` should reset state to the feature's default request object.

**Filter option constants:** Follow the pattern in `src/lib/constants/` — define a const enum, labels record, and filter options array (e.g. `PROJECT_STATUS_FILTER_OPTIONS`, `GOAL_STATUS_FILTER_OPTIONS`, `TEMPORALITY_FILTER_OPTIONS`).

### Form Pattern

Forms use React Hook Form + Zod schema + `zodResolver`. See **[docs/context/form-instructions.md](docs/context/form-instructions.md)** for the complete guide on how to build forms: component hierarchy, file locations, naming conventions, sections with useFieldArray, draft forms in modals, linking sections, custom inputs, schema-to-API transformation, and reusable UI components. The project form (`src/features/projects/components/project-form.tsx`) is the reference implementation.

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

### Database

The database schema live in /docs/context/db_schema.sql, reference to it when you need understand the db structure

### TypeScript

Strict mode enabled with `noUnusedLocals` and `noUnusedParameters`. Target ES2022, bundler module resolution.

### Conventions

- Abstraction is one of our most important principles. We don't like to repeat code, we don't want to define magic strings, we almost always want to create reusable components and behaviors to standarized the app
- Pages components assemble other components
- Lists of elements that can be rendered in the page component must to be to a generic list of components
- No magic strings, try all the time to look for a way of abstracting strings to re use them.
- When want reusable components and standarization in styles, things like margins or gaps, are not define in a unit element like a button or an element that will be use in a list. We delegate that responsability to the parent component that will set a <div> with className with styles that are the standard. (you can see the implementation of this in @/pages/goals-apge.tsx)
- In the file /index.css we define the global styles and always we look for standarization 
- All text in the app should be define with the <Typography> component
- We always use the <Suspense> approach for components that needs to perform a request. We create wrapper components that custom childs components that are intended to be reusable. So, the wrapper component is the one that holds the async request
- We will create custom loaders when necessary in the features/[name]/components/loaders´5