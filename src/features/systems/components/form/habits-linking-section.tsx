import { useState, useMemo } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { FieldError } from "@/components/ui/field"
import { HabitItem } from "@/features/habits/components/habit-item"
import { HabitSelectionModal } from "@/features/systems/components/form/habit-selection-modal"
import { HabitLinkConfigModal } from "@/features/systems/components/form/habit-link-config-modal"
import type { HabitSummaryResponse } from "@/features/habits/types/response/habits"
import type { SystemFormValues } from "@/features/systems/types/form/system-form"

interface ConfigTarget {
    habit: HabitSummaryResponse
    fieldIndex: number | null
}

export function HabitsLinkingSection() {
    const { control, formState } = useFormContext<SystemFormValues>()
    const { fields: habits, append, update, remove } = useFieldArray({ control, name: "habits" })

    const error = formState.errors.habits?.message as string | undefined

    const [configTarget, setConfigTarget] = useState<ConfigTarget | null>(null)
    const [linkedHabits, setLinkedHabits] = useState<Map<number, HabitSummaryResponse>>(new Map())

    const excludeIds = useMemo(
        () => new Set(habits.map(f => f.habitId)),
        [habits],
    )

    const handleHabitSelected = (habit: HabitSummaryResponse) => {
        setConfigTarget({ habit, fieldIndex: null })
    }

    const handleEditClick = (index: number) => {
        const field = habits[index]
        const habit = linkedHabits.get(field.habitId)
        if (!habit) return
        setConfigTarget({ habit, fieldIndex: index })
    }

    const handleConfigConfirm = (weight: number, habitOrder: number) => {
        if (!configTarget) return

        const link = {
            habitId: configTarget.habit.id,
            habitWeight: weight,
            habitOrder,
        }

        if (configTarget.fieldIndex !== null) {
            update(configTarget.fieldIndex, link)
        } else {
            append(link)
            setLinkedHabits(prev => new Map(prev).set(configTarget.habit.id, configTarget.habit))
        }

        setConfigTarget(null)
    }

    const handleRemove = (index: number) => {
        const field = habits[index]
        setLinkedHabits(prev => {
            const next = new Map(prev)
            next.delete(field.habitId)
            return next
        })
        remove(index)
    }

    const nextOrder = configTarget?.fieldIndex !== null && configTarget !== null
        ? habits[configTarget.fieldIndex!]?.habitOrder ?? habits.length + 1
        : habits.length + 1

    return (
        <div className="flex flex-col gap-2">
            <ul className="flex flex-col gap-2">
                {habits.map((field, index) => {
                    const habit = linkedHabits.get(field.habitId)
                    if (!habit) return null
                    return (
                        <li key={field.id}>
                            <HabitItem
                                habit={habit}
                                allowCheck={false}
                                isNested={false}
                                onEditClick={() => handleEditClick(index)}
                                onRemoveClick={() => handleRemove(index)}
                                badge={
                                    <span className="text-xs font-bold text-primary px-2 py-1 rounded-md border border-primary/20 bg-primary/10">
                                        {field.habitWeight}%
                                    </span>
                                }
                            />
                        </li>
                    )
                })}
            </ul>

            <HabitSelectionModal
                excludeIds={excludeIds}
                onHabitSelect={handleHabitSelected}
            />

            <HabitLinkConfigModal
                habit={configTarget?.habit ?? null}
                isEditing={configTarget?.fieldIndex !== null}
                existingWeight={
                    configTarget !== null && configTarget.fieldIndex !== null
                        ? habits[configTarget.fieldIndex]?.habitWeight
                        : undefined
                }
                nextOrder={nextOrder}
                onClose={() => setConfigTarget(null)}
                onConfirm={handleConfigConfirm}
            />

            {error && <FieldError>{error}</FieldError>}
        </div>
    )
}
