import { z } from "zod"
import { DATE_PATTERNS } from "@/types/dates"

export const habitFormSchema = z.object({
    name: z.string().min(1, "El nombre del habito es obligatorio"),
    description: z.string().optional(),
    emoji: z.string().min(1, "Selecciona un emoji"),
    startingDate: z.string().regex(DATE_PATTERNS.ISODateString, "Fecha de inicio invalida"),
    scheduleType: z.enum(["each_x_days", "fixed_weekly_days", "fixed_calendar_days"]),
    scheduleConfig: z.object({
        days: z.union([z.number(), z.array(z.number())]),
    }),
    goalLinks: z.array(z.object({
        goalId: z.number(),
        subitemWeight: z.number(),
        subitemOrder: z.number(),
    })),
    systems: z.array(z.object({
        systemId: z.number(),
        habitWeight: z.number(),
        habitOrder: z.number(),
    })),
}).superRefine((data, ctx) => {
    const { scheduleType, scheduleConfig } = data

    if (scheduleType === "each_x_days") {
        if (typeof scheduleConfig.days !== "number" || scheduleConfig.days < 1) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Indica cada cuantos dias",
                path: ["scheduleConfig"],
            })
        }
    } else {
        if (!Array.isArray(scheduleConfig.days) || scheduleConfig.days.length === 0) {
            ctx.addIssue({
                code: z.ZodIssueCode.custom,
                message: "Selecciona al menos un dia",
                path: ["scheduleConfig"],
            })
        }
    }
})
