import type { Database } from "@/types/database.types";

export interface CreateTasksProjectsRequest {
    deadline?: string | null
    description?: string | null
    name: string
    sortOrder: number
    startingDate: string
    status?: Database["public"]["Enums"]["item_status_type"] | null
    weight: number
}