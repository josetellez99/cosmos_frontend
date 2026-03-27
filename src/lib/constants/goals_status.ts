import type { Database } from '@/types/database.types'

export type GoalStatusType = Database['public']['Enums']['item_status_type']

export const goalStatus = {
  NOT_STARTED: 'not started',
  IN_PROGRESS: 'in progress',
  DISCARDED: 'discarded',
  COMPLETED: 'completed',
} as const satisfies Record<string, GoalStatusType>
