import type { UserSession } from "@/features/auth/types/UserSession";
import { getCookie } from "@/helpers/cookies";
import { USER_SESSION_COOKIE } from "@/lib/constants/global_constants";

export function getUserSession(): UserSession | null {
    const raw = getCookie(USER_SESSION_COOKIE);
    if (!raw) return null;

    try {
        return JSON.parse(raw) as UserSession;
    } catch {
        return null;
    }
}
