import { API_URL } from "@/lib/constants"

export const ENDPOINTS_MAP = {
    GOALS: {
        GET_USER_GOALS: `${API_URL}/goals`,
    },
    AUTH: {
        REGISTER: `${API_URL}/auth/register`,
        LOGIN: `${API_URL}/auth/login`,
        VERIFY_EMAIL: `${API_URL}/auth/confirm-email`
    }

}