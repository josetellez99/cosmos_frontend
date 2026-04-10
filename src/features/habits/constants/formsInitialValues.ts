import type { HabitFormValues } from "@/features/habits/types/form/habit-form"

export const habitFormInitialValues: HabitFormValues = {
    name: "",
    description: "",
    emoji: "🎯",
    startingDate: "",
    scheduleType: "each_x_days",
    scheduleConfig: { days: 1 },
    goalLinks: [],
    systems: [],
}
