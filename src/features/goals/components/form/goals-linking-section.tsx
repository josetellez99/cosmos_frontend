import { useState } from "react"
import { useFormContext } from "react-hook-form"
import { FieldError } from "@/components/ui/field"
import { GoalItem } from "@/features/goals/components/goal-item"
import { GoalSelectionModal } from "@/features/goals/components/form/goal-selection-modal"
import { GoalLinkConfigModal, type GoalLinkConfig } from "@/features/goals/components/form/goal-link-config-modal"
import type { GoalLinkValues } from "@/features/goals/schemas/goal-link-schema"
import type { GoalSummaryResponse } from "@/features/goals/types/response/user-goals"

interface FormWithGoalLink {
    goalLink?: GoalLinkValues
}

export function GoalsLinkingSection() {
    const { setValue, watch, formState } = useFormContext<FormWithGoalLink>()

    const goalLink = watch("goalLink")
    const error = formState.errors.goalLink?.message as string | undefined

    const [configState, setConfigState] = useState<{ config: GoalLinkConfig } | null>(null)
    const [linkedGoal, setLinkedGoal] = useState<GoalSummaryResponse | null>(null)

    const handleGoalSelect = (goal: GoalSummaryResponse) => {
        setConfigState({ config: { goal, weight: 5, isEditing: false } })
    }

    const handleEditClick = () => {
        if (!linkedGoal || !goalLink) return
        setConfigState({
            config: { goal: linkedGoal, weight: goalLink.subitemWeight, isEditing: true },
        })
    }

    const handleConfigConfirm = (weight: number) => {
        if (!configState) return
        setValue(
            "goalLink",
            {
                goalId: configState.config.goal.id,
                subitemWeight: weight,
                subitemOrder: 0,
            },
            { shouldValidate: true, shouldDirty: true }
        )
        setLinkedGoal(configState.config.goal)
        setConfigState(null)
    }

    const handleRemove = () => {
        setValue("goalLink", undefined, { shouldValidate: true, shouldDirty: true })
        setLinkedGoal(null)
    }

    const excludeIds = linkedGoal ? new Set([linkedGoal.id]) : new Set<number>()

    return (
        <div className="flex flex-col gap-2">
            {linkedGoal ? (
                <GoalItem
                    goal={linkedGoal}
                    showProgress={true}
                    onEdit={handleEditClick}
                    onRemove={handleRemove}
                />
            ) : (
                <GoalSelectionModal
                    excludeIds={excludeIds}
                    onGoalSelect={handleGoalSelect}
                />
            )}

            <GoalLinkConfigModal
                config={configState?.config ?? null}
                onClose={() => setConfigState(null)}
                onConfirm={handleConfigConfirm}
            />

            {error && <FieldError>{error}</FieldError>}
        </div>
    )
}
