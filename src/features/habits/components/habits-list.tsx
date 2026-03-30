import { HabitItem } from "@/features/habits/components/habit-item"
import type { HabitSummaryResponse } from "@/features/habits/types/response/habits"
import { FallbackMessage } from "@/components/ui/messages/fallback-message"

interface props {
    habits: HabitSummaryResponse[]
    fallbackMessage: string
}

export const HabitsList = ({ habits, fallbackMessage } : props) => {

    if (habits.length === 0) {
        return (
            <div>
                <FallbackMessage>
                    {fallbackMessage}
                </FallbackMessage>
            </div>
        )
    }

    return (
        <ul className="flex flex-col spacing-in-list-elements">
            {habits.map((habit) => (
                <li key={habit.id}>
                    <HabitItem 
                        habit={habit} 
                        allowCheck={false}
                        isNested={false}
                    />
                </li>
            ))}
        </ul>
    )
}
