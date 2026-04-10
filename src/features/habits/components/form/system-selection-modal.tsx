import { useState } from "react"
import { Typography } from "@/components/ui/typography"
import { AddButton } from "@/components/ui/add-button"
import { Dialog, DialogContent, DialogHeader, DialogScrollArea, DialogTitle } from "@/components/ui/dialog"
import { AsyncErrorBoundary } from "@/components/async-boundary"
import { SystemItem } from "@/features/systems/components/system-item"
import { SystemsListSkeleton } from "@/features/systems/components/loaders/systems-list-skeleton"
import { FallbackMessage } from "@/components/ui/messages/fallback-message"
import { useSystemsSuspense } from "@/features/systems/hooks"
import type { SystemSummaryResponse } from "@/features/systems/types/response/system-summary"

interface SystemSelectionListProps {
    excludeIds: Set<number>
    onSystemClick: (system: SystemSummaryResponse) => void
}

function SystemSelectionList({ excludeIds, onSystemClick }: SystemSelectionListProps) {
    const { systems } = useSystemsSuspense()
    const filteredSystems = systems.filter(system => !excludeIds.has(system.id))

    if (filteredSystems.length === 0) {
        return <FallbackMessage>No se encontraron sistemas</FallbackMessage>
    }

    return (
        <ul className="flex flex-col gap-2">
            {filteredSystems.map(system => (
                <li key={system.id}>
                    <button
                        type="button"
                        onClick={() => onSystemClick(system)}
                        className="w-full text-left cursor-pointer"
                    >
                        <SystemItem system={system}>
                            {null}
                        </SystemItem>
                    </button>
                </li>
            ))}
        </ul>
    )
}

interface SystemSelectionModalProps {
    excludeIds: Set<number>
    onSystemSelect: (system: SystemSummaryResponse) => void
}

export function SystemSelectionModal({ excludeIds, onSystemSelect }: SystemSelectionModalProps) {
    const [isOpen, setIsOpen] = useState(false)

    const handleSystemClick = (system: SystemSummaryResponse) => {
        onSystemSelect(system)
        setIsOpen(false)
    }

    return (
        <>
            <AddButton text="Vincular sistema" onClick={() => setIsOpen(true)} />

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            <Typography variant="h3">Vincular sistema</Typography>
                        </DialogTitle>
                    </DialogHeader>
                    <DialogScrollArea>
                        <AsyncErrorBoundary loadingFallback={<SystemsListSkeleton />}>
                            <SystemSelectionList
                                excludeIds={excludeIds}
                                onSystemClick={handleSystemClick}
                            />
                        </AsyncErrorBoundary>
                    </DialogScrollArea>
                </DialogContent>
            </Dialog>
        </>
    )
}
