# Form Instructions

How forms are built in this app. Use ProjectForm as the reference implementation.

## Typing strategy

**Zod schemas are only used for validation** (passed to `zodResolver`). All form typing is done with TypeScript interfaces that we define manually.

| Concern | Where it lives | Example |
|---------|---------------|---------|
| Form value interfaces | `features/<feature>/types/form/` | `ProjectFormValues`, `StageFormValues` |
| Zod validation schemas | `features/<feature>/schemas/` | `projectFormSchema`, `createStageSchema` |
| API request types | `features/<feature>/types/request/` | `CreateProjectRequest` |
| Cross-feature form contracts | `features/<linked-feature>/types/form/` | `FormWithGoalLinks` |

**Never use `z.infer<typeof schema>`** to derive form types. The Zod schema and the interface must match in shape, but they are maintained separately — the interface is the source of truth for typing, the schema is the source of truth for validation.

```tsx
// features/projects/types/form/project-form.ts — interfaces
export interface TaskFormValues {
    name: string
    description?: string | null
    startingDate: string
    deadline?: string | null
    status?: GoalStatusType | null
    weight: number
}

export interface StageFormValues {
    name: string
    description?: string | null
    startingDate: string
    deadline?: string | null
    status?: GoalStatusType | null
    weight: number
    tasks: TaskFormValues[]
}

export interface ProjectFormValues {
    name: string
    description?: string
    code: string
    startingDate: string
    deadline: string
    status?: GoalStatusType | null
    stages: StageFormValues[]
    goalLinks: GoalSubitemConnection[]
}
```

```tsx
// features/projects/schemas/project-form-schema.ts — validation only
export const projectFormSchema = z.object({ ... })
export { createTaskSchema, createStageSchema }
// NO type exports from this file
```

The form uses the interface as the generic parameter and the schema as the resolver:

```tsx
const form = useForm<ProjectFormValues>({
    resolver: zodResolver(projectFormSchema),
    defaultValues: initialValues,
})
```

## Component hierarchy

```
Page (renders form with initialValues + isEditing)
└── EntityForm (FormProvider + <form> + onSubmit)
    ├── FormField (standard inputs: text, date, number)
    ├── WeightInput (tag-based percentage selector, includes Controller)
    ├── SectionComponent (useFormContext + useFieldArray)
    │   ├── ItemCard (display with edit/remove buttons)
    │   ├── AddButton (opens modal)
    │   └── Dialog
    │       └── SubEntityForm (FormProvider with draftForm + fields + save button)
    │           └── NestedSection (useFormContext + useFieldArray)
    └── GoalsLinkingSection (useFormContext + useFieldArray)
        ├── GoalItem list (with edit/remove per item)
        ├── GoalSelectionModal (owns AddButton + open/close + filters)
        └── GoalLinkConfigModal (driven by configTarget state)
            └── EditSubitemWeightModal (for editing existing subitems)
```

## File locations and naming

| Type | Location | Naming | Example |
|------|----------|--------|---------|
| Main form | `features/<feature>/components/` | `<entity>-form.tsx` | `project-form.tsx` |
| Sub-entity form | `features/<feature>/components/form/` | `<entity>-form.tsx` | `stage-form.tsx`, `task-form.tsx` |
| Form section | `features/<feature>/components/form/` | `<entity>-form-section.tsx` | `stage-form-section.tsx` |
| Display card | `features/<feature>/components/` | `<entity>-card.tsx` | `stage-card.tsx` |
| Form-related modals | `features/<feature>/components/form/` | `<action>-modal.tsx` | `goal-selection-modal.tsx` |
| Linking sections | `features/<linked-feature>/components/form/` | `<entity>-linking-section.tsx` | `goals-linking-section.tsx` |
| Form value interfaces | `features/<feature>/types/form/` | `<entity>-form.ts` | `project-form.ts` |
| Cross-feature form contracts | `features/<linked-feature>/types/form/` | `<entity>-form.ts` | `goal-links-form.ts` |
| Zod schema | `features/<feature>/schemas/` | `<entity>-form-schema.ts` | `project-form-schema.ts` |
| Initial values | `features/<feature>/constants/` | `formsInitialValues.ts` | — |
| Reusable UI | `components/ui/` | `<component>.tsx` | `weight-input.tsx` |

## Main form (EntityForm)

The top-level form component receives `isEditing` and `initialValues`. It creates the form with `useForm`, wraps everything in `FormProvider`, and handles submission.

```tsx
// features/projects/components/project-form.tsx
export const ProjectForm = ({ isEditing, initialValues }: props) => {
    const form = useForm<ProjectFormValues>({
        resolver: zodResolver(projectFormSchema),
        defaultValues: initialValues,
    })

    const onValid = (data: ProjectFormValues) => {
        const request: CreateProjectRequest = {
            name: data.name,
            description: data.description,
            code: asProjectCodeString(data.code),
            startingDate: asISODateString(data.startingDate),
            deadline: asISOTimestampString(data.deadline),
            status: data.status,
            stages: data.stages.map((stage, stageIndex) => ({
                ...stage,
                sortOrder: stageIndex + 1,
                tasks: stage.tasks.map((task, taskIndex) => ({
                    ...task,
                    sortOrder: taskIndex + 1,
                })),
            })),
            goalLinks: data.goalLinks,
        }
        mutate(request)
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onValid, onInvalid)}>
                <FieldSet>
                    <FormField name="name" control={form.control} ... />
                    <StagesSection />
                    <GoalsLinkingSection previewSlot={<ProjectFormPreview />} />
                    <Button type="submit">...</Button>
                </FieldSet>
            </form>
        </FormProvider>
    )
}
```

Key points:
- `FormProvider` wraps the entire form so sections access it via `useFormContext`
- Sections receive no form props — they are self-contained via context
- `GoalsLinkingSection` receives only a `previewSlot` (see [Goal linking section](#goal-linking-section-goallinks))
- `onValid` transforms the form values into the API request type (adding `sortOrder`, branding strings, etc.)
- The page component passes `initialValues` (empty for create, populated for edit)

## Schema to API request transformation

Form value interfaces and API request types are separate. The `onValid` handler transforms form data into the request shape. This is where:

- Branded types are applied (`asProjectCodeString`, `asISODateString`, etc.)
- Computed fields are added (e.g. `sortOrder` from array index)
- Field names are mapped if they differ between form and API

```tsx
const onValid = (data: ProjectFormValues) => {
    const request: CreateProjectRequest = {
        name: data.name,
        description: data.description,
        code: asProjectCodeString(data.code),
        startingDate: asISODateString(data.startingDate),
        deadline: asISOTimestampString(data.deadline),
        status: data.status,
        stages: data.stages.map((stage, stageIndex) => ({
            ...stage,
            sortOrder: stageIndex + 1,
            tasks: stage.tasks.map((task, taskIndex) => ({
                ...task,
                sortOrder: taskIndex + 1,
            })),
        })),
        goalLinks: data.goalLinks,
    }
    mutate(request)
}
```

Request types live in `features/<feature>/types/request/`. They use strict branded types (`ISODateString`, `ProjectCodeString`, etc.) instead of plain strings.

## Page component

Pages are thin — they just render the form with initial values.

```tsx
// pages/projects/create-project-page.tsx
export const CreateProjectPage = () => (
    <ProjectForm initialValues={projectFormInitialValues} isEditing={false} />
)
```

## Sections and sub-entity forms

Sections manage a list of items (stages, tasks). They are split into two parts:

**Section** — owns the list display, add/edit/remove state, draft form instance, and the Dialog shell.
**Sub-entity form** — owns the `FormProvider` with the draft form, the field layout, and the save button.

```tsx
// features/projects/components/form/stage-form-section.tsx (Section)
export function StagesSection() {
    const form = useFormContext<ProjectFormValues>()
    const { fields, append, update, remove } = useFieldArray({
        control: form.control, name: "stages",
    })

    const draftForm = useForm<StageFormValues>({
        resolver: zodResolver(createStageSchema),
    })

    const openAdd = () => { setEditingIndex(null); draftForm.reset(stageFormInitialValues); setIsOpen(true) }
    const openEdit = (index: number) => { setEditingIndex(index); draftForm.reset(fields[index]); setIsOpen(true) }
    const handleSave = draftForm.handleSubmit((data) => {
        if (editingIndex !== null) update(editingIndex, data)
        else append(data)
        setIsOpen(false)
    })

    return (
        <>
            {fields.map((stage, index) => (
                <StageCard stage={stage} index={index} onEdit={openEdit} onRemove={remove} />
            ))}
            <AddButton text="Agregar etapa" onClick={openAdd} />
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogScrollArea>
                    <StageForm draftForm={draftForm} onSave={handleSave} isEditing={editingIndex !== null} />
                </DialogScrollArea>
            </Dialog>
        </>
    )
}
```

```tsx
// features/projects/components/form/stage-form.tsx (Sub-entity form)
export function StageForm({ draftForm, onSave, isEditing }: StageFormProps) {
    return (
        <FormProvider {...draftForm}>
            <FieldSet>
                <FormField name="name" control={draftForm.control} ... />
                <WeightInput name="weight" control={draftForm.control} label="Peso" />
                <TaskFormSection />  {/* nested section accesses draftForm via useFormContext */}
                <Button onClick={onSave}>{isEditing ? "Guardar cambios" : "Agregar etapa"}</Button>
            </FieldSet>
        </FormProvider>
    )
}
```

Key points:
- Sections use `useFormContext` to access the parent form (no props)
- The **draft form** is a separate `useForm` instance for modal validation
- The sub-entity form wraps content in `FormProvider` with the draft form, so nested sections can also use `useFormContext`
- Sub-entity form receives `draftForm`, `onSave`, and `isEditing` as props
- Nested sections (e.g. `TaskFormSection` inside `StageForm`) follow the exact same section + sub-entity form pattern

## Display cards

Cards show a summary of an item with edit/remove actions. They receive the data + callbacks.

```tsx
// features/projects/components/stage-card.tsx
interface StageCardProps {
    stage: StageFormValues
    index: number
    onEdit: (index: number) => void
    onRemove: (index: number) => void
}

export function StageCard({ stage, index, onEdit, onRemove }: StageCardProps) {
    return (
        <div className="default-card-rounded default-card-padding bg-white border border-soft-gray flex items-center justify-between gap-2">
            <Typography variant="p">{stage.name}</Typography>
            <div className="flex items-center gap-1">
                <Button variant="ghost" size="icon-xs" onClick={() => onEdit(index)}>
                    <Pencil />
                </Button>
                <Button variant="ghost" size="icon-xs" onClick={() => onRemove(index)}>
                    <Trash2 />
                </Button>
            </div>
        </div>
    )
}
```

## Goal linking section (`goalLinks`)

The `GoalsLinkingSection` allows any form to link goals to the entity being created/edited. It is **reusable across all forms** (project, system, habit, goal) because it reads from `useFormContext` with a minimal contract interface (`FormWithGoalLinks`), not the full form type.

### Architecture

```
features/goals/components/form/
├── goals-linking-section.tsx    ← main section (useFormContext + useFieldArray)
├── goal-selection-modal.tsx     ← self-contained: owns AddButton + open/close + filters
└── goal-link-config-modal.tsx   ← weight configuration + existing subitems view
    └── edit-subitem-weight-modal.tsx  ← nested modal for editing existing subitem weights

features/goals/types/form/
└── goal-links-form.ts           ← FormWithGoalLinks interface (the reusable contract)

features/goals/types/conections/
└── goal-subitem.ts              ← GoalSubitemConnection (the array item shape)
```

### The contract interface

Any form that includes goal linking must have a `goalLinks: GoalSubitemConnection[]` field. The section reads the form via `FormWithGoalLinks`:

```tsx
// features/goals/types/form/goal-links-form.ts
export interface FormWithGoalLinks {
    goalLinks: GoalSubitemConnection[]
}
```

This means `ProjectFormValues`, `SystemFormValues`, `HabitFormValues`, `GoalFormValues` all include `goalLinks` in their interface, and the section works with any of them.

### How it works

The section uses `useFieldArray` to manage the `goalLinks` array. It tracks a single `configTarget` state that drives the config modal:

```tsx
// configTarget = null → config modal closed
// configTarget = { goal, fieldIndex: null } → adding a new link
// configTarget = { goal, fieldIndex: 3 } → editing link at index 3

interface ConfigTarget {
    goal: GoalSummaryResponse
    fieldIndex: number | null
}
```

**User flow — adding a goal link:**
1. User clicks "Vincular meta" → `GoalSelectionModal` opens (self-contained)
2. User selects a goal → `configTarget` is set with `fieldIndex: null`
3. `GoalLinkConfigModal` opens showing the goal's existing subitems + weight picker
4. User sets weight, clicks "Vincular" → `append()` adds to the array
5. Goal summary is cached in a `Map<number, GoalSummaryResponse>` for rendering

**User flow — editing a goal link:**
1. User clicks the edit button on a linked goal → `configTarget` is set with `fieldIndex: index`
2. `GoalLinkConfigModal` opens with `existingWeight` pre-filled
3. User can change the weight of the current item
4. User can click an existing subitem → `EditSubitemWeightModal` opens (nested modal, handled entirely inside the config body)
5. User confirms → `update()` modifies the array at the given index

**User flow — removing a goal link:**
1. User clicks the remove button → `remove(index)` on the field array + cleanup from the cached Map

### Usage in a form

The parent form passes an optional `previewSlot` so the config modal can show a preview of the entity being linked. Each form provides its own preview component:

```tsx
// In ProjectForm:
<GoalsLinkingSection previewSlot={<ProjectFormPreview />} />

// In SystemForm (future):
<GoalsLinkingSection previewSlot={<SystemFormPreview />} />

// Without preview:
<GoalsLinkingSection />
```

### GoalSelectionModal

Fully self-contained. It renders the `AddButton` internally and manages its own open/close state and filter state. The parent only provides:
- `excludeIds: Set<number>` — goals already linked (derived from the field array)
- `onGoalSelect: (goal: GoalSummaryResponse) => void` — callback when a goal is selected

### GoalLinkConfigModal

Receives clean props, no form context dependency:
- `goalId: number | null` — non-null opens the modal
- `isEditing: boolean` — controls button label ("Vincular" vs "Guardar")
- `existingWeight?: number` — pre-fills the weight input when editing
- `previewSlot?: ReactNode` — optional preview of the entity being linked
- `onClose` / `onConfirm` — callbacks

The body (`GoalLinkConfigBody`) is a suspense component that fetches the goal details and shows:
1. The goal card
2. Existing subitems (clickable → opens `EditSubitemWeightModal`)
3. The preview slot (if provided) + weight picker for the new/edited link

### Key principles

- **No prop drilling**: each component imports what it needs directly. `GoalSubitemCard`, `EditSubitemWeightModal`, `GoalItem` are imported where used, not passed through layers.
- **Single state drives the modal**: `configTarget` replaces separate `isEditing`, `selectedGoal`, `configState` variables. `null` = closed, `fieldIndex: null` = adding, `fieldIndex: number` = editing.
- **Reusable via minimal contract**: `FormWithGoalLinks` only requires `goalLinks` field, not the full form type.
- **Preview is injected, not imported**: the config modal doesn't know about `ProjectFormPreview` — it receives it as `previewSlot`, keeping the goals feature decoupled from the project feature.

## Schemas

Schemas live in `features/<feature>/schemas/`. Sub-schemas are defined in the same file and exported individually for use in draft form resolvers.

```tsx
// features/projects/schemas/project-form-schema.ts
const createTaskSchema = z.object({
    name: z.string().min(1, "El nombre de la tarea es obligatorio"),
    description: z.string().nullable().optional(),
    startingDate: z.string().regex(DATE_PATTERNS.ISODateString, "..."),
    deadline: z.string().regex(DATE_PATTERNS.ISOTimestampString, "...").nullable().optional(),
    status: itemStatusEnum.nullable().optional(),
    weight: z.number(),
})

const createStageSchema = z.object({
    // ...fields
    tasks: z.array(createTaskSchema),
})

export const projectFormSchema = z.object({
    // ...fields
    stages: z.array(createStageSchema),
    goalLinks: z.array(z.object({
        goalId: z.number(),
        subitemWeight: z.number(),
        subitemOrder: z.number(),
    })),
})

export { createTaskSchema, createStageSchema }
// NO type exports — types come from features/<feature>/types/form/
```

Cross-feature schemas (like the goalLinks array schema) are defined inline in the parent form schema.

## Initial values

Defined in `features/<feature>/constants/formsInitialValues.ts`. One constant per form level, typed with the corresponding interface.

```tsx
import type { ProjectFormValues, StageFormValues, TaskFormValues } from "@/features/projects/types/form/project-form"

export const projectFormInitialValues: ProjectFormValues = {
    name: "", description: "", code: "",
    startingDate: "", deadline: "",
    stages: [], goalLinks: [],
}

export const stageFormInitialValues: StageFormValues = {
    name: "", description: null,
    startingDate: "", deadline: null,
    status: null, weight: 1, tasks: [],
}

export const taskFormInitialValues: TaskFormValues = {
    name: "", description: null,
    startingDate: "", deadline: null,
    status: null, weight: 1,
}
```

## Standard inputs

Use `<FormField>` for standard text/date/number inputs. It wraps `Controller` + `Input` + `Field` + `FieldLabel` + `FieldError`.

```tsx
<FormField
    name="name"
    control={form.control}
    label="Nombre"
    placeholder="Mi proyecto"
    type="text"
    transform={Number}  // optional: transform input value
/>
```

## Custom inputs

Custom inputs follow the same pattern as `FormField` — they include the `Controller`, `Field`, `FieldLabel`, and `FieldError` internally. This keeps usage clean and consistent:

```tsx
<WeightInput name="weight" control={draftForm.control} label="Peso" />
```

When creating a new custom input component, follow this structure (see `WeightInput` implementation):

```tsx
export function WeightInput({ name, control, label }: WeightInputProps) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel>
                        <Typography variant="p">{label}</Typography>
                    </FieldLabel>
                    {/* Your custom input UI here, using field.value and field.onChange */}
                    {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
                </Field>
            )}
        />
    )
}
```

## Layout components

- `<FieldSet>` — top-level form container with vertical gap
- `<FieldGroup>` — groups related fields (e.g. name + code, start date + deadline)
- `<Field>` — single field wrapper with label, input, and error
- `<FieldLabel>` — label element
- `<FieldError>` — error message
- `<Typography>` — all text in labels and titles

## Reusable UI components

| Component | Location | Purpose |
|-----------|----------|---------|
| `FormField` | `components/ui/form-field.tsx` | Standard input with Controller + validation |
| `WeightInput` | `components/ui/weight-input.tsx` | Tag-based percentage selector (5-100%) |
| `AddButton` | `components/ui/add-button.tsx` | Dashed button to add items |
| `Input` | `components/ui/input.tsx` | Base input element |
| `Button` | `components/ui/button.tsx` | Action button with variants |
| `Dialog` | `components/ui/dialog.tsx` | Modal with header/content/footer |

## Reference implementation

The project form is the reference for all these patterns:

- **Page**: `src/pages/projects/create-project-page.tsx`
- **Form**: `src/features/projects/components/project-form.tsx`
- **Form value interfaces**: `src/features/projects/types/form/project-form.ts`
- **Zod schema (validation only)**: `src/features/projects/schemas/project-form-schema.ts`
- **Section**: `src/features/projects/components/form/stage-form-section.tsx`
- **Sub-entity form**: `src/features/projects/components/form/stage-form.tsx`
- **Nested section**: `src/features/projects/components/form/task-form-section.tsx`
- **Nested sub-entity form**: `src/features/projects/components/form/task-form.tsx`
- **Cards**: `src/features/projects/components/stage-card.tsx`, `task-card.tsx`
- **Linking section**: `src/features/goals/components/form/goals-linking-section.tsx`
- **Linking contract**: `src/features/goals/types/form/goal-links-form.ts`
- **Selection modal**: `src/features/goals/components/form/goal-selection-modal.tsx`
- **Config modal**: `src/features/goals/components/form/goal-link-config-modal.tsx`
- **Initial values**: `src/features/projects/constants/formsInitialValues.ts`
