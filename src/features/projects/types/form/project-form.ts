import type { GoalStatusType } from "@/lib/constants/goals_status"
import type { GoalSubitemConnection } from "@/features/goals/types/conections/goal-subitem"

export interface TaskFormValues {
    name: string
    description?: string | null
    startingDate: string
    deadline?: string | null
    status?: GoalStatusType | null
    weight: number
}

export interface StageFormValues {
    name: string
    description?: string | null
    startingDate: string
    deadline?: string | null
    status?: GoalStatusType | null
    weight: number
    tasks: TaskFormValues[]
}

export interface ProjectFormValues {
    name: string
    description?: string
    code: string
    startingDate: string
    deadline: string
    status?: GoalStatusType | null
    stages: StageFormValues[]
    goalLinks: GoalSubitemConnection[]
}
