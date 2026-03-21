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
