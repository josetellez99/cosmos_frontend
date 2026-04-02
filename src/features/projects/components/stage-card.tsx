import { Pencil, Trash2 } from "lucide-react"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import type { StageFormSchema } from "@/features/projects/schemas/project-form-schema"

interface StageCardProps {
    stage: StageFormSchema
    index: number
    onEdit: (index: number) => void
    onRemove: (index: number) => void
}

export function StageCard({ stage, index, onEdit, onRemove }: StageCardProps) {
    return (
        <div className="default-card-rounded default-card-padding bg-white border border-soft-gray flex items-center justify-between gap-2">
            <div className="flex flex-col">
                <Typography variant="p">{stage.name}</Typography>
                <Typography variant="p" className="text-medium-gray text-xs">
                    {stage.tasks.length} {stage.tasks.length === 1 ? "tarea" : "tareas"}
                </Typography>
            </div>
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
