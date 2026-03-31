import type { Database } from "@/types/database.types";
import type { CreateTasksProjectsRequest } from "@/features/projects/types/request/create-projects-tasks";

export interface CreateProjectStageRequest {
    deadline?: string | null
    description?: string | null
    name: string
    sortOrder: number
    startingDate: string
    status?: Database["public"]["Enums"]["item_status_type"] | null
    weight: number
    tasks: CreateTasksProjectsRequest[]
}