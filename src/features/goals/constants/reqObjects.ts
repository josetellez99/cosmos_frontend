import type { GetUserGoalsRequest } from "@/features/goals/types/request/get-user-goals"

const currentYear = new Date().getFullYear();

export const defaultYearlyGoalReq: GetUserGoalsRequest = {
    temporality: ['year'],
    status: ["not started", "in progress", "completed"],
    orderBy: 'sort_order',
    order: 'ASC',
    startDate: `${currentYear}-01-01`,
    endDate: `${currentYear}-12-31`
}