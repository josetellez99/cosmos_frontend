import { Controller, useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormField } from "@/components/ui/form-field"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { FieldSet, FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field"
import { WeightInput } from "@/components/ui/weight-input"
import { createStageSchema, type StageFormSchema } from "@/features/projects/schemas/project-form-schema"
import { TaskFormSection } from "@/features/projects/components/task-form-section"

interface StageFormProps {
    onSubmit: (data: StageFormSchema) => void
    initialValues?: Partial<StageFormSchema>
    isEditing: boolean
}

export function StageForm({ onSubmit, initialValues, isEditing }: StageFormProps) {
    const form = useForm<StageFormSchema>({
        resolver: zodResolver(createStageSchema),
        defaultValues: {
            ...initialValues,
        },
    })

    const { fields, append, update, remove } = useFieldArray({
        control: form.control,
        name: 'tasks',
    })

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldSet>
                <FieldGroup>
                    <FormField
                        name="name"
                        control={form.control}
                        label="Nombre"
                        placeholder="Mi etapa"
                        type="text"
                    />
                    <FormField
                        name="description"
                        control={form.control}
                        label="Descripción"
                        placeholder="Descripción opcional"
                        type="text"
                    />
                </FieldGroup>
                <FieldGroup>
                    <FormField
                        name="startingDate"
                        control={form.control}
                        label="Fecha de inicio"
                        placeholder=""
                        type="date"
                    />
                    <FormField
                        name="deadline"
                        control={form.control}
                        label="Fecha límite"
                        placeholder=""
                        type="date"
                    />
                </FieldGroup>
                <FieldGroup>
                    <FormField
                        name="sortOrder"
                        control={form.control}
                        label="Orden"
                        placeholder="0"
                        type="number"
                        transform={Number}
                    />
                    <Controller
                        name="weight"
                        control={form.control}
                        render={({ field, fieldState }) => (
                            <Field data-invalid={fieldState.invalid}>
                                <FieldLabel htmlFor={field.name}>
                                    <Typography variant="p">Peso</Typography>
                                </FieldLabel>
                                <WeightInput
                                    id={field.name}
                                    value={field.value}
                                    onChange={field.onChange}
                                    onBlur={field.onBlur}
                                />
                                {fieldState.invalid && <FieldError>{fieldState.error?.message}</FieldError>}
                            </Field>
                        )}
                    />
                </FieldGroup>
                <div className="flex flex-col gap-2">
                    <Typography variant="h3">Tareas</Typography>
                    <TaskFormSection
                        tasks={fields}
                        onAdd={append}
                        onEdit={(i, d) => update(i, d)}
                        onRemove={remove}
                    />
                </div>
                <Button type="submit" disabled={form.formState.isSubmitting} isLoading={form.formState.isSubmitting}>
                    {isEditing ? "Guardar cambios" : "Agregar etapa"}
                </Button>
            </FieldSet>
        </form>
    )
}
