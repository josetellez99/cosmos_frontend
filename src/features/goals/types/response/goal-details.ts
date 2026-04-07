import type { Database } from "@/types/database.types"
import type { ISODateString, ISOTimestampString } from "@/types/dates"
import type { ProjectsSummary } from "@/features/projects/types/response/projects"
import type { GoalSummaryResponse } from "@/features/goals/types/response/user-goals"
import type { SystemSummaryResponse } from "@/features/systems/types/response/system-summary"
import type { HabitSummaryResponse } from "@/features/habits/types/response/habits"

export interface GoalDetailsResponse {
    id: number,
    name: string,
    startingDate: ISODateString,
    deadline: ISOTimestampString,
    status?: Database["public"]["Enums"]["item_status_type"],
    temporality?: Database["public"]["Enums"]["goal_temporality_type"],
    color: string,
    sortOrder: number,
    progress: number,
    isSubgoal: boolean,
    actionDetailResponse: any,
    createdAt: ISOTimestampString,
    modifiedAt: ISOTimestampString,
    subitems: GoalDetailsSubitem[]
}

export interface GoalDetailsSubitem {
    id: number
    subitemOrder: number
    subitemWeight: number
    habit: HabitSummaryResponse | null,
    system: SystemSummaryResponse | null,
    project: ProjectsSummary | null,
    subgoal: GoalSummaryResponse | null,
}


// TODO: type all of this correctly