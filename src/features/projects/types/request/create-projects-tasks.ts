import type { Database } from "@/types/database.types";

export interface CreateTasksProjectsRequest {
    deadline?: string | null
    description?: string | null
    name: string
    startingDate: string
    status?: Database["public"]["Enums"]["item_status_type"] | null
    weight: number
}