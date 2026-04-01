import { z } from 'zod'

export const goalLinkProjectSchema = z.object({
    goalId: z.number(),
    subitemOrder: z.number(),
    subitemWeight: z.number(),
})