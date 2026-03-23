import { Constants } from "@/types/database.types";

// Extract temporality values from the database enum definition
const temporalityValues = Constants.public.Enums.goal_temporality_type;

// Create a mapped object from the enum values (no hardcoding)
export const goalTemporality = temporalityValues.reduce(
  (acc, value) => {
    const key = value.toUpperCase().replace(/_/g, "_");
    return { ...acc, [key]: value };
  },
  {} as Record<string, typeof temporalityValues[number]>
);

// Type-safe access
export type GoalTemporalityKey = keyof typeof goalTemporality;

// Derive a named type from the enum array
export type GoalTemporalityType = typeof temporalityValues[number];

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
export const TEMPORALITY_FILTER_OPTIONS = temporalityValues
  .filter(v => v !== goalTemporality.YEAR && v !== goalTemporality.DAY)
  .map(v => ({ value: v, label: TEMPORALITY_LABELS[v] }));
