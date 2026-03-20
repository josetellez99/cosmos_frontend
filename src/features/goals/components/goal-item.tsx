"use client"

import { cn } from "@/lib/utils"
import { Link }from "react-router"
import { ChevronDown, Zap, Repeat, Folder, ArrowRight, Circle } from "lucide-react"
import * as React from "react"
import type { GoalSummaryResponse } from "@/features/goals/types/response/user-goals"

interface props {
    goal: GoalSummaryResponse
}

/* , isBlurred, showWeight, weight, expandable  */

export const GoalItem = ({ goal }: props) => {

    const [isExpanded, setIsExpanded] = React.useState(false)
    // const isYearly = goal.temporality === "Year"

    const getTextColor = (c: string) => {
        switch (c) {
            case "blue": return "text-blue-600"
            case "orange": return "text-orange-600"
            case "emerald": return "text-emerald-600"
            case "violet": return "text-violet-600"
            case "rose": return "text-rose-600"
            case "amber": return "text-amber-600"
            default: return "text-gray-600"
        }
    }

    const getBarColor = (c: string) => {
        switch (c) {
            case "blue": return "bg-blue-500"
            case "orange": return "bg-orange-500"
            case "emerald": return "bg-emerald-500"
            case "violet": return "bg-violet-500"
            case "rose": return "bg-rose-500"
            case "amber": return "bg-amber-500"
            default: return "bg-gray-500"
        }
    }

    return (
        <div>
            {/* {showWeight && weight !== undefined && (
                <div className="absolute top-0 left-0 bg-purple-600 text-white text-[9px] font-mono font-bold px-1.5 py-0.5 rounded-br-lg rounded-tl-2xl z-20">
                    {weight}%
                </div>
            )} */}
            <div className="flex justify-between items-center mb-3">
                <div className="flex items-center gap-2.5">
                    {/* {!isYearly && goal.parentColors && goal.parentColors.length > 0 && (
                        <div className="flex gap-1 items-center">
                            {goal.parentColors.map((pColor, i) => (
                                <div key={i} className={cn("w-2 h-2 rounded-full", getBulletColor(pColor))} />
                            ))}
                        </div>
                    )} */}
                    <Link to={`/metas/${goal.id}`} className="hover:opacity-70 transition-opacity">
                        <h3 className="text-[13px] font-semibold tracking-tight opacity-90">{goal.name}</h3>
                    </Link>
                </div>
                <div className="flex items-center gap-3">
                    <span className={cn(
                        "text-[10px] font-black px-2 py-0.5 rounded-lg",
                        getTextColor(goal.color)
                    )}>
                        {goal.progress}%
                    </span>
                </div>
            </div>
            <div className={cn(
                "h-1.5 w-full rounded-full overflow-hidden mb-1",
            )}>
                <div
                    className={cn(
                        "h-full transition-all duration-1000 ease-out rounded-full",
                        getBarColor(goal.color)
                    )}
                    style={{ width: `${goal.progress}%` }}
                />
            </div>

            {/* {expandable && (
                <button
                    onClick={(e) => {
                        e.preventDefault()
                        setIsExpanded(!isExpanded)
                    }}
                    className="absolute bottom-2 right-4 text-gray-400 p-1 hover:text-[#4c1d95] transition-colors"
                >
                    <ChevronDown className={cn("w-4 h-4 transition-transform duration-300", isExpanded && "rotate-180")} />
                </button>
            )} */}

            {isExpanded && (
                <div className="mt-4 pt-4 border-t border-gray-100/20 flex flex-col gap-2 animate-in fade-in duration-300">
                    {/* Subgoals */}
                    {/* {INITIAL_GOALS.filter(g => g.parentIds?.includes(goal.id)).map(sg => (
                        <div key={sg.id} className="flex items-center justify-between text-[11px] opacity-80">
                            <div className="flex items-center gap-2">
                                <ArrowRight className="w-2.5 h-2.5" />
                                <span className="font-medium truncate max-w-[180px]">{sg.name}</span>
                            </div>
                            <span className="font-bold tabular-nums">{sg.progress}%</span>
                        </div>
                    ))} */}
                    {/* Systems */}
                    {/* {INITIAL_SYSTEMS.filter(s => goal.relatedSystems?.includes(s.id)).map(s => (
                        <div key={s.id} className="flex items-center justify-between text-[11px] opacity-80">
                            <div className="flex items-center gap-2">
                                <Zap className="w-2.5 h-2.5" />
                                <span className="truncate max-w-[180px]">{s.title}</span>
                            </div>
                            <span className="font-bold tabular-nums">{s.progress}%</span>
                        </div>
                    ))} */}
                    {/* Habits */}
                    {/* {INITIAL_HABITS.filter(h => goal.relatedHabits?.includes(h.id)).map(h => (
                        <div key={h.id} className="flex items-center justify-between text-[11px] opacity-80">
                            <div className="flex items-center gap-2">
                                <span className="w-2.5 h-2.5 flex items-center justify-center text-[10px]">{h.emoji}</span>
                                <span className="truncate max-w-[180px]">{h.name}</span>
                            </div>
                            <span className="font-bold tabular-nums">{h.progress || 0}%</span>
                        </div>
                    ))} */}
                    {/* Projects */}
                    {/* {INITIAL_PROJECTS.filter(p => goal.relatedProjects?.includes(p.id)).map(p => (
                        <div key={p.id} className="flex items-center justify-between text-[11px] opacity-80">
                            <div className="flex items-center gap-2">
                                <span className="font-mono text-[8px] border border-current px-1 rounded-sm">[{p.code}]</span>
                                <span className="truncate max-w-[180px]">{p.title}</span>
                            </div>
                            <span className="font-bold tabular-nums">{p.progress}%</span>
                        </div>
                    ))} */}
                </div>
            )}
        </div>
    )
}
