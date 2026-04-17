import { useHabitsByDateSuspense } from "@/features/habits/hooks"
import { useUiContext } from "@/hooks/useUiContext"
import { TodayHabitsList } from "@/features/dashboard/components/today-habits-list"

export const TodayHabitsSection = () => {
    const { dashboardDate } = useUiContext()
    const { habits } = useHabitsByDateSuspense(dashboardDate)
    return <TodayHabitsList habits={habits} date={dashboardDate} />
}
