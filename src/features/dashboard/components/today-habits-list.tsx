import { useNavigate } from "react-router"
import { HabitItem } from "@/features/habits/components/habit-item"
import { FallbackMessage } from "@/components/ui/messages/fallback-message"
import { useCreateHabitRecord, useDeleteHabitRecord } from "@/features/habit-records/hooks"
import type { HabitForDateResponse } from "@/features/habits/types/response/habit-for-date"
import type { DateTypesForAmountRangeHabit } from '@/features/habits/types/date-type-amount-range-habits'
import { dateIsToday } from "@/helpers/dates/date-is-today"

interface props {
    habits: HabitForDateResponse[]
    dashboardDate: string
    dateType: DateTypesForAmountRangeHabit
}

export const DashboardHabitsList = ({ habits, dashboardDate, dateType }: props) => {

    const navigate = useNavigate()
    const { mutate: createRecord } = useCreateHabitRecord({ date: dashboardDate, dateType })
    const { mutate: deleteRecord } = useDeleteHabitRecord(dateType)

    if (habits.length === 0) {
        return (
            <FallbackMessage>
                No tienes hábitos programados para hoy🎯
            </FallbackMessage>
        )
    }

    return (
        <ul className="flex flex-col spacing-in-list-elements">
            {habits.map((habit) => (
                <li key={habit.id}>
                    <HabitItem
                        habit={habit}
                        allowCheck
                        isChecked={habit.isChecked}
                        amountRangeHabitCompletion={habit.completion}
                        onToggleCheck={(next) => {
                            if (next) {
                                createRecord({ habitId: habit.id })
                            } else {
                                deleteRecord({ habitId: habit.id, date: dashboardDate })
                            }
                        }}
                        isNested={false}
                        onClick={() => navigate(`/habitos/${habit.id}`)}
                        isShowedToday={dateIsToday(dashboardDate)}
                        showingDate={dashboardDate}
                    />
                </li>
            ))}
        </ul>
    )
}
