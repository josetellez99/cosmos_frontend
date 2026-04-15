import type { GoalSubitemConnection } from "@/features/goals/types/conections/goal-subitem"
import type { SystemFormHabitConnection } from "@/features/systems/types/form/system-habit-connection"
import type { ISODateString } from "@/types/dates"

export interface CreateSystemRequest {
    name: string
    description?: string
    symbol: string
    startingDate: ISODateString
    habits?: SystemFormHabitConnection[]
    goalLinks?: GoalSubitemConnection[]
}
