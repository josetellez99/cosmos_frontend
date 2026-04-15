import type { GoalSubitemConnection } from "@/features/goals/types/conections/goal-subitem"
import type { SystemFormHabitConnection } from "@/features/systems/types/form/system-habit-connection"

export interface SystemFormValues {
    name: string
    description?: string
    symbol: string
    startingDate: string
    habits: SystemFormHabitConnection[]
    goalLinks: GoalSubitemConnection[]
}
