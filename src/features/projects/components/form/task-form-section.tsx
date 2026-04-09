import { useState } from "react"
import { useFieldArray, useForm, useFormContext } from "react-hook-form"
import { zodResolver } from "@hookform/resolvers/zod"
import { AddButton } from "@/components/ui/add-button"
import { Dialog, DialogContent, DialogHeader, DialogScrollArea, DialogTitle } from "@/components/ui/dialog"
import { Typography } from "@/components/ui/typography"
import { TaskCard } from "@/features/projects/components/task-card"
import { TaskForm } from "@/features/projects/components/form/task-form"
import { createTaskSchema, type StageFormSchema, type TaskFormSchema } from "@/features/projects/schemas/project-form-schema"
import { taskFormInitialValues } from "@/features/projects/constants/formsInitialValues"

export function TaskFormSection() {
    const form = useFormContext<StageFormSchema>()
    const { fields: tasks, append, update, remove } = useFieldArray({ control: form.control, name: "tasks" })
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
        draftForm.reset(tasks[index])
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
                {tasks.map((task, index) => (
                    <li key={`${task.id}-${index}-${Date.now()}`}>
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
                        <TaskForm
                            draftForm={draftForm}
                            onSave={handleSave}
                            isEditing={editingIndex !== null}
                        />
                    </DialogScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    )
}
