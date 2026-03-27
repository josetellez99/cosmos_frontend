import type { Database } from "@/types/database.types"
import type { ISODateString, ISOTimestampString } from "@/types/dates"
import type { ProjecstOrderBy } from "@/features/projects/types/project-order-by"

export interface GetProjectsRequest {
    startDate?: ISODateString
    endDate?: ISOTimestampString
    status?: Database["public"]["Enums"]["item_status_type"][]
    orderBy?: ProjecstOrderBy
    order?: string
}