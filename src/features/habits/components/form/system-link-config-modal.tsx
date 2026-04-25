import { useEffect, useState } from "react"
import { useForm } from "react-hook-form"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { WeightInput } from "@/components/ui/weight-input"
import { Dialog, DialogContent, DialogFooter, DialogHeader, DialogScrollArea, DialogTitle } from "@/components/ui/dialog"
import { AsyncErrorBoundary } from "@/components/async-boundary"
import { SystemItem } from "@/features/systems/components/system-item"
import { HabitItem } from "@/features/habits/components/habit-item"
import { SubitemWeightTag } from "@/features/goals/components/form/subitem-weight-tag"
import { SystemsListSkeleton } from "@/features/systems/components/loaders/systems-list-skeleton"
import { useSystemDetailSuspense } from "@/features/systems/hooks"
import { EditHabitSystemWeightModal } from "@/features/habits/components/form/edit-habit-system-weight-modal"
import type { HabitSummaryResponse } from "@/features/habits/types/response/habits"
import type { SystemDetailHabit } from "@/features/systems/types/response/system-detail"

interface SystemLinkConfigModalProps {
    systemId: number | null
    isEditing: boolean
    existingWeight?: number
    onClose: () => void
    onConfirm: (weight: number, habitOrder: number) => void
}

interface WeightFormValues {
    weight: number
}

interface SystemLinkConfigBodyProps {
    systemId: number
    isEditing: boolean
    existingWeight?: number
    onConfirm: (weight: number, habitOrder: number) => void
}

function SystemLinkConfigBody({ systemId, isEditing, existingWeight, onConfirm }: SystemLinkConfigBodyProps) {
    const { system } = useSystemDetailSuspense(systemId)

    const initialWeight = existingWeight ?? 5

    const { control, watch, reset } = useForm<WeightFormValues>({
        defaultValues: { weight: initialWeight },
    })

    useEffect(() => {
        reset({ weight: initialWeight })
    }, [initialWeight, reset])

    const [editingHabit, setEditingHabit] = useState<SystemDetailHabit | null>(null)

    const handleConfirm = () => {
        onConfirm(watch("weight"), system.habits.length + 1)
    }

    const existingHabits: HabitSummaryResponse[] = system.habits.map(h => ({
        id: h.id,
        name: h.name,
        emoji: h.emoji,
        scheduleType: h.scheduleType as HabitSummaryResponse["scheduleType"],
        scheduleConfig: JSON.stringify(h.scheduleConfig),
        starting_date: "",
        description: "",
        progress: h.progress,
    }))

    return (
        <>
            <DialogScrollArea>
                <div className="flex flex-col gap-4">
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

                    {existingHabits.length > 0 && (
                        <div className="flex flex-col gap-2">
                            <Typography variant="p" className="text-xs text-medium-gray">
                                Habitos vinculados
                            </Typography>
                            <div className="flex flex-col gap-2 pt-2">
                                {existingHabits.map((habit) => {
                                    const rawHabit = system.habits.find(h => h.id === habit.id)
                                    return (
                                        <div key={habit.id} className="relative">
                                            <SubitemWeightTag weight={rawHabit?.habitWeight ?? 0} />
                                            <HabitItem
                                                habit={habit}
                                                allowCheck={false}
                                                isNested={false}
                                                onClick={rawHabit ? () => setEditingHabit(rawHabit) : undefined}
                                            />
                                        </div>
                                    )
                                })}
                            </div>
                        </div>
                    )}

                    <div className="flex flex-col gap-2">
                        <Typography variant="p" className="text-xs text-medium-gray">
                            Nuevo habito
                        </Typography>
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

            <EditHabitSystemWeightModal
                system={system}
                habit={editingHabit}
                onClose={() => setEditingHabit(null)}
            />
        </>
    )
}

export function SystemLinkConfigModal({
    systemId,
    isEditing,
    existingWeight,
    onClose,
    onConfirm,
}: SystemLinkConfigModalProps) {
    const handleOpenChange = (open: boolean) => {
        if (!open) onClose()
    }

    return (
        <Dialog open={systemId !== null} onOpenChange={handleOpenChange}>
            <DialogContent className="sm:max-w-lg">
                <DialogHeader>
                    <DialogTitle>
                        <Typography variant="h3">
                            {isEditing ? "Editar vinculacion" : "Configurar vinculacion"}
                        </Typography>
                    </DialogTitle>
                </DialogHeader>
                {systemId !== null && (
                    <AsyncErrorBoundary loadingFallback={<SystemsListSkeleton />}>
                        <SystemLinkConfigBody
                            systemId={systemId}
                            isEditing={isEditing}
                            existingWeight={existingWeight}
                            onConfirm={onConfirm}
                        />
                    </AsyncErrorBoundary>
                )}
            </DialogContent>
        </Dialog>
    )
}
