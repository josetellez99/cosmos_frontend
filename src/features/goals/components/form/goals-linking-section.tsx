import { useState, useMemo, type ReactNode } from "react"
import { useFieldArray, useFormContext } from "react-hook-form"
import { FieldError } from "@/components/ui/field"
import { GoalItem } from "@/features/goals/components/goal-item"
import { GoalSelectionModal } from "@/features/goals/components/form/goal-selection-modal"
import { GoalLinkConfigModal } from "@/features/goals/components/form/goal-link-config-modal"
import type { GoalSummaryResponse } from "@/features/goals/types/response/user-goals"
import type { FormWithGoalLinks } from "@/features/goals/types/form/goal-links-form"

interface ConfigTarget {
    goal: GoalSummaryResponse
    fieldIndex: number | null
}

interface GoalsLinkingSectionProps {
    previewSlot?: ReactNode
}

export function GoalsLinkingSection({ previewSlot }: GoalsLinkingSectionProps) {
    const { control, formState } = useFormContext<FormWithGoalLinks>()
    const { fields, append, update, remove } = useFieldArray({ control, name: "goalLinks" })

    const error = formState.errors.goalLinks?.message as string | undefined

    const [configTarget, setConfigTarget] = useState<ConfigTarget | null>(null)

    const [linkedGoals, setLinkedGoals] = useState<Map<number, GoalSummaryResponse>>(new Map())

    const excludeIds = useMemo(
        () => new Set(fields.map(f => f.goalId)),
        [fields],
    )

    const handleGoalSelected = (goal: GoalSummaryResponse) => {
        setConfigTarget({ goal, fieldIndex: null })
    }

    const handleEditClick = (index: number) => {
        const field = fields[index]
        const goal = linkedGoals.get(field.goalId)
        if (!goal) return
        setConfigTarget({ goal, fieldIndex: index })
    }

    const handleConfigConfirm = (weight: number, subitemOrder: number) => {
        if (!configTarget) return

        const link = {
            goalId: configTarget.goal.id,
            subitemWeight: weight,
            subitemOrder,
        }

        if (configTarget.fieldIndex !== null) {
            update(configTarget.fieldIndex, link)
        } else {
            append(link)
            setLinkedGoals(prev => new Map(prev).set(configTarget.goal.id, configTarget.goal))
        }

        setConfigTarget(null)
    }

    const handleRemove = (index: number) => {
        const field = fields[index]
        setLinkedGoals(prev => {
            const next = new Map(prev)
            next.delete(field.goalId)
            return next
        })
        remove(index)
    }

    return (
        <div className="flex flex-col gap-2">
            <ul className="flex flex-col gap-2">
                {fields.map((field, index) => (
                    <li key={field.id}>
                        <GoalItem
                            goal={linkedGoals.get(field.goalId) ?? null}
                            showProgress={true}
                            onEdit={() => handleEditClick(index)}
                            onRemove={() => handleRemove(index)}
                        />
                    </li>
                ))}
            </ul>

            <GoalSelectionModal
                excludeIds={excludeIds}
                onGoalSelect={handleGoalSelected}
            />

            <GoalLinkConfigModal
                goalId={configTarget?.goal.id ?? null}
                isEditing={configTarget?.fieldIndex !== null}
                existingWeight={
                    configTarget !== null && configTarget.fieldIndex !== null
                        ? fields[configTarget.fieldIndex]?.subitemWeight
                        : undefined
                }
                previewSlot={previewSlot}
                onClose={() => setConfigTarget(null)}
                onConfirm={handleConfigConfirm}
            />

            {error && <FieldError>{error}</FieldError>}
        </div>
    )
}
