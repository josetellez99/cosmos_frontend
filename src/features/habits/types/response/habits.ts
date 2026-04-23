import type { Database } from "@/types/database.types"
import type { ISOTimestampString } from "@/types/dates"

export interface HabitSummaryResponse {
    id: number,
    name: string,
    description: string,
    emoji: string,
    scheduleType: Database["public"]["Enums"]["habit_scheduling_type"],
    scheduleConfig: string,
    starting_date: string,
    progress: number
}

export interface HabitCompletionField {
    targetAmount: number
    completions: number
    records: ISOTimestampString[]
}
