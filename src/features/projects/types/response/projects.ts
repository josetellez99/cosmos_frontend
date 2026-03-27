import type { Database } from "@/types/database.types"
import type { ISODateString, ISOTimestampString } from "@/types/dates"

export interface ProjectsSummary {
    id: number,
    name: string,
    startingDate: ISODateString,
    deadline: ISOTimestampString,
    status?: Database["public"]["Enums"]["item_status_type"],
    code: string,
    sortOrder: number,
    progress: number
}