import type { Database } from "@/types/database.types"
import type { GoalOrderBy } from "@/features/goals/types/goals"

export interface GetUserGoalsRequest {
    temporality?: Database["public"]["Enums"]["goal_temporality_type"]
    status?: Database["public"]["Enums"]["item_status_type"]
    orderBy?: GoalOrderBy
    order?: number
    startDate?: string
    endDate?: string
}