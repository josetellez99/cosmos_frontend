import type { HabitSummaryResponse } from "@/features/habits/types/response/habits"
import type { HabitCompletionField } from "@/features/habits/types/response/habits"

export interface HabitForDateResponse extends HabitSummaryResponse {
    isChecked: boolean,
    completion: HabitCompletionField
}
