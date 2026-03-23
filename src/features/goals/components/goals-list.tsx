import { GoalItem } from "@/features/goals/components/goal-item"
import type { GoalSummaryResponse } from "@/features/goals/types/response/user-goals"

interface props {
    goals: GoalSummaryResponse[]
}

export const GoalsList = ({ goals } : props) => {
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