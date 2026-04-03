# Form Instructions

How forms are built in this app. Use ProjectForm as the reference implementation.

## Component hierarchy

```
Page (renders form with initialValues + isEditing)
└── EntityForm (FormProvider + <form> + onSubmit)
    ├── FormField (standard inputs: text, date, number)
    ├── WeightInput (tag-based percentage selector, includes Controller)
    ├── SectionComponent (useFormContext + useFieldArray)
    │   ├── ItemCard (display with edit/remove buttons)
    │   ├── AddButton (opens modal)
    │   └── Modal
    │       └── SubEntityForm (FormProvider with draftForm + fields + save button)
    │           └── NestedSection (useFormContext + useFieldArray)
    └── LinkingSection (useFormContext + useFieldArray)
        ├── ItemDisplay (with edit/remove)
        ├── SelectionModal (owns open/close + AddButton)
        └── ConfigModal (driven by parent state)
```

## File locations and naming

| Type | Location | Naming | Example |
|------|----------|--------|---------|
| Main form | `features/<feature>/components/` | `<entity>-form.tsx` | `project-form.tsx` |
| Sub-entity form | `features/<feature>/components/form/` | `<entity>-form.tsx` | `stage-form.tsx`, `task-form.tsx` |
| Form section | `features/<feature>/components/form/` | `<entity>-form-section.tsx` | `stage-form-section.tsx` |
| Display card | `features/<feature>/components/` | `<entity>-card.tsx` | `stage-card.tsx` |
| Form-related modals | `features/<feature>/components/form/` | `<action>-modal.tsx` | `goal-selection-modal.tsx` |
| Linking sections | `features/<feature>/components/form/` | `<entity>-linking-section.tsx` | `goals-linking-section.tsx` |
| Zod schema | `features/<feature>/schemas/` | `<entity>-schema.ts` or `<entity>-form-schema.ts` | `project-form-schema.ts` |
| Initial values | `features/<feature>/constants/` | `formsInitialValues.ts` | — |
| Reusable UI | `components/ui/` | `<component>.tsx` | `weight-input.tsx` |

## Main form (EntityForm)

The top-level form component receives `isEditing` and `initialValues`. It creates the form with `useForm`, wraps everything in `FormProvider`, and handles submission.

```tsx
// features/projects/components/project-form.tsx
export const ProjectForm = ({ isEditing, initialValues }: props) => {
    const form = useForm<ProjectFormSchema>({
        resolver: zodResolver(projectFormSchema),
        defaultValues: initialValues,
    })

    const onSubmit = (data: ProjectFormSchema) => {
        const request: CreateProjectRequest = {
            ...data,
            code: asProjectCodeString(data.code),
            startingDate: asISODateString(data.startingDate),
            deadline: asISOTimestampString(`${data.deadline}T00:00:00.000Z`),
        }
        // mutate(request)
    }

    return (
        <FormProvider {...form}>
            <form onSubmit={form.handleSubmit(onSubmit)}>
                <FieldSet>
                    <FormField name="name" control={form.control} ... />
                    <StagesSection />
                    <GoalsLinkingSection />
                    <Button type="submit">...</Button>
                </FieldSet>
            </form>
        </FormProvider>
    )
}
```

Key points:
- `FormProvider` wraps the entire form so sections access it via `useFormContext`
- Sections receive no props — they are self-contained
- `onSubmit` transforms the form schema into the API request type
- The page component passes `initialValues` (empty for create, populated for edit)

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
    const form = useFormContext<ProjectFormSchema>()
    const { fields, append, update, remove } = useFieldArray({
        control: form.control, name: "stages",
    })

    const draftForm = useForm<StageFormSchema>({
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
    stage: StageFormSchema
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

## Linking sections (cross-feature fields)

When a form links to entities from another feature (e.g. linking goals to a project), the section lives in the **linked feature's** directory under `components/form/`.

```
features/goals/components/form/
├── goals-linking-section.tsx    ← main section (useFormContext + useFieldArray)
├── goal-selection-modal.tsx     ← owns AddButton + open/close + filter + suspense list
└── goal-link-config-modal.tsx   ← weight configuration, opened by parent state
```

The linking section uses `useFormContext` with a minimal interface type:

```tsx
interface FormWithGoalLink {
    goalLink: GoalLinkValues[]
}

export function GoalsLinkingSection() {
    const form = useFormContext<FormWithGoalLink>()
    const { fields, append, update, remove } = useFieldArray({
        control: form.control,
        name: "goalLink",
    })
    // ...
}
```

This makes it reusable across any form (project, system, habit) as long as the schema includes a `goalLink` field.

Modals inside linking sections own their open/close state when possible:
- **Selection modal**: owns its `isOpen` state and renders the `AddButton` internally. The parent only passes `excludeIds` and `onGoalSelect`.
- **Config modal**: open/close driven by a `config` prop (non-null = open, null = closed), because the parent triggers it from multiple places (new selection + edit).

## Schemas

Schemas live in `features/<feature>/schemas/`. Sub-schemas are defined in the same file and exported individually for type inference and for use in draft form resolvers.

```tsx
// features/projects/schemas/project-form-schema.ts
const createTaskSchema = z.object({
    name: z.string().min(1, "El nombre de la tarea es obligatorio"),
    description: z.string().nullable().optional(),
    startingDate: z.string().regex(DATE_PATTERNS.ISODateString, "..."),
    deadline: z.string().regex(DATE_PATTERNS.ISODateString, "...").nullable().optional(),
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
    goalLink: z.array(goalLinkSchema),   // from features/goals/schemas/
})

export { createTaskSchema, createStageSchema }
export type TaskFormSchema = z.infer<typeof createTaskSchema>
export type StageFormSchema = z.infer<typeof createStageSchema>
export type ProjectFormSchema = z.infer<typeof projectFormSchema>
```

Cross-feature schemas (like `goalLinkSchema`) live in their own feature directory and are imported.

## Initial values

Defined in `features/<feature>/constants/formsInitialValues.ts`. One constant per schema level.

```tsx
export const projectFormInitialValues: ProjectFormSchema = {
    name: "", description: "", code: "",
    startingDate: "", deadline: "",
    stages: [], goalLink: [],
}

export const stageFormInitialValues: StageFormSchema = {
    name: "", description: null,
    startingDate: "", deadline: null,
    status: null, weight: 1, tasks: [],
}
```

## Schema to API request transformation

Form schemas and API request types are separate. The `onSubmit` handler transforms form data into the request shape:

```tsx
const onSubmit = (data: ProjectFormSchema) => {
    const request: CreateProjectRequest = {
        ...data,
        code: asProjectCodeString(data.code),
        startingDate: asISODateString(data.startingDate),
        deadline: asISOTimestampString(`${data.deadline}T00:00:00.000Z`),
    }
    mutate(request)
}
```

Request types live in `features/<feature>/types/request/`. They mirror the schema shape but use strict branded types (`ISODateString`, `ProjectCodeString`, etc.) instead of plain strings.

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
- **Section**: `src/features/projects/components/form/stage-form-section.tsx`
- **Sub-entity form**: `src/features/projects/components/form/stage-form.tsx`
- **Nested section**: `src/features/projects/components/form/task-form-section.tsx`
- **Nested sub-entity form**: `src/features/projects/components/form/task-form.tsx`
- **Cards**: `src/features/projects/components/stage-card.tsx`, `task-card.tsx`
- **Linking section**: `src/features/goals/components/form/goals-linking-section.tsx`
- **Modals**: `src/features/goals/components/form/goal-selection-modal.tsx`, `goal-link-config-modal.tsx`
- **Schema**: `src/features/projects/schemas/project-form-schema.ts`
- **Initial values**: `src/features/projects/constants/formsInitialValues.ts`
