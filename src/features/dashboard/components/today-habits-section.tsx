import { useHabitsByDateSuspense } from "@/features/habits/hooks"
import { useUiContext } from "@/hooks/useUiContext"
import { DashboardHabitsList } from "@/features/dashboard/components/today-habits-list"
import { Typography } from "@/components/ui/typography"

export const TodayHabitsSection = () => {
    const { dashboardDate } = useUiContext()
    const { habits } = useHabitsByDateSuspense(dashboardDate, 'dayly')
    return (
        <div className="spacing-in-sections">
            <Typography variant="h3" className="spacing-in-title-section">{"Hábitos de hoy"}</Typography>
            <DashboardHabitsList  habits={habits} date={dashboardDate} dateType="dayly" />
        </div>
    );
}
