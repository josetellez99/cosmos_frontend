import { useState } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { GoalItem } from "@/features/goals/components/goal-item"
import { GoalSelectionModal } from "@/features/goals/components/form/goal-selection-modal"
import { GoalLinkConfigModal, type GoalLinkConfig } from "@/features/goals/components/form/goal-link-config-modal"
import type { GoalLinkValues } from "@/features/goals/schemas/goal-link-schema"
import type { GoalSummaryResponse } from "@/features/goals/types/response/user-goals"

interface FormWithGoalLink {
    goalLink: GoalLinkValues[]
}

export function GoalsLinkingSection() {

    const form = useFormContext<FormWithGoalLink>()
    const { fields, append, update, remove } = useFieldArray({ control: form.control, name: "goalLink" })

    const [configState, setConfigState] = useState<{ config: GoalLinkConfig; editingIndex: number | null } | null>(null)
    const [goalsCache, setGoalsCache] = useState<Map<number, GoalSummaryResponse>>(new Map())

    const linkedGoalIds = new Set(fields.map(field => field.goalId))

    const handleGoalSelect = (goal: GoalSummaryResponse) => {
        setConfigState({
            config: { goal, weight: 5, isEditing: false },
            editingIndex: null,
        })
    }

    const handleEditClick = (index: number) => {
        const field = fields[index]
        const goal = goalsCache.get(field.goalId)
        if (!goal) return
        setConfigState({
            config: { goal, weight: field.subitemWeight, isEditing: true },
            editingIndex: index,
        })
    }

    const handleConfigConfirm = (weight: number) => {
        if (!configState) return

        const values: GoalLinkValues = {
            goalId: configState.config.goal.id,
            subitemWeight: weight,
        }

        if (configState.editingIndex !== null) {
            update(configState.editingIndex, values)
        } else {
            setGoalsCache(prev => new Map(prev).set(configState.config.goal.id, configState.config.goal))
            append(values)
        }

        setConfigState(null)
    }

    const handleRemove = (index: number) => {
        const field = fields[index]
        setGoalsCache(prev => {
            const next = new Map(prev)
            next.delete(field.goalId)
            return next
        })
        remove(index)
    }

    return (
        <div className="flex flex-col gap-2">
            {fields.length > 0 && (
                <ul className="flex flex-col gap-2">
                    {fields.map((field, index) => {
                        const goal = goalsCache.get(field.goalId)
                        if (!goal) return null
                        return (
                            <li key={field.goalId}>
                                <GoalItem
                                    goal={goal}
                                    showProgress={true}
                                    onEdit={() => handleEditClick(index)}
                                    onRemove={() => handleRemove(index)}
                                />
                            </li>
                        )
                    })}
                </ul>
            )}

            <GoalSelectionModal
                excludeIds={linkedGoalIds}
                onGoalSelect={handleGoalSelect}
            />

            <GoalLinkConfigModal
                config={configState?.config ?? null}
                onClose={() => setConfigState(null)}
                onConfirm={handleConfigConfirm}
            />
        </div>
    )
}
