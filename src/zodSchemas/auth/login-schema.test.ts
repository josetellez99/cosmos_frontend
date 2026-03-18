import { loginSchema } from "@/zodSchemas/auth/login-schema";

describe("login schema", () => {
    it("should be true when correct data is provided", () => {
        const data = { email: "Jose@gmail.com", password: "123456" }
        expect(loginSchema.safeParse(data).success).toBe(true);
    })

    it("Should be false when an invalid email is provided", () => {
        const data = { email: "Josegmail.com", password: "123456" }
        expect(loginSchema.safeParse(data).success).toBe(false);
    })

    it("Should be false when no email is provided", () => {
        const data = { password: "123456" }
        expect(loginSchema.safeParse(data).success).toBe(false);
    })

    it("Should be false when no password is provided", () => {
        const data = { email: "Jose@gmail.com" }
        expect(loginSchema.safeParse(data).success).toBe(false);
    })

    it("Should be false when an empty email is provided", () => {
        const data = { email: "", password: "123456" }
        expect(loginSchema.safeParse(data).success).toBe(false);
    })

    it("Should be false when an empty password is provided", () => {
        const data = { email: "Jose@gmail.com", password: "" }
        expect(loginSchema.safeParse(data).success).toBe(false);
    })
})