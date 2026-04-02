import { useState } from "react"
import { AddButton } from "@/components/ui/add-button"
import { Dialog, DialogContent, DialogHeader, DialogScrollArea, DialogTitle } from "@/components/ui/dialog"
import { Typography } from "@/components/ui/typography"
import { TaskForm } from "@/features/projects/components/task-form"
import { TaskCard } from "@/features/projects/components/task-card"
import type { TaskFormSchema } from "@/features/projects/schemas/project-form-schema"
import { taskFormInitialValues } from "@/features/projects/constants/formsInitialValues"

interface TaskFormModalProps {
    tasks: TaskFormSchema[]
    onAdd: (data: TaskFormSchema) => void
    onEdit: (index: number, data: TaskFormSchema) => void
    onRemove: (index: number) => void
}

export function TaskFormSection({ tasks, onAdd, onEdit, onRemove }: TaskFormModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [editingIndex, setEditingIndex] = useState<number | null>(null)

    const openAdd = () => {
        setEditingIndex(null)
        setIsOpen(true)
    }

    const openEdit = (index: number) => {
        setEditingIndex(index)
        setIsOpen(true)
    }

    const handleSubmit = (data: TaskFormSchema) => {
        if (editingIndex !== null) {
            onEdit(editingIndex, data)
        } else {
            onAdd(data)
        }
        setIsOpen(false)
    }

    return (
        <div className="flex flex-col gap-2">
            <ul className="flex flex-col gap-2">
                {tasks.map((task, index) => (
                    <li key={index}>
                        <TaskCard
                            task={task}
                            index={index}
                            onEdit={openEdit}
                            onRemove={onRemove}
                        />
                    </li>
                ))}
            </ul>
            <AddButton text="Agregar tarea" onClick={openAdd} />
            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent>
                    <DialogHeader>
                        <DialogTitle>
                            <Typography variant="h3">
                                {editingIndex !== null ? "Editar tarea" : "Nueva tarea"}
                            </Typography>
                        </DialogTitle>
                    </DialogHeader>
                    <DialogScrollArea>
                        <TaskForm
                            key={editingIndex ?? 'new'}
                            isEditing={editingIndex !== null}
                            initialValues={editingIndex !== null ? tasks[editingIndex] : taskFormInitialValues}
                            onSubmit={handleSubmit}
                        />
                    </DialogScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    )
}
