import { useFormContext } from "react-hook-form"
import { Typography } from "@/components/ui/typography"
import type { ProjectFormSchema } from "@/features/projects/schemas/project-form-schema"

export function ProjectFormPreview() {
    const { watch } = useFormContext<ProjectFormSchema>()
    const name = watch("name")
    const code = watch("code")

    return (
        <div className="default-card-rounded default-card-padding bg-white flex items-center gap-4 border border-soft-gray">
            <div className="w-12 h-12 default-card-rounded bg-thin-gray flex items-center justify-center text-medium-gray">
                <span className="text-[10px] font-mono font-bold tracking-tighter">
                    [{code || "--"}]
                </span>
            </div>
            <div className="flex-1 min-w-0">
                <Typography>
                    {name || "Proyecto sin nombre"}
                </Typography>
            </div>
        </div>
    )
}
