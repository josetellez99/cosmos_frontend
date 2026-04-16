import { useMemo } from "react"
import { useHabitsByDateSuspense } from "@/features/habits/hooks"
import { formatDateForApi } from "@/features/habits/helpers/format-date-for-api"
import { TodayHabitsList } from "@/features/dashboard/components/today-habits-list"

export const TodayHabitsSection = () => {
    const today = useMemo(() => formatDateForApi(new Date()), [])
    const { habits } = useHabitsByDateSuspense(today)
    return <TodayHabitsList habits={habits} date={today} />
}
