import { useState } from "react"
import { Typography } from "@/components/ui/typography"
import { AsyncErrorBoundary } from "@/components/async-boundary"
import { HabitsVsTasksToggle } from "@/features/dashboard/components/habits-vs-tasks-toggle"
import { TodayHabitsSection } from "@/features/dashboard/components/today-habits-section"
import { TasksComingSoon } from "@/features/dashboard/components/tasks-coming-soon"
import { TodayHabitsSkeleton } from "@/features/dashboard/components/loaders/today-habits-skeleton"
import type { HabitsVsTasksView } from "@/features/dashboard/types/habits-vs-tasks-view"

export const HabitsVsTasksSection = () => {

    const [view, setView] = useState<HabitsVsTasksView>('habits')
    const isHabits = view === 'habits'

    return (
        <>
            <div className="spacing-in-title-section flex items-center justify-between">
                <Typography variant="h3">{isHabits ? "Hábitos de hoy" : "Tareas"}</Typography>
                <HabitsVsTasksToggle view={view} onChange={setView} />
            </div>

            <div className="relative overflow-hidden">
                <div
                    className="flex transition-transform duration-300 ease-out"
                    style={{ transform: isHabits ? 'translateX(0%)' : 'translateX(-100%)' }}
                >
                    <div className="w-full flex-shrink-0">
                        <AsyncErrorBoundary loadingFallback={<TodayHabitsSkeleton />}>
                            <TodayHabitsSection />
                        </AsyncErrorBoundary>
                    </div>
                    <div className="w-full flex-shrink-0">
                        <TasksComingSoon />
                    </div>
                </div>
            </div>
        </>
    )
}
