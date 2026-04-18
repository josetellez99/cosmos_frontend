import type { UserSession } from "@/features/auth/types/UserSession";

const COOKIE_NAME = "cosmos_user_session";

export function getUserSession(): UserSession | null {
    const match = document.cookie.match(new RegExp(`(?:^|; )${COOKIE_NAME}=([^;]*)`));
    console.log(match)
    if (!match) return null;

    try {
        return JSON.parse(decodeURIComponent(match[1])) as UserSession;
    } catch {
        return null;
    }
}
