import type { Database } from "@/types/database.types"
import type { ISODateString, ISOTimestampString } from "@/types/dates"

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
    subitemOrder: number
    subitemWeight: number
    habit: any,
    system: any,
    project: any,
    subgoal: any
}


// TODO: type all of this correctly