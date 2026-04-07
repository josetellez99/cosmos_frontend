import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { WeightInput } from "@/components/ui/weight-input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { GoalItem } from "@/features/goals/components/goal-item"
import { GoalSubitemCard } from "@/features/goals/components/form/goal-subitem-card"
import { useUpdateGoalLink } from "@/features/goalLink/hooks/useUpdateGoalLink"
import type { GoalDetailsResponse, GoalDetailsSubitem } from "@/features/goals/types/response/goal-details"

interface EditSubitemWeightModalProps {
    goal: GoalDetailsResponse
    subitem: GoalDetailsSubitem | null
    onClose: () => void
}

interface WeightFormValues {
    weight: number
}

export function EditSubitemWeightModal({ goal, subitem, onClose }: EditSubitemWeightModalProps) {
    const { control, watch, reset } = useForm<WeightFormValues>({
        defaultValues: { weight: subitem?.subitemWeight ?? 5 },
    })

    const { mutate, isPending, error } = useUpdateGoalLink()

    useEffect(() => {
        if (subitem) {
            reset({ weight: subitem.subitemWeight })
        }
    }, [subitem, reset])

    const handleOpenChange = (open: boolean) => {
        if (!open && !isPending) onClose()
    }

    const handleConfirm = () => {
        if (!subitem) return
        mutate(
            {
                subitemId: subitem.id,
                goalId: goal.id,
                subitemWeight: watch("weight"),
            },
            {
                onSuccess: () => {
                    onClose()
                },
            },
        )
    }

    return (
        <Dialog open={subitem !== null} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        <Typography variant="h3">Editar peso</Typography>
                    </DialogTitle>
                </DialogHeader>
                <GoalItem goal={goal} showProgress={false} />
                {subitem && <GoalSubitemCard subitem={subitem} />}
                <WeightInput
                    name="weight"
                    control={control}
                    label="Peso"
                />
                {error && (
                    <Typography variant="p" className="text-xs text-destructive">
                        {error.message ?? "No se pudo actualizar el peso"}
                    </Typography>
                )}
                <DialogFooter className="mt-4">
                    <Button
                        type="button"
                        onClick={handleConfirm}
                        disabled={isPending}
                        isLoading={isPending}
                    >
                        Guardar
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
