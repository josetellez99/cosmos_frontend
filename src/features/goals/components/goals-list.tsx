import { GoalItem } from "@/features/goals/components/goal-item"
import type { GoalSummaryResponse } from "@/features/goals/types/response/user-goals"
import { FallbackMessage } from "@/components/ui/messages/fallback-message"

interface props {
    goals: GoalSummaryResponse[]
    fallbackMessage: string
}

export const GoalsList = ({ goals, fallbackMessage } : props) => {

    if (goals.length === 0) {
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
            {goals.map((goal) => (
                <li key={goal.id}>
                    <GoalItem goal={goal} />
                </li> 
            ))}
        </ul>
    )
}