import { z } from "zod"
import { PROJECT_CODE_PATTERN } from "@/features/projects/types/project-code-string"
import { DATE_PATTERNS } from "@/types/dates"
import { goalStatus, type GoalStatusType } from "@/lib/constants/goals_status"

const itemStatusEnum = z.enum(Object.values(goalStatus) as [GoalStatusType, ...GoalStatusType[]])

const createTaskSchema = z.object({
    name: z.string().min(1, "El nombre de la tarea es obligatorio"),
    description: z.string().nullable().optional(),
    startingDate: z.string().regex(DATE_PATTERNS.ISODateString, "Fecha de inicio inválida"),
    deadline: z.string().regex(DATE_PATTERNS.ISOTimestampString, "Fecha límite inválida").nullable().optional(),
    status: itemStatusEnum.nullable().optional(),
    weight: z.number(),
})

const createStageSchema = z.object({
    name: z.string().min(1, "El nombre de la etapa es obligatorio"),
    description: z.string().nullable().optional(),
    startingDate: z.string().regex(DATE_PATTERNS.ISODateString, "Fecha de inicio inválida"),
    deadline: z.string().regex(DATE_PATTERNS.ISOTimestampString, "Fecha límite inválida").nullable().optional(),
    status: itemStatusEnum.nullable().optional(),
    weight: z.number(),
    tasks: z.array(createTaskSchema),
})

export { createTaskSchema, createStageSchema }

export const projectFormSchema = z.object({
    name: z.string().min(1, "El nombre del proyecto es obligatorio"),
    description: z.string().optional(),
    code: z.string().regex(PROJECT_CODE_PATTERN, "El código debe tener el formato XX-NN (ej. AB-12)"),
    startingDate: z.string().regex(DATE_PATTERNS.ISODateString, "Fecha de inicio inválida"),
    deadline: z.string().regex(DATE_PATTERNS.ISOTimestampString, "Fecha límite inválida"),
    status: itemStatusEnum.nullable().optional(),
    stages: z.array(createStageSchema),
    goalLinks: z.array(z.object({
        goalId: z.number(),
        subitemWeight: z.number(),
        subitemOrder: z.number(),
    })),
})
