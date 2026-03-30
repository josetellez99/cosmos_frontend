import type { Database } from '@/types/database.types'

export type GoalStatusType = Database['public']['Enums']['item_status_type']

export const goalStatus = {
  NOT_STARTED: 'not started',
  IN_PROGRESS: 'in progress',
  DISCARDED: 'discarded',
  COMPLETED: 'completed',
} as const satisfies Record<string, GoalStatusType>

export const GOAL_STATUS_LABELS: Record<GoalStatusType, string> = {
  'not started': 'Sin iniciar',
  'in progress': 'En progreso',
  'completed': 'Completado',
  'discarded': 'Descartado',
}

export const GOAL_STATUS_FILTER_OPTIONS = (Object.values(goalStatus) as GoalStatusType[])
  .map(v => ({ value: v, label: GOAL_STATUS_LABELS[v] }))
