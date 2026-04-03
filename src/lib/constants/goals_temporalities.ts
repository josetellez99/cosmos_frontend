import type { Database } from "@/types/database.types";

export type GoalTemporalityType = Database['public']['Enums']['goal_temporality_type'];

export const goalTemporality = {
  LONG_TERM: 'long_term',
  YEAR: 'year',
  SEMESTER: 'semester',
  QUARTER: 'quarter',
  MONTH: 'month',
  WEEK: 'week',
  DAY: 'day',
} as const satisfies Record<string, GoalTemporalityType>;

export type GoalTemporalityKey = keyof typeof goalTemporality;

// Spanish labels — Record ensures exhaustiveness at compile time
export const TEMPORALITY_LABELS: Record<GoalTemporalityType, string> = {
  'long_term': 'Largo plazo',
  'year': 'Año',
  'semester': 'Semestre',
  'quarter': 'Trimestre',
  'month': 'Mes',
  'week': 'Semana',
  'day': 'Día',
};

// Filter options — excludes 'year' (static section above) and 'day' (shown in dastboard)
export const TEMPORALITY_FILTER_OPTIONS = (Object.values(goalTemporality) as GoalTemporalityType[])
  .filter(v => v !== goalTemporality.DAY)
  .map(v => ({ value: v, label: TEMPORALITY_LABELS[v] }));
