import { Controller, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { FormField } from "@/components/ui/form-field"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { FieldSet, FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field"
import { WeightInput } from "@/components/ui/weight-input"
import { createTaskSchema, type TaskFormValues } from "@/features/projects/schemas/project-form-schema"

interface TaskFormProps {
    onSubmit: (data: TaskFormValues) => void
    initialValues?: Partial<TaskFormValues>
    isEditing: boolean
}

export function TaskForm({ onSubmit, initialValues, isEditing }: TaskFormProps) {
    const form = useForm<TaskFormValues>({
        resolver: zodResolver(createTaskSchema),
        defaultValues: {
            name: '',
            description: null,
            startingDate: '',
            deadline: null,
            status: null,
            sortOrder: 0,
            weight: 1,
            ...initialValues,
        },
    })

    return (
        <form onSubmit={form.handleSubmit(onSubmit)}>
            <FieldSet>
                <FieldGroup>
                    <FormField
                        name="name"
                        control={form.control}
                        label="Nombre"
                        placeholder="Mi tarea"
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
                <Button type="submit" disabled={form.formState.isSubmitting} isLoading={form.formState.isSubmitting}>
                    {isEditing ? "Guardar cambios" : "Agregar tarea"}
                </Button>
            </FieldSet>
        </form>
    )
}
