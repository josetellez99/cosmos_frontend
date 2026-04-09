import type { GetGoalRequest } from "@/features/goals/types/request/get-goal"

export const goalNoProgressRequest: GetGoalRequest = {
    includeProgress: false
}