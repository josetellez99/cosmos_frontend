import { useEffect } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { WeightInput } from "@/components/ui/weight-input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogTitle } from "@/components/ui/dialog"
import { SystemItem } from "@/features/systems/components/system-item"
import { HabitItem } from "@/features/habits/components/habit-item"
import { SubitemWeightTag } from "@/features/goals/components/form/subitem-weight-tag"
import { useUpdateHabitSystem } from "@/features/habitSystem/hooks/useUpdateHabitSystem"
import type { SystemDetailHabit, SystemDetailResponse } from "@/features/systems/types/response/system-detail"
import type { HabitSummaryResponse } from "@/features/habits/types/response/habits"

interface EditHabitSystemWeightModalProps {
    system: SystemDetailResponse
    habit: SystemDetailHabit | null
    onClose: () => void
}

interface WeightFormValues {
    weight: number
}

export function EditHabitSystemWeightModal({ system, habit, onClose }: EditHabitSystemWeightModalProps) {
    const { control, watch, reset } = useForm<WeightFormValues>({
        defaultValues: { weight: habit?.habitWeight ?? 5 },
    })

    const { mutate, isPending, error } = useUpdateHabitSystem()

    useEffect(() => {
        if (habit) {
            reset({ weight: habit.habitWeight })
        }
    }, [habit, reset])

    const handleOpenChange = (open: boolean) => {
        if (!open && !isPending) onClose()
    }

    const handleConfirm = () => {
        if (!habit) return
        mutate(
            {
                habitSystemId: habit.habitSystemId,
                systemId: system.id,
                habitWeight: watch("weight"),
            },
            {
                onSuccess: () => {
                    onClose()
                },
            },
        )
    }

    const habitSummary: HabitSummaryResponse | null = habit
        ? {
            id: habit.id,
            name: habit.name,
            emoji: habit.emoji,
            scheduleType: habit.scheduleType as HabitSummaryResponse["scheduleType"],
            scheduleConfig: JSON.stringify(habit.scheduleConfig),
            starting_date: "",
            description: "",
            progress: habit.progress,
        }
        : null

    return (
        <Dialog open={habit !== null} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-md">
                <DialogHeader>
                    <DialogTitle>
                        <Typography variant="h3">Editar peso</Typography>
                    </DialogTitle>
                </DialogHeader>
                <SystemItem system={{
                    id: system.id,
                    name: system.name,
                    symbol: system.symbol,
                    startingDate: system.startingDate as any, // eslint-disable-line @typescript-eslint/no-explicit-any -- plain string from detail response
                    createdAt: null,
                    modifiedAt: null,
                    description: null,
                    progress: system.progress,
                }}>
                    {null}
                </SystemItem>
                {habit && habitSummary && (
                    <div className="relative">
                        <SubitemWeightTag weight={habit.habitWeight} />
                        <HabitItem
                            habit={habitSummary}
                            allowCheck={false}
                            isNested={false}
                        />
                    </div>
                )}
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
