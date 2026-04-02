import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import type { TaskFormSchema } from "@/features/projects/schemas/project-form-schema"

interface TaskCardProps {
    task: TaskFormSchema
    index: number
    onEdit: (index: number) => void
    onRemove: (index: number) => void
}

export function TaskCard({ task, index, onEdit, onRemove }: TaskCardProps) {
    return (
        <div className="default-card-rounded default-card-padding bg-white border border-soft-gray flex items-center justify-between gap-2">
            <Typography variant="p">{task.name}</Typography>
            <div className="flex items-center gap-1">
                <Button type="button" variant="ghost" size="icon-xs" onClick={() => onEdit(index)}>
                    <Pencil />
                </Button>
                <Button type="button" variant="ghost" size="icon-xs" onClick={() => onRemove(index)}>
                    <Trash2 />
                </Button>
            </div>
        </div>
    )
}
