import { registerSchema } from "@/zodSchemas/auth/register-schema";

describe("Register schema", () => {
    it("should be true when correct data is provided", () => {
        const data = { name: "Jose", lastName: "Tellez", birthDate: "1999-03-26", email: "Jose@gmail.com", password: "123456789", confirmPassword: "123456789" }
        expect(registerSchema.safeParse(data).success).toBe(true)
    })
    it("should be false with the name is empty", () => {
        const data = { name: "", lastName: "Tellez", birthDate: "1999-03-26", email: "Jose@gmail.com", password: "123456789", confirmPassword: "123456789" }
        expect(registerSchema.safeParse(data).success).toBe(false)
    })
    it("should be false with the lastName is empty", () => {
        const data = { name: "Jose", lastName: "", birthDate: "1999-03-26", email: "Jose@gmail.com", password: "123456789", confirmPassword: "123456789" }
        expect(registerSchema.safeParse(data).success).toBe(false)
    })
    it("should be false with the birthDate is empty", () => {
        const data = { name: "Jose", lastName: "Tellez", birthDate: "", email: "Jose@gmail.com", password: "123456789", confirmPassword: "123456789" }
        expect(registerSchema.safeParse(data).success).toBe(false)
    })
    it("should be false with the email is empty", () => {
        const data = { name: "Jose", lastName: "Tellez", birthDate: "1999-03-26", email: "", password: "123456789", confirmPassword: "123456789" }
        expect(registerSchema.safeParse(data).success).toBe(false)
    })
    it("should be false with the password is empty", () => {
        const data = { name: "Jose", lastName: "Tellez", birthDate: "1999-03-26", email: "Jose@gmail.com", password: "", confirmPassword: "123456789" }
        expect(registerSchema.safeParse(data).success).toBe(false)
    })
    it("should be false with the confirmPassword is empty", () => {
        const data = { name: "Jose", lastName: "Tellez", birthDate: "1999-03-26", email: "Jose@gmail.com", password: "123456789", confirmPassword: "" }
        expect(registerSchema.safeParse(data).success).toBe(false)
    })
    it("should be false with the passwords are not the same", () => {
        const data = { name: "Jose", lastName: "Tellez", birthDate: "1999-03-26", email: "Jose@gmail.com", password: "12345678910", confirmPassword: "123456789" }
        expect(registerSchema.safeParse(data).success).toBe(false)
    })
    it("should be false when birthDate is not a valid date string", () => {
        const data = { name: "Jose", lastName: "Tellez", birthDate: "hola soy german", email: "Jose@gmail.com", password: "123456789", confirmPassword: "123456789" }
        expect(registerSchema.safeParse(data).success).toBe(false)
    })
    it("should be false when birthDate is not a valid date string case 2", () => {
        const data = { name: "Jose", lastName: "Tellez", birthDate: "1999-03-32", email: "Jose@gmail.com", password: "123456789", confirmPassword: "123456789" }
        expect(registerSchema.safeParse(data).success).toBe(false)
    })
    it("should be false when birthDate is not a valid date string case 3", () => {
        const data = { name: "Jose", lastName: "Tellez", birthDate: "jose", email: "Jose@gmail.com", password: "123456789", confirmPassword: "123456789" }
        expect(registerSchema.safeParse(data).success).toBe(false)
    })
    it("should be false when email is not valid email format", () => {
        const data = { name: "Jose", lastName: "Tellez", birthDate: "1999-03-26", email: "Josegmail.com", password: "123456789", confirmPassword: "123456789" }
        expect(registerSchema.safeParse(data).success).toBe(false)
    })
})