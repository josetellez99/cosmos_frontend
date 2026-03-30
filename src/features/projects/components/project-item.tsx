import type { ProjectsSummary } from "@/features/projects/types/response/projects"
import { cn } from "@/helpers/cn-tailwind"
import { Typography } from "@/components/ui/typography"
import { getStrengthenColor } from "@/helpers/strings/colors/get-strengthen-color"
import { getColorByProgress } from "@/helpers/strings/colors/get-color-by-progress"

interface ProjectCardProps {
    project: ProjectsSummary
}

export function ProjectItem({ project }: ProjectCardProps) {

    const progress_bg_color = getColorByProgress(project.progress)    
    const progress_border_color = getStrengthenColor(progress_bg_color, 0.2)
    const progress_accent_color = getStrengthenColor(progress_bg_color, 0.9)

    return (
        <div
            className="default-card-rounded default-card-padding bg-white flex flex-col gap-3 border default-animation cursor-pointer group overflow-hidden
            border-soft-gray hover:border-primary "
        >
            <div className="flex items-center gap-4">
                <div className="w-12 h-12 default-card-rounded bg-thin-gray flex items-center justify-center text-medium-gray group-hover:bg-primary/10 group-hover:text-primary default-animation">
                    <span className="text-[10px] font-mono font-bold tracking-tighter">[{project.code}]</span>
                </div>
                <div className="flex-1 min-w-0">
                    <Typography className="group-hover:text-primary">
                        {project.name}
                    </Typography>

                </div>
                <div className="text-right">
                    <span className={cn(
                        "text-xs font-bold px-2 py-1 rounded-md border",
                    )}
                        style={{
                            backgroundColor: progress_bg_color,
                            borderColor: progress_border_color,
                            color: progress_accent_color
                        }}
                    >
                        {project.progress}%
                    </span>
                </div>
            </div>

            <div className="h-1 w-full gray-placeholder rounded-full overflow-hidden relative z-10">
                <div
                    className="h-full bg-primary default-card-rounded default-animation"
                    style={{ width: `${project.progress}%` }}
                />
            </div>
        </div>
    )
}
