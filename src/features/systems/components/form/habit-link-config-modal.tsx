import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { WeightInput } from "@/components/ui/weight-input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogScrollArea, DialogTitle } from "@/components/ui/dialog"
import { HabitItem } from "@/features/habits/components/habit-item"
import type { HabitSummaryResponse } from "@/features/habits/types/response/habits"

interface HabitLinkConfigModalProps {
    habit: HabitSummaryResponse | null
    isEditing: boolean
    existingWeight?: number
    nextOrder: number
    onClose: () => void
    onConfirm: (weight: number, habitOrder: number) => void
}

interface WeightFormValues {
    weight: number
}

export function HabitLinkConfigModal({
    habit,
    isEditing,
    existingWeight,
    nextOrder,
    onClose,
    onConfirm,
}: HabitLinkConfigModalProps) {
    const initialWeight = existingWeight ?? 5

    const { control, watch, reset } = useForm<WeightFormValues>({
        defaultValues: { weight: initialWeight },
    })

    useEffect(() => {
        reset({ weight: initialWeight })
    }, [initialWeight, reset])

    const handleOpenChange = (open: boolean) => {
        if (!open) onClose()
    }

    const handleConfirm = () => {
        onConfirm(watch("weight"), nextOrder)
    }

    return (
        <Dialog open={habit !== null} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        <Typography variant="h3">
                            {isEditing ? "Editar vinculacion" : "Configurar vinculacion"}
                        </Typography>
                    </DialogTitle>
                </DialogHeader>
                {habit !== null && (
                    <>
                        <DialogScrollArea>
                            <div className="flex flex-col gap-4">
                                <HabitItem
                                    habit={habit}
                                    allowCheck={false}
                                    isNested={false}
                                />
                                <WeightInput
                                    name="weight"
                                    control={control}
                                    label="Peso"
                                />
                            </div>
                        </DialogScrollArea>
                        <DialogFooter className="mt-4">
                            <Button type="button" onClick={handleConfirm}>
                                {isEditing ? "Guardar" : "Vincular"}
                            </Button>
                        </DialogFooter>
                    </>
                )}
            </DialogContent>
        </Dialog>
    )
}
