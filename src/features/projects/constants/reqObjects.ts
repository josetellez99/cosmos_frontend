import type { GetProjectsRequest } from "@/features/projects/types/request/get-projects"

export const defaultProjectsPageReq: GetProjectsRequest = {
    status: ['in progress'],
    orderBy: 'sort_order',
    order: 'ASC',
}
