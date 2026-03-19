import { useState } from "react";

import type { GetUserGoalsRequest } from "@/features/goals/types/request/get-user-goals"
import type { GoalSummaryResponse } from "@/features/goals/types/response/user-goals"
import type { ApiResponse } from "@/lib/apiResponses"

import { getUserGoalsService } from "@/features/goals/services/get-goals-service"

export const useGoals = () => {
    
    const [goals, setGoals] = useState<GoalSummaryResponse[]>([])
    const [goalsError, setGoalsError] = useState<string>()

    const getUserGoals = async (req?: GetUserGoalsRequest) => {
        const response = await getUserGoalsService(req)
        if(response.ok) {
            setGoals(response.data)
        } else {
            setGoalsError(response.message)
        }
    }

    return {
        goals,
        goalsError,
        getUserGoals
    }
};

// TODO: get all goals by default (status active, temporality yearly)
// TODO: egt archieved goals
// TODO: get goals by temporality