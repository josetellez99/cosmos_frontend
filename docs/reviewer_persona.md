React Frontend Developer Guidelines

Purpose: These guidelines serve as the evaluation criteria for Claude Code when reviewing pull requests. Code must align with what is expected from a developer with 3+ years of professional experience. Every rule here is actionable and reviewable in a PR diff.


## Project Structure & Architecture

Keep a consistent structure with the /features based organization
Keep a clear separation between UI components (presentational) and business logic (containers, hooks, services).
Always follow the flow of the layers ui -> hooks -> services -> api
Define clear application layers: UI → Hooks/State → Services/API → Types. Never let a UI component call an API directly; always go through a hook or service layer.

## Component Design

Follow the Single Responsibility Principle: each component should do one thing well. If a component file exceeds ~150-200 lines, it likely needs to be split.
Use composition over inheritance. Build complex UIs by composing small, focused components rather than creating deeply nested prop chains or God components.
Keep components pure whenever possible: same props should produce same output, with no side effects in the render path.
Extract reusable UI patterns into a design system or shared component library with consistent API conventions (e.g., consistent naming for size, variant, disabled props).
Use children and render props (or compound components) for flexible, composable APIs rather than over-configuring with dozens of props.
Avoid prop drilling beyond 2-3 levels. If data needs to travel further, use Context, a state management solution, or component composition.

## TypeScript

Enable strict mode in tsconfig.json. Never use // @ts-ignore or // @ts-expect-error without a comment explaining why it's necessary and a TODO to remove it.
Never use any. Use unknown when the type is genuinely unknown.
Define explicit return types on exported functions and public hook APIs. Internal helper functions can rely on inference when the types are obvious.
Use interface for object shapes that may be extended or implemented, and type for unions, intersections, mapped types, and utility types. Be consistent within the project.
Co-locate types with their feature. Shared types go in a types/ directory. Avoid a single monolithic types.ts file.
Use discriminated unions for state modeling (e.g., { status: 'loading' } | { status: 'success'; data: T } | { status: 'error'; error: Error }) instead of separate boolean flags.
Prefer as const assertions and template literal types to keep string literals type-safe.
Generic components and hooks should have meaningful constraint names (e.g., TItem extends BaseItem instead of T).

## Hooks

Custom hooks must start with use and encapsulate a single, cohesive piece of logic. A hook named useUserProfileAndNotificationsAndTheme is doing too much.
Every custom hook must have a clearly typed return value. Return objects (not arrays) when returning more than 2 values, for readability at the call site.
Avoid deeply nesting hooks inside hooks. If a custom hook calls 5+ other hooks, consider restructuring or splitting it.
Always specify complete dependency arrays in useEffect, useMemo, and useCallback. Never suppress the exhaustive-deps lint rule without a documented reason.
useEffect must have a single, clear purpose. If a useEffect has multiple unrelated side effects, split it into multiple useEffect calls.
Always return a cleanup function from useEffect when subscribing to events, timers, or external data sources (WebSockets, observers, intervals).
Avoid using useEffect for derived state. If a value can be computed from props or state, compute it during render or with useMemo.
Prefer useReducer over useState when state transitions depend on previous state or when multiple state variables change together in response to the same event.
Never set state inside a render cycle without a condition guard; this causes infinite re-render loops.


## State Management

Use local component state (useState / useReducer) by default. Only lift state when two or more sibling components genuinely need to share it.
Use React Context for low-frequency, broadly-needed state (theme, locale, auth status, feature flags). Never use Context for high-frequency updates (e.g., form inputs, animations, scroll position).
When using Context, split contexts by domain (AuthContext, ThemeContext, ToastContext) rather than putting everything in a single AppContext.
Always memoize Context values with useMemo to prevent unnecessary re-renders of all consumers on every parent render.
For server state (data fetched from APIs), use a dedicated server-state library TanStack Query. Never manage caching, loading, error, and refetch states manually with useState + useEffect.
Keep global state minimal and normalized. Avoid duplicating server data in global state; let the server-state cache be the source of truth.
State shape should be as flat as possible. Deeply nested state updates are error-prone and harder to manage immutably.
Never mutate state directly. Always create new references (spread operator, structuredClone, or Immer when using Redux Toolkit).


## Data Fetching & Server State

Use React TanStack Query for all server state.
Define query keys as typed constants or factory functions to prevent typos and ensure consistent cache invalidation.
Every query and mutation must handle all three states: loading, error, and success. Never leave an unhandled error state that silently fails.
Use useMutation with onSuccess invalidation to keep cached data consistent after writes. Implement optimistic updates for user-facing actions where latency matters.
API error responses should be parsed into typed error objects with actionable messages, status codes, and optional field-level validation errors.
Avoid waterfalls: use Promise.all, parallel queries, or prefetching when multiple independent data sources are needed for a single view.


## Performance

Never prematurely optimize. Measure first using React DevTools Profiler, Lighthouse, and browser Performance tab. Optimize only proven bottlenecks.
Use React.memo on components that receive stable-reference props but whose parent re-renders frequently. Do not wrap every component in React.memo by default.
Use useMemo for expensive computations (filtering/sorting large lists, complex transformations). Do not memoize trivial calculations; the memoization overhead may exceed the computation cost.
Use useCallback for functions passed as props to memoized child components or used in dependency arrays. Do not wrap every function in useCallback by default.
Implement code splitting at the route level with React.lazy and Suspense. Consider splitting heavy feature modules (rich text editors, charting libraries) on demand.
Virtualize long lists and tables (>50 items) using a virtualization library (react-window, react-virtuoso, or @tanstack/react-virtual). Never render hundreds of DOM nodes.
Debounce or throttle high-frequency events (search inputs, scroll handlers, resize listeners) with appropriate delay values.
Avoid creating new objects, arrays, or functions inside JSX. Move them outside the render or memoize them.
Images should use lazy loading (loading="lazy"), correct dimensions, responsive srcSet, and modern formats (WebP/AVIF).
Avoid layout shifts: define explicit width and height for images/media, use skeleton loaders with matching dimensions, and minimize DOM changes above the fold after initial paint.
Keep bundle size in check: monitor with webpack-bundle-analyzer or equivalent, tree-shake unused code, prefer lightweight libraries, and avoid importing entire libraries when only a single utility is needed (e.g., import debounce from 'lodash/debounce' not import _ from 'lodash').
Use lazy loading (React.lazy + Suspense) for route-level code splitting.
Try to avoid useEffect


## Error Handling

Wrap every route or major feature section in an Error Boundary component. The fallback UI should provide a clear message and a retry action, not a blank screen.
API errors must be caught and presented to the user with meaningful feedback (toast, inline message, error page). Never swallow errors silently.
Form validation errors should be displayed inline next to the relevant field. Use a consistent pattern (e.g., react-hook-form with zod or yup schemas) across all forms.
Use typed error handling patterns: define custom error classes or error union types for different failure modes rather than relying on generic Error or string messages.
Async operations in useEffect must have their errors caught within the effect. An unhandled promise rejection in an effect is a bug.

## Testing
All the implementations must to be testeable with automated test


## Security

Sanitize all user-generated content before rendering. Never use dangerouslySetInnerHTML without sanitization through a library like DOMPurify. If you must use it, add a comment explaining why and how sanitization is guaranteed.
Detect security gaps in the implementations
Validate and sanitize all user input on both client and server. Client-side validation is for UX; server-side validation is for security.
Use Content Security Policy (CSP) headers to prevent XSS. Avoid unsafe-inline and unsafe-eval in production.
Protect against open redirects: validate and whitelist any URLs used in redirects after authentication or form submission.

## Code Quality & Conventions

No console.log, console.warn, or console.error in production code. Use a proper logging utility or remove debug statements before merging.
Use named exports over default exports for better refactoring support, IDE navigation, and consistent import naming. Only use default exports for page components if required by the framework (Next.js pages).
Follow consistent naming conventions: PascalCase for components and types, camelCase for variables/functions/hooks, UPPER_SNAKE_CASE for constants and env vars, kebab-case for file names.
Keep files focused: one component per file, one hook per file, one utility per file. Colocate test files next to their source (Component.tsx + Component.test.tsx).
Avoid magic numbers and strings. Extract them into named constants with clear intent (e.g., const MAX_RETRY_ATTEMPTS = 3).
Dead code (unused variables, unreachable branches, commented-out blocks) must be removed before merging, not left for "later cleanup."
Commit messages should follow Conventional Commits (feat:, fix:, refactor:, test:, docs:, chore:). PRs should have a clear description of what changed and why.
Prefer early returns over deeply nested conditionals. Functions should have a clear "happy path" with guard clauses at the top.