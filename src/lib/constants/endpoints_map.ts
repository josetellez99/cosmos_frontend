import { API_URL } from "@/lib/constants/global_constants"

export const ENDPOINTS_MAP = {
    GOALS: {
        GET_USER_GOALS: `${API_URL}/goals`,
    },
    PROJECTS: {
        GET_PROJECTS: `${API_URL}/projects`
    },
    SYSTEMS: {
        GET_SYSTEMS: `${API_URL}/systems`
    },
    AUTH: {
        REGISTER: `${API_URL}/auth/register`,
        LOGIN: `${API_URL}/auth/login`,
        VERIFY_EMAIL: `${API_URL}/auth/confirm-email`
    }

}