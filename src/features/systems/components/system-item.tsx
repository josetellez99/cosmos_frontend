import { Typography } from "@/components/ui/typography"
import type { SystemSummaryResponse } from "@/features/systems/types/response/system-summary"
import { Link } from "react-router";
import { cn } from "@/helpers/cn-tailwind";
import { getStrengthenColor } from "@/helpers/strings/colors/get-strengthen-color";
import { getColorByProgress } from "@/helpers/strings/colors/get-color-by-progress";
import type { ReactNode } from "react"
import {
    Play,
    Settings,
    BookOpen,
    Target,
    RefreshCcw,
    Wallet,
    Zap,
    Users,
    Mail,
    Eye,
    Heart,
    ShoppingBag,
    TrendingUp
} from "lucide-react"


interface props {
	system: SystemSummaryResponse
	children: ReactNode
}


// interface SystemCardProps {
//     sistema: {
//         id: number
//         title: string
//         desc: string
//         active: boolean
//         icon?: string
//         parentColors?: string[]
//         progress?: number
//     }
//     children?: React.ReactNode
//     showWeight?: boolean
//     weight?: number
// }

// export function SystemCard({ sistema, children, showWeight, weight }: SystemCardProps) {
export const SystemItem = ({ system, children }: props) => {

	const progress_bg_color = getColorByProgress(system.progress);
	const progress_border_color = getStrengthenColor(progress_bg_color, 0.2);
	const progress_accent_color = getStrengthenColor(progress_bg_color, 0.9);

    return (
        <div
            className={cn(
                "rounded-2xl border transition-all duration-300 bg-white overflow-hidden relative cursor-pointer",
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
                        {/* <IconComponent /> */} icon component
                    </div>
                    <div className="flex-1 min-w-0">
                        <div className="flex items-center gap-2">
                            {system.parentColors && system.parentColors.length > 0 && (
                                <div className="flex gap-1 items-center">
                                    {system.parentColors.map((pColor, i) => (
                                        <div key={i} className={cn("w-1.5 h-1.5 rounded-full")} />
                                    ))}
                                </div>
                            )}

                            {/* System Title as Link */}
                            <Link to={`/sistemas/${system.id}`} className="hover:opacity-70 transition-opacity truncate">
                                <h3 className={cn(
                                    "text-gray-800 tracking-tight transition-colors",
                                    children ? "text-[13px] font-semibold" : "text-sm group-hover:text-purple-900"
                                )}>
                                    {system.name}
                                </h3>
                            </Link>

							<div className="text-right">
              <span
                className={cn("text-xs font-bold px-2 py-1 rounded-md border")}
                style={{
                  backgroundColor: progress_bg_color,
                  borderColor: progress_border_color,
                  color: progress_accent_color,
                }}
              >
                {system.progress}%
              </span>
            </div>
                        </div>
                        {/* {!children && <p className="text-xs text-gray-400 mt-0.5">{system.desc}</p>} */}
                    </div>
                </div>

                {!children && (
                    <button className="w-10 h-10 rounded-2xl flex items-center justify-center transition-all cursor-pointer bg-purple-100 text-purple-600">
                        <Play className="w-4 h-4 fill-current ml-0.5" />
                    </button>
                )}
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
