import type { Database } from "@/types/database.types"
import type { ISODateString, ISOTimestampString } from "@/types/dates"

export interface GoalSummaryResponse {
    id: number,
    name: string,
    startingDate: ISODateString,
    deadline: ISOTimestampString,
    status?: Database["public"]["Enums"]["item_status_type"],
    temporality?: Database["public"]["Enums"]["goal_temporality_type"],
    color: string,
    sortOrder: number,
    progress: number
}