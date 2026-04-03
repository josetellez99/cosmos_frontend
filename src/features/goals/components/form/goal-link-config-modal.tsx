import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { WeightInput } from "@/components/ui/weight-input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { GoalItem } from "@/features/goals/components/goal-item"
import type { GoalSummaryResponse } from "@/features/goals/types/response/user-goals"

export interface GoalLinkConfig {
    goal: GoalSummaryResponse
    weight: number
    isEditing: boolean
}

interface GoalLinkConfigModalProps {
    config: GoalLinkConfig | null
    onClose: () => void
    onConfirm: (weight: number) => void
}

interface WeightFormValues {
    weight: number
}

export function GoalLinkConfigModal({ config, onClose, onConfirm }: GoalLinkConfigModalProps) {
    const { control, watch, reset } = useForm<WeightFormValues>({
        defaultValues: { weight: config?.weight ?? 5 },
    })

    useEffect(() => {
        if (config) {
            reset({ weight: config.weight })
        }
    }, [config, reset])

    const handleOpenChange = (open: boolean) => {
        if (!open) onClose()
    }

    const handleConfirm = () => {
        onConfirm(watch("weight"))
    }

    return (
        <Dialog open={config !== null} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        <Typography variant="h3">
                            {config?.isEditing ? "Editar vinculación" : "Configurar vinculación"}
                        </Typography>
                    </DialogTitle>
                </DialogHeader>
                {config?.goal && (
                    <GoalItem goal={config.goal} showProgress={false} />
                )}
                <WeightInput
                    name="weight"
                    control={control}
                    label="Peso"
                />
                <DialogFooter className="mt-4">
                    <Button type="button" onClick={handleConfirm}>
                        {config?.isEditing ? "Guardar" : "Vincular"}
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    )
}
