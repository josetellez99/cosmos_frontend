import { getUserSession } from "@/features/auth/helpers/getUserSession";
import type { UserSession } from "@/features/auth/types/UserSession";

describe("getUserSession", () => {
    
    afterEach(() => {
        document.cookie = "cosmos_user_session=; Max-Age=0";
    });

    it("returns null when cookie does not exist", () => {
        expect(getUserSession()).toBeNull();
    });

    it("parses a valid session cookie", () => {
        const session: UserSession = { name: "Maria", lastName: "Rodriguez", email: "maria@test.com" };
        document.cookie = `cosmos_user_session=${encodeURIComponent(JSON.stringify(session))}`;

        expect(getUserSession()).toEqual(session);
    });

    it("returns null when cookie contains malformed JSON", () => {
        document.cookie = "cosmos_user_session=not-valid-json";
        expect(getUserSession()).toBeNull();
    });

    it("finds the session cookie among multiple cookies", () => {
        const session: UserSession = { name: "Maria", lastName: "Rodriguez", email: "maria@test.com" };
        document.cookie = "other_cookie=abc";
        document.cookie = `cosmos_user_session=${encodeURIComponent(JSON.stringify(session))}`;
        document.cookie = "another_cookie=xyz";

        expect(getUserSession()).toEqual(session);
    });

    it("handles special characters in user data", () => {
        const session: UserSession = { name: "José", lastName: "O'Brien", email: "jose+test@dominio.com" };
        document.cookie = `cosmos_user_session=${encodeURIComponent(JSON.stringify(session))}`;

        expect(getUserSession()).toEqual(session);
    });

    it("returns null when cookie value is empty", () => {
        document.cookie = "cosmos_user_session=";
        expect(getUserSession()).toBeNull(); 
    });
})