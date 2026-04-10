import type { GoalSubitemConnection } from "@/features/goals/types/conections/goal-subitem"
import type { SystemHabitConnection } from "@/features/habits/types/form/system-habit-connection"
import type { ISODateString } from "@/types/dates"

export interface CreateHabitRequest {
    name: string
    description?: string
    emoji: string
    startingDate: ISODateString
    scheduleType: string
    scheduleConfig: string
    goalLinks?: GoalSubitemConnection[]
    systems?: SystemHabitConnection[]
}
