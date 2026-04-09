import { FormProvider, type UseFormReturn } from "react-hook-form"
import { FormField } from "@/components/ui/form-field"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { WeightInput } from "@/components/ui/weight-input"
import { FieldSet, FieldGroup } from "@/components/ui/field"
import { TaskFormSection } from "@/features/projects/components/form/task-form-section"
import type { StageFormValues } from "@/features/projects/types/form/project-form"

interface StageFormProps {
    draftForm: UseFormReturn<StageFormValues>
    onSave: () => void
    isEditing: boolean
}

export function StageForm({ draftForm, onSave, isEditing }: StageFormProps) {
    return (
        <FormProvider {...draftForm}>
            <FieldSet>
                <FieldGroup>
                    <FormField
                        name="name"
                        control={draftForm.control}
                        label="Nombre"
                        placeholder="Mi etapa"
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
                        type="datetime-local"
                    />
                </FieldGroup>
                <FieldGroup>
                    <WeightInput
                        name="weight"
                        control={draftForm.control}
                        label="Peso"
                    />
                </FieldGroup>
                <div className="flex flex-col gap-2">
                    <Typography variant="h3">Tareas</Typography>
                    <TaskFormSection />
                </div>
                <Button type="button" onClick={onSave}>
                    {isEditing ? "Guardar cambios" : "Agregar etapa"}
                </Button>
            </FieldSet>
        </FormProvider>
    )
}
