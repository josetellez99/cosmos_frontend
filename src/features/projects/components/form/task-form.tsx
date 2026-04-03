import { FormProvider, type UseFormReturn } from "react-hook-form"
import { FormField } from "@/components/ui/form-field"
import { Button } from "@/components/ui/button"
import { WeightInput } from "@/components/ui/weight-input"
import { FieldSet, FieldGroup } from "@/components/ui/field"
import type { TaskFormSchema } from "@/features/projects/schemas/project-form-schema"

interface TaskFormProps {
    draftForm: UseFormReturn<TaskFormSchema>
    onSave: () => void
    isEditing: boolean
}

export function TaskForm({ draftForm, onSave, isEditing }: TaskFormProps) {
    return (
        <FormProvider {...draftForm}>
            <FieldSet>
                <FieldGroup>
                    <FormField
                        name="name"
                        control={draftForm.control}
                        label="Nombre"
                        placeholder="Mi tarea"
                        type="text"
                    />
                    <FormField
                        name="description"
                        control={draftForm.control}
                        label="Descripción"
                        placeholder="Descripción opcional"
                        type="text"
                    />
                </FieldGroup>
                <FieldGroup>
                    <FormField
                        name="startingDate"
                        control={draftForm.control}
                        label="Fecha de inicio"
                        placeholder=""
                        type="date"
                    />
                    <FormField
                        name="deadline"
                        control={draftForm.control}
                        label="Fecha límite"
                        placeholder=""
                        type="date"
                    />
                </FieldGroup>
                <FieldGroup>
                    <WeightInput
                        name="weight"
                        control={draftForm.control}
                        label="Peso"
                    />
                </FieldGroup>
                <Button type="button" onClick={onSave}>
                    {isEditing ? "Guardar cambios" : "Agregar tarea"}
                </Button>
            </FieldSet>
        </FormProvider>
    )
}
