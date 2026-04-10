import { API_URL } from "@/lib/constants/global_constants"

export const ENDPOINTS_MAP = {
    GOALS: {
        GET_USER_GOALS: `${API_URL}/goals`,
        GET_GOAL: `${API_URL}/goals`,
    },
    PROJECTS: {
        GET_PROJECTS: `${API_URL}/projects`,
        POST_PROJECT: `${API_URL}/projects`
    },
    SYSTEMS: {
        GET_SYSTEMS: `${API_URL}/systems`,
        GET_SYSTEM: `${API_URL}/systems`,
    },
    HABITS: {
        GET_HABITS: `${API_URL}/habits`,
        POST_HABIT: `${API_URL}/habits`,
    },
    GOAL_LINK: {
        PUT_GOAL_LINK: `${API_URL}/goal-links`
    },
    AUTH: {
        REGISTER: `${API_URL}/auth/register`,
        LOGIN: `${API_URL}/auth/login`,
        VERIFY_EMAIL: `${API_URL}/auth/confirm-email`
    }

}