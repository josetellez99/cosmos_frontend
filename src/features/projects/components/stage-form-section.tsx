import { useState } from "react"
import { Controller, useFieldArray, useForm, useFormContext } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AddButton } from "@/components/ui/add-button"
import {
    Dialog,
    DialogContent,
    DialogHeader,
    DialogScrollArea,
    DialogTitle,
} from "@/components/ui/dialog"
import { FormField } from "@/components/ui/form-field"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { FieldSet, FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field"
import { WeightInput } from "@/components/ui/weight-input"
import { StageCard } from "@/features/projects/components/stage-card"
import { TaskFormSection } from "@/features/projects/components/task-form-section"
import { createStageSchema, type ProjectFormSchema, type StageFormSchema } from "@/features/projects/schemas/project-form-schema"
import { stageFormInitialValues } from "@/features/projects/constants/formsInitialValues"

export function StagesSection() {
    const form = useFormContext<ProjectFormSchema>()
    const { fields, append, update, remove } = useFieldArray({ control: form.control, name: "stages" })
    const [isOpen, setIsOpen] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)

    const draftForm = useForm<StageFormSchema>({
        resolver: zodResolver(createStageSchema),
    })

    const openAdd = () => {
        setEditingIndex(null)
        draftForm.reset(stageFormInitialValues)
        setIsOpen(true)
    }

    const openEdit = (index: number) => {
        setEditingIndex(index)
        draftForm.reset(fields[index])
        setIsOpen(true)
    }

    const handleSave = draftForm.handleSubmit((data) => {
        if (editingIndex !== null) {
            update(editingIndex, data)
        } else {
            append(data)
        }
        setIsOpen(false)
    })

    return (
        <div className="flex flex-col gap-2">
            <ul className="flex flex-col gap-2">
                {fields.map((stage, index) => (
                    <li key={stage.id}>
                        <StageCard
                            stage={stage}
                            index={index}
                            onEdit={openEdit}
                            onRemove={remove}
                        />
                    </li>
                ))}
            </ul>
            <AddButton text="Agregar etapa" onClick={openAdd} />
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            <Typography variant="p">
                                {editingIndex !== null ? "Editar etapa" : "Nueva etapa"}
                            </Typography>
                        </DialogTitle>
                    </DialogHeader>
                    <DialogScrollArea>
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
                                    type="date"
                                />
                            </FieldGroup>
                            <FieldGroup>
                                <FormField
                                    name="sortOrder"
                                    control={draftForm.control}
                                    label="Orden"
                                    placeholder="0"
                                    type="number"
                                    transform={Number}
                                />
                                <Controller
                                    name="weight"
                                    control={draftForm.control}
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
                                <TaskFormSection control={draftForm.control} />
                            </div>
                            <Button type="button" onClick={handleSave}>
                                {editingIndex !== null ? "Guardar cambios" : "Agregar etapa"}
                            </Button>
                        </FieldSet>
                    </DialogScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    )
}
