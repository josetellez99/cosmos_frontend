import type { SystemSummaryResponse } from "@/features/systems/types/response/system-summary"
import { cn } from "@/helpers/cn-tailwind"
import { getStrengthenColor } from "@/helpers/strings/colors/get-strengthen-color"
import { getColorByProgress } from "@/helpers/strings/colors/get-color-by-progress"
import { Button } from "@/components/ui/button"
import type { ReactNode } from "react"
import { Pencil, Play, Trash2 } from "lucide-react"

interface SystemItemProps {
    system: SystemSummaryResponse
    children?: ReactNode
    onClick?: () => void
    showProgress?: boolean
    onEditClick?: () => void
    onRemoveClick?: () => void
    badge?: ReactNode
}

export const SystemItem = ({
    system,
    children,
    onClick,
    showProgress = true,
    onEditClick,
    onRemoveClick,
    badge,
}: SystemItemProps) => {
    const hasProgress = showProgress && system.progress !== undefined

    let progress_bg_color: string | undefined
    let progress_border_color: string | undefined
    let progress_accent_color: string | undefined

    if (hasProgress) {
        progress_bg_color = getColorByProgress(system.progress)
        progress_border_color = getStrengthenColor(progress_bg_color, 0.2)
        progress_accent_color = getStrengthenColor(progress_bg_color, 0.9)
    }

    const hasActions = onEditClick !== undefined || onRemoveClick !== undefined

    return (
        <div
            onClick={onClick}
            className={cn(
                "rounded-2xl border transition-all duration-300 bg-white overflow-hidden relative",
                onClick && "cursor-pointer",
                children ? "border-gray-100 shadow-sm" : "border-purple-200 p-5 group hover:border-purple-400"
            )}
        >
            <div className={cn(
                "flex items-center justify-between",
                children ? "p-4 pb-2" : ""
            )}>
                <div className="flex items-center gap-4 flex-1">
                    <div className={cn(
                        "rounded-xl flex items-center justify-center transition-colors",
                        children ? "w-8 h-8 bg-gray-50" : "w-10 h-10 bg-gray-50 group-hover:bg-purple-50"
                    )}>
                        🆚
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            <h3 className={cn(
                                "text-gray-800 tracking-tight transition-colors truncate",
                                children ? "text-[13px] font-semibold" : "text-sm group-hover:text-purple-900"
                            )}>
                                {system.name}
                            </h3>

                            {showProgress && (
                                <span
                                    className="text-xs font-bold px-2 py-1 rounded-md border"
                                    style={{
                                        backgroundColor: progress_bg_color,
                                        borderColor: progress_border_color,
                                        color: progress_accent_color,
                                    }}
                                >
                                    {system.progress}%
                                </span>
                            )}
                        </div>
                    </div>
                </div>

                <div className="flex items-center gap-1">
                    {badge}
                    {hasActions ? (
                        <>
                            {onEditClick && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={(e) => { e.stopPropagation(); onEditClick() }}
                                >
                                    <Pencil />
                                </Button>
                            )}
                            {onRemoveClick && (
                                <Button
                                    type="button"
                                    variant="ghost"
                                    size="icon-xs"
                                    onClick={(e) => { e.stopPropagation(); onRemoveClick() }}
                                >
                                    <Trash2 />
                                </Button>
                            )}
                        </>
                    ) : !children && (
                        <button className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer bg-purple-100 text-purple-600">
                            <Play className="w-4 h-4 fill-current ml-0.5" />
                        </button>
                    )}
                </div>
            </div>

            {children && (
                <div className="px-4 pb-2">
                    <div className="flex flex-col divide-y divide-gray-50">
                        {children}
                    </div>
                </div>
            )}
        </div>
    )
}
