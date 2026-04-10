import type { GoalSubitemConnection } from "@/features/goals/types/conections/goal-subitem"
import type { SystemHabitConnection } from "@/features/habits/types/form/system-habit-connection"

export type HabitScheduleType = "each_x_days" | "fixed_weekly_days" | "fixed_calendar_days"

export type ScheduleConfigFormValue =
    | { days: number }
    | { days: number[] }

export interface HabitFormValues {
    name: string
    description?: string
    emoji: string
    startingDate: string
    scheduleType: HabitScheduleType
    scheduleConfig: ScheduleConfigFormValue
    goalLinks: GoalSubitemConnection[]
    systems: SystemHabitConnection[]
}
