import { useState } from "react"
import { Typography } from "@/components/ui/typography"
import { AddButton } from "@/components/ui/add-button"
import { Dialog, DialogContent, DialogHeader, DialogScrollArea, DialogTitle } from "@/components/ui/dialog"
import { AsyncErrorBoundary } from "@/components/async-boundary"
import { HabitItem } from "@/features/habits/components/habit-item"
import { HabitsListSkeleton } from "@/features/habits/components/loaders/habits-list-skeleton"
import { FallbackMessage } from "@/components/ui/messages/fallback-message"
import { useHabitsSuspense } from "@/features/habits/hooks/useHabitsSuspense"
import type { HabitSummaryResponse } from "@/features/habits/types/response/habits"

interface HabitSelectionListProps {
    excludeIds: Set<number>
    onHabitClick: (habit: HabitSummaryResponse) => void
}

function HabitSelectionList({ excludeIds, onHabitClick }: HabitSelectionListProps) {
    const { habits } = useHabitsSuspense()
    const filteredHabits = habits.filter(habit => !excludeIds.has(habit.id))

    if (filteredHabits.length === 0) {
        return <FallbackMessage>No se encontraron habitos</FallbackMessage>
    }

    return (
        <ul className="flex flex-col gap-2">
            {filteredHabits.map(habit => (
                <li key={habit.id}>
                    <HabitItem
                        habit={habit}
                        allowCheck={false}
                        isNested={false}
                        onClick={() => onHabitClick(habit)}
                    />
                </li>
            ))}
        </ul>
    )
}

interface HabitSelectionModalProps {
    excludeIds: Set<number>
    onHabitSelect: (habit: HabitSummaryResponse) => void
}

export function HabitSelectionModal({ excludeIds, onHabitSelect }: HabitSelectionModalProps) {
    const [isOpen, setIsOpen] = useState(false)

    const handleHabitClick = (habit: HabitSummaryResponse) => {
        onHabitSelect(habit)
        setIsOpen(false)
    }

    return (
        <>
            <AddButton text="Vincular habito" onClick={() => setIsOpen(true)} />

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            <Typography variant="h3">Vincular habito</Typography>
                        </DialogTitle>
                    </DialogHeader>
                    <DialogScrollArea>
                        <AsyncErrorBoundary loadingFallback={<HabitsListSkeleton />}>
                            <HabitSelectionList
                                excludeIds={excludeIds}
                                onHabitClick={handleHabitClick}
                            />
                        </AsyncErrorBoundary>
                    </DialogScrollArea>
                </DialogContent>
            </Dialog>
        </>
    )
}
