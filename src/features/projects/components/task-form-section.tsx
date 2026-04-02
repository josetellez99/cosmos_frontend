import { useState } from "react"
import { type Control, Controller, useFieldArray, useForm } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AddButton } from "@/components/ui/add-button"
import { Dialog, DialogContent, DialogHeader, DialogScrollArea, DialogTitle } from "@/components/ui/dialog"
import { FormField } from "@/components/ui/form-field"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { FieldSet, FieldGroup, Field, FieldLabel, FieldError } from "@/components/ui/field"
import { WeightInput } from "@/components/ui/weight-input"
import { TaskCard } from "@/features/projects/components/task-card"
import { createTaskSchema, type StageFormSchema, type TaskFormSchema } from "@/features/projects/schemas/project-form-schema"
import { taskFormInitialValues } from "@/features/projects/constants/formsInitialValues"

interface TaskFormSectionProps {
    control: Control<StageFormSchema>
}

export function TaskFormSection({ control }: TaskFormSectionProps) {
    const { fields, append, update, remove } = useFieldArray({ control, name: "tasks" })
    const [isOpen, setIsOpen] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)

    const draftForm = useForm<TaskFormSchema>({
        resolver: zodResolver(createTaskSchema),
    })

    const openAdd = () => {
        setEditingIndex(null)
        draftForm.reset(taskFormInitialValues)
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
                {fields.map((task, index) => (
                    <li key={task.id}>
                        <TaskCard
                            task={task}
                            index={index}
                            onEdit={openEdit}
                            onRemove={remove}
                        />
                    </li>
                ))}
            </ul>
            <AddButton text="Agregar tarea" onClick={openAdd} />
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <Typography variant="p">
                                {editingIndex !== null ? "Editar tarea" : "Nueva tarea"}
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
                            <Button type="button" onClick={handleSave}>
                                {editingIndex !== null ? "Guardar cambios" : "Agregar tarea"}
                            </Button>
                        </FieldSet>
                    </DialogScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    )
}
