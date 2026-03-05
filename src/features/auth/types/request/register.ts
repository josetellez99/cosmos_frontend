export interface RegisterRequest {
    email: string,
    password: string,
    confirmPassword: string,
    name: string,
    lastName: string,
    birthDate: string; // LocalDate (yyyy-mm-dd)
}