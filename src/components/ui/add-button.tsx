import { Plus } from "lucide-react"
import { Typography } from "@/components/ui/typography"

interface AddButtonProps {
    text: string
    onClick: () => void
}

export function AddButton({ text, onClick }: AddButtonProps) {
    return (
        <button
            type="button"
            onClick={onClick}
            className="default-card-rounded default-card-padding w-full border-2 border-dashed border-soft-gray flex items-center justify-center gap-2 hover:border-primary hover:text-primary default-animation cursor-pointer text-medium-gray"
        >
            <Plus className="size-4 shrink-0" />
            <Typography variant="p">{text}</Typography>
        </button>
    )
}
