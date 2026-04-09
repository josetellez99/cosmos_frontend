import { useState, type ReactNode } from "react"
import { useFormContext } from "react-hook-form"
import { FieldError } from "@/components/ui/field"
import { GoalItem } from "@/features/goals/components/goal-item"
import { GoalSelectionModal } from "@/features/goals/components/form/goal-selection-modal"
import { GoalLinkConfigModal } from "@/features/goals/components/form/goal-link-config-modal"
import type { GoalLinkValues } from "@/features/goals/schemas/goal-link-schema"
import type { GoalSummaryResponse } from "@/features/goals/types/response/user-goals"

interface FormWithGoalLink {
    goalLink?: GoalLinkValues
}

interface GoalsLinkingSectionProps {
    itemPreview: ReactNode
}

interface ConfigState {
    goal: GoalSummaryResponse
    isEditing: boolean
}

export function GoalsLinkingSection({ itemPreview }: GoalsLinkingSectionProps) {
    const { setValue, watch, formState } = useFormContext<FormWithGoalLink>()

    const goalLink = watch("goalLink")
    const error = formState.errors.goalLink?.message as string | undefined

    const [configState, setConfigState] = useState<ConfigState | null>(null)
    const [linkedGoal, setLinkedGoal] = useState<GoalSummaryResponse | null>(null)

    const handleGoalSelect = (goal: GoalSummaryResponse) => {
        setConfigState({ goal, isEditing: false })
    }

    const handleEditClick = () => {
        if (!linkedGoal) return
        setConfigState({ goal: linkedGoal, isEditing: true })
    }

    const handleConfigConfirm = (weight: number, subitemOrder: number) => {
        if (!configState) return
        setValue(
            "goalLink",
            {
                goalId: configState.goal.id,
                subitemWeight: weight,
                subitemOrder,
            },
            { shouldValidate: true, shouldDirty: true }
        )
        setLinkedGoal(configState.goal)
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
                goalId={configState?.goal.id ?? null}
                initialWeight={configState?.isEditing ? (goalLink?.subitemWeight ?? 5) : 5}
                isEditing={configState?.isEditing ?? false}
                itemPreview={itemPreview}
                onClose={() => setConfigState(null)}
                onConfirm={handleConfigConfirm}
            />

            {error && <FieldError>{error}</FieldError>}
        </div>
    )
}
