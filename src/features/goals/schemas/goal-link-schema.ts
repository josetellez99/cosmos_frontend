import { z } from 'zod'

export const goalLinkSchema = z.object({
    goalId: z.number(),
    subitemWeight: z.number(),
    subitemOrder: z.number(),
})

export type GoalLinkValues = z.infer<typeof goalLinkSchema>
