import type { Database } from "@/types/database.types"

type ItemStatusType = Database['public']['Enums']['item_status_type']

export type ProjectStatusType = Exclude<ItemStatusType, 'discarded'>

export const projectStatus = {
  NOT_STARTED: 'not started',
  IN_PROGRESS: 'in progress',
  COMPLETED: 'completed',
} as const satisfies Record<string, ProjectStatusType>

export const PROJECT_STATUS_LABELS: Record<ProjectStatusType, string> = {
  'not started': 'Sin iniciar',
  'in progress': 'En progreso',
  'completed': 'Completado',
}

export const PROJECT_STATUS_FILTER_OPTIONS = (Object.values(projectStatus) as ProjectStatusType[])
  .map(v => ({ value: v, label: PROJECT_STATUS_LABELS[v] }))
