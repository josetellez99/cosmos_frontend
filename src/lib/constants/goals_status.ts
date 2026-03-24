import { Constants } from '@/types/database.types'

const statusValues = Constants.public.Enums.item_status_type

export const goalStatus = statusValues.reduce(
  (acc, value) => {
    const key = value.toUpperCase().replace(/[\s_]+/g, '_')
    return { ...acc, [key]: value }
  },
  {} as Record<string, typeof statusValues[number]>
)

export type GoalStatusType = typeof statusValues[number]
