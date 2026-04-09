import { useEffect, useState, type ReactNode } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { WeightInput } from "@/components/ui/weight-input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogScrollArea, DialogTitle } from "@/components/ui/dialog"
import { AsyncErrorBoundary } from "@/components/async-boundary"
import { GoalItem } from "@/features/goals/components/goal-item"
import { GoalSubitemCard } from "@/features/goals/components/form/goal-subitem-card"
import { EditSubitemWeightModal } from "@/features/goals/components/form/edit-subitem-weight-modal"
import { GoalDetailsSkeleton } from "@/features/goals/components/loaders/goal-details-skeleton"
import { useGoalSuspense } from "@/features/goals/hooks/useGoalSuspense"
import type { GoalDetailsSubitem } from "@/features/goals/types/response/goal-details"
import { goalNoProgressRequest } from "@/features/goals/constants/request/goal/goal-no-progress"

interface GoalLinkConfigModalProps {
    goalId: number | null
    isEditing: boolean
    existingWeight?: number
    previewSlot?: ReactNode
    onClose: () => void
    onConfirm: (weight: number, subitemOrder: number) => void
}

interface WeightFormValues {
    weight: number
}

interface GoalLinkConfigBodyProps {
    goalId: number
    isEditing: boolean
    existingWeight?: number
    previewSlot?: ReactNode
    onConfirm: (weight: number, subitemOrder: number) => void
}

function GoalLinkConfigBody({ goalId, isEditing, existingWeight, previewSlot, onConfirm }: GoalLinkConfigBodyProps) {
    const { goal } = useGoalSuspense(goalId, goalNoProgressRequest)

    const initialWeight = existingWeight ?? 5

    const { control, watch, reset } = useForm<WeightFormValues>({
        defaultValues: { weight: initialWeight },
    })

    useEffect(() => {
        reset({ weight: initialWeight })
    }, [initialWeight, reset])

    const [editingSubitem, setEditingSubitem] = useState<GoalDetailsSubitem | null>(null)

    const handleConfirm = () => {
        onConfirm(watch("weight"), goal.subitems.length + 1)
    }

    return (
        <>
            <DialogScrollArea>
                <div className="flex flex-col gap-4">
                    <GoalItem goal={goal} showProgress={false} />

                    {goal.subitems.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <Typography variant="p" className="text-xs text-medium-gray">
                                Elementos vinculados
                            </Typography>
                            <div className="flex flex-col gap-3 pt-2">
                                {goal.subitems.map((subitem) => (
                                    <GoalSubitemCard
                                        key={`${subitem.subitemOrder}-${subitem.project?.id ?? subitem.subgoal?.id ?? subitem.system?.id ?? subitem.habit?.id}`}
                                        subitem={subitem}
                                        onClick={setEditingSubitem}
                                    />
                                ))}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <Typography variant="p" className="text-xs text-medium-gray">
                            Nuevo elemento
                        </Typography>
                        {previewSlot && <div className="pt-2">{previewSlot}</div>}
                        <WeightInput
                            name="weight"
                            control={control}
                            label="Peso"
                        />
                    </div>
                </div>
            </DialogScrollArea>

            <DialogFooter className="mt-4">
                <Button type="button" onClick={handleConfirm}>
                    {isEditing ? "Guardar" : "Vincular"}
                </Button>
            </DialogFooter>

            <EditSubitemWeightModal
                goal={goal}
                subitem={editingSubitem}
                onClose={() => setEditingSubitem(null)}
            />
        </>
    )
}

export function GoalLinkConfigModal({
    goalId,
    isEditing,
    existingWeight,
    previewSlot,
    onClose,
    onConfirm,
}: GoalLinkConfigModalProps) {
    const handleOpenChange = (open: boolean) => {
        if (!open) onClose()
    }

    return (
        <Dialog open={goalId !== null} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        <Typography variant="h3">
                            {isEditing ? "Editar vinculación" : "Configurar vinculación"}
                        </Typography>
                    </DialogTitle>
                </DialogHeader>
                {goalId !== null && (
                    <AsyncErrorBoundary loadingFallback={<GoalDetailsSkeleton />}>
                        <GoalLinkConfigBody
                            goalId={goalId}
                            isEditing={isEditing}
                            existingWeight={existingWeight}
                            previewSlot={previewSlot}
                            onConfirm={onConfirm}
                        />
                    </AsyncErrorBoundary>
                )}
            </DialogContent>
        </Dialog>
    )
}
