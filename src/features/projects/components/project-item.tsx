import type { ProjectsSummary } from "@/features/projects/types/response/projects"
import { cn } from "@/helpers/cn-tailwind"

interface ProjectCardProps {
    project: ProjectsSummary
}

export function ProjectItem({ project }: ProjectCardProps) {
    
    return (
        <div
            className="p-5 rounded-[28px] border border-gray-100 bg-white flex flex-col gap-4 hover:border-purple-100 transition-all cursor-pointer group relative overflow-hidden"
        >
                {/* <div className="absolute top-0 left-0 bg-purple-600 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-br-lg rounded-tl-[28px] z-20">
                    {weight}%
                </div> */}
            {/* Background Progress Bar (More relevant) */}
            <div
                className="absolute bottom-0 left-0 h-1 bg-purple-600/10 transition-all duration-1000"
                style={{ width: `${project.progress}%` }}
            />

            <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-2xl bg-gray-50 flex items-center justify-center text-gray-400 group-hover:bg-purple-50 group-hover:text-purple-600 transition-all">
                    <span className="text-[10px] font-mono font-bold tracking-tighter">[{project.code}]</span>
                </div>
                <div className="flex-1 min-w-0">
                        <h3 className="font-medium text-gray-700 group-hover:text-purple-900 transition-colors uppercase text-sm tracking-tight truncate">
                            {project.name}
                        </h3>
                </div>
                <div className="text-right">
                    <span className={cn(
                        "text-[10px] font-bold px-2 py-0.5 rounded-md border shrink-0",
                    )}>
                        {project.progress}%
                    </span>
                </div>
            </div>

            <div className="h-0.5 w-full bg-gray-50/50 rounded-full overflow-hidden relative z-10">
                <div
                    className="h-full bg-purple-500 transition-all duration-1000"
                    style={{ width: `${project.progress}%` }}
                />
            </div>
        </div>
    )
}
