import { z } from "zod"
import { DATE_PATTERNS } from "@/types/dates"

export const systemFormSchema = z.object({
    name: z.string().min(1, "El nombre del sistema es obligatorio"),
    description: z.string().optional(),
    symbol: z.string().min(1, "Selecciona un emoji"),
    startingDate: z.string().regex(DATE_PATTERNS.ISODateString, "Fecha de inicio invalida"),
    habits: z.array(z.object({
        habitId: z.number(),
        habitWeight: z.number(),
        habitOrder: z.number(),
    })),
    goalLinks: z.array(z.object({
        goalId: z.number(),
        subitemWeight: z.number(),
        subitemOrder: z.number(),
    })),
})
