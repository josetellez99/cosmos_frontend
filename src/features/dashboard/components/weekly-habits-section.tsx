import { useHabitsByDateSuspense } from "@/features/habits/hooks"
import { useUiContext } from "@/hooks/useUiContext"
import { TodayHabitsList } from "@/features/dashboard/components/today-habits-list"
import { Typography } from "@/components/ui/typography"

export const WeeklyHabitsSection = () => {
    const { dashboardDate } = useUiContext()
    const { habits } = useHabitsByDateSuspense(dashboardDate, 'weekly')
    return (
        <div className="spacing-in-sections">
            <Typography variant="h3" className="spacing-in-title-section">{"Hábitos de esta semana"}</Typography>
            <TodayHabitsList habits={habits} date={dashboardDate} />
        </div>
    ) 
}
