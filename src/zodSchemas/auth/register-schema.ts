import { z } from "zod";

export const registerSchema = z
    .object({
        name: z.string().min(1, "El nombre es obligatorio"),
        lastName: z.string().min(1, "El apellido es obligatorio"),
        birthDate: z.
            string()
            .min(1, "La fecha de nacimiento es obligatoria")
            .refine((date) => !isNaN(new Date(date).getTime()), {
                message: "La fecha de nacimiento no es válida",
                path: ["birthDate"],
            }),
        email: z
            .string()
            .min(1, "El correo electrónico es obligatorio")
            .email("Correo electrónico inválido"),
        password: z
            .string()
            .min(8, "La contraseña debe tener al menos 8 caracteres"),
        confirmPassword: z.string().min(1, "Debes confirmar tu contraseña"),
    })
    .refine((data) => data.password === data.confirmPassword, {
        message: "Las contraseñas no coinciden",
        path: ["confirmPassword"],
    });

export type RegisterSchema = z.infer<typeof registerSchema>;
