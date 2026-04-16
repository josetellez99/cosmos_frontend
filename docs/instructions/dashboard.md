This document explain the approach for how it works the dashboard in the app

The dashboard is the main page that offers the user an overview of all its activity in the app

Is composed by 2 main sections

1. The goals visualization: A section that shows its goals and allow to filter by temporality
2. The habits & tasks section: A section to see the habits and tasks to the current day and mark them as completed

The approach of the dashboard is having independent components that fetchs the data through the standar pattern to fetch data

You have to create the page and add it to the App.tsx to add the this new route or modify if it already exists

For the goals visualization section we have to apply the same <FilteredGoalsSection> approach as we are applying it in the component <GoalsPage> in the file goals-page.tsx, but this deserves another component 'GoalsSectionDashboard' that mirrors the current implementation of <FilteredGoalsSection> but with changes detailed later.

But for this section, in the ba

Then, the second section for habits and tasks section, we have:

- A toggle feature that are two buttons 'Habitos' and 'Tareas' to allow the user select which list wants to see. The selected buttons shows borders and bg that logically constrast the selected with the non selected button.

So we have two lists:

The list for habits:

Here what we really render is the habits that should be completed today.
here we need a new flow for fetching the habits for today or for any day.
The endpoint is /habits/date/4-16-2026. We are passing the date we want to see the habits as a query param. You have to add that endpoint in the app endpoints map
The backend will response with a 'HabitSummaryResponse' but adding the isChecked field that will allow us to see if the habit is completed or not.
Then, is a fetch like the one in habits-page -> habit-section -> habits-list, but of course we are using a new endpoint which is the /habits/dates/{date in mm-dd-yyyy}

In this list the habit-item show a check where on checked, mark that habit as completed and is toggleable so user can unchecked it. 
The onClick for that check is passed from the parent caller. That function call a hook 'useCreateHabitRecord'. You have to create this hook and all the flow (data pattern as in /src/docs/context/data_flow.md). As example implementation you can use as reference the 'useCreateProject'.
This requiere add a new endpoint which you have to add to the endpoints_map and it is '/habits/{id}/records
And the object we need to send is: 

{
    isCompleted: boolean
}

All this implementation of the 'useCreatehabitRecord' should be placed on a new /features/habit-records. Type the service function with an interface in /features/habits-records/types

That write operation use the optmistic approach that have to be setted in the hook layer as in the example of useCreateProject case.
Then, we also need a the way to remove that item with a flow of a useDeleteHabitRecord, so in the create case we need to correctly update the state and cached to show correctly 

For the second section, the goals/tasks list, just show a message: Pronto estará disponible

By default we show the habits list and when changing between each list show an animation of moving.

Also, as another small changes add button to the sidebar to navigate to each section like Proyectos (/projects), Habitos, Metas, Sistemas. Those buttons are links to navigate to those pages, has no borders, jsut the label and a arrow to the right in the right with bg-primary as color, cursor-pointer and a small hoover efect over the labels

Also, you have to add all the changes to git when you complete and independent action that deserves to be added to git 

And by the end, you will create a resume of that implementation in this same file "/src/docs/instructions/dashboard.md that will contain explanation and guidelines of how the dashboard implementation is working until this endpoint. You don't have to remove the content we already have in this file, just append bellow the explanation and just asked you.

---

## Implementation summary

This section documents how the dashboard described above is wired in code, so future contributors can extend it without re-deriving the structure.

### Page composition

- **Route:** `/` is registered in `src/App.tsx` and renders `DashboardPage` (`src/pages/dashboard-page.tsx`).
- `DashboardPage` is a pure layout (per the project's page convention): two stacked `<section>`s, each wrapped in its own `<AsyncErrorBoundary>` so they suspend and recover independently.
  1. **Goals overview** — `GoalsSectionDashboard` (`src/features/dashboard/components/goals-section-dashboard.tsx`). It is a verbatim mirror of `FilteredGoalsSection` from the goals feature, but lives in the dashboard feature so it can evolve independently from the goals page.
  2. **Habits & tasks** — `HabitsVsTasksSection` (`src/features/dashboard/components/habits-vs-tasks-section.tsx`). It owns a `view: 'habits' | 'tasks'` state and renders both panels inside a `relative overflow-hidden` wrapper. The inner flex row translates horizontally (`translateX(0%)` ↔ `translateX(-100%)`) on a `transition-transform duration-300 ease-out`, producing a smooth slide both directions. Today's habits are wrapped in their own `<AsyncErrorBoundary>` so the toggle UI never disappears while data loads.

### Toggle UI

`HabitsVsTasksToggle` (`src/features/dashboard/components/habits-vs-tasks-toggle.tsx`) is two `<Button>`s — the selected one uses `bg-primary` + border + contrast text, the unselected uses ghost styling. The section's title text mirrors the active view ("Hábitos de hoy" / "Tareas").

### Data flow for today's habits

The habits list is rendered for **today's date only** (computed once via `formatDateForApi(new Date())` — `src/features/habits/helpers/format-date-for-api.ts`, format `yyyy-mm-d`).

```
TodayHabitsSection (suspends)
  └── useHabitsByDateSuspense(today)
        └── getHabitsByDateService(date)
              └── GET /habits/date/{yyyy-mm-d}  → HabitForDateResponse[]
```

- **Endpoint:** `ENDPOINTS_MAP.HABITS.GET_HABITS_BY_DATE` in `src/lib/constants/endpoints_map.ts`.
- **Response shape:** `HabitForDateResponse` extends `HabitSummaryResponse` with `isChecked: boolean` (`src/features/habits/types/response/habit-for-date.ts`).
- **Cache key:** `habitQueryKeys.byDate(date)` so each day is cached separately and one day's optimistic updates do not invalidate others.

### Checking & unchecking — `habit-records` feature

The new `src/features/habit-records/` feature owns the write side of habit completions:

- **Services:**
  - `createHabitRecordService(habitId, { isCompleted: true })` → `POST /habits/{id}/records`
  - `deleteHabitRecordService(habitId)` → `DELETE /habits/{id}/records`
  - Both attach the CSRF header following the project's mutation convention.
- **Hooks** (`useCreateHabitRecord` / `useDeleteHabitRecord`) follow the optimistic pattern established by `useCreateProject`:
  1. `onMutate` cancels in-flight queries on `habitQueryKeys.byDate(date)`, snapshots the cache, and immediately flips `isChecked` on the matching habit so the UI updates without waiting for the server.
  2. `onError` restores the snapshot — the row visually reverts if the request fails.
  3. `onSuccess` invalidates the byDate query to reconcile with the server.
- The hook receives `{ date }` so it knows which cache slice to mutate, and `mutate()` takes `{ habitId }`.

### `HabitItem` extension

The reusable `HabitItem` component now wires up its previously-unused `allowCheck` prop. When `allowCheck` is true, it renders a leading checkbox controlled by `isChecked` and notifies the parent via `onToggleCheck(next)`. The checkbox stops click propagation so the row's own `onClick` (navigate to detail) still works around it. This keeps the daily-habit row a thin caller of the same shared item used elsewhere in the app.

### Sidebar navigation

`src/components/layouts/sidebar-layout/sidebar.tsx` now lists the four main app areas (Proyectos, Hábitos, Metas, Sistemas) as `<Link>`s with a chevron and primary-color text. Selecting a link closes the drawer (`setIsSidebarOpened(false)`).

### Tasks placeholder

The "Tareas" view renders `TasksComingSoon` — a single `FallbackMessage` reading "Pronto estará disponible". When that view is built, replace it with the real list while keeping the toggle and slide wrapper unchanged.

### Files added / changed

- New feature: `src/features/dashboard/` — components, types, loaders.
- New feature: `src/features/habit-records/` — types, services, hooks.
- New: `src/features/habits/services/get-habits-by-date-service.ts`, `src/features/habits/hooks/useHabitsByDateSuspense.ts`, `src/features/habits/types/response/habit-for-date.ts`, `src/features/habits/helpers/format-date-for-api.ts`.
- Edited: `src/features/habits/components/habit-item.tsx` (allowCheck wired), `src/features/habits/helpers/queryKeys.ts` (`byDate`), `src/lib/constants/endpoints_map.ts` (new endpoints), `src/components/layouts/sidebar-layout/sidebar.tsx` (nav links), `src/App.tsx` (route → `DashboardPage`).
