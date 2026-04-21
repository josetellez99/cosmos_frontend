import type { Database } from "@/types/database.types"

export interface HabitSummaryResponse {
    id: number,
    name: string,
    description: string,
    emoji: string,
    schedule_type: Database["public"]["Enums"]["habit_scheduling_type"],
    schedule_config: string,
    starting_date: string,
    progress: number
}

export interface HabitCompletionField {
    targetAmount: number
    completions: number
}
