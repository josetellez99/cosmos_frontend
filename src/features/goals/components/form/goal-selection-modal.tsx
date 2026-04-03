import { useState, useCallback } from "react"
import { Clock } from "lucide-react"
import { Typography } from "@/components/ui/typography"
import { AddButton } from "@/components/ui/add-button"
import { Dialog, DialogContent, DialogHeader, DialogScrollArea, DialogTitle } from "@/components/ui/dialog"
import { AsyncErrorBoundary } from "@/components/async-boundary"
import { FilterContainer, FilterItem, FilterOptionList } from "@/components/filters"
import { GoalItem } from "@/features/goals/components/goal-item"
import { GoalsListSkeleton } from "@/features/goals/components/loaders/goals-list-skeleton"
import { FallbackMessage } from "@/components/ui/messages/fallback-message"
import { useGoalsSuspense } from "@/features/goals/hooks/useGoalsSuspense"
import { getTemporalityDateRange } from "@/features/goals/helpers/temporalityDateRange"
import { defaultYearlyGoalReq } from "@/features/goals/constants/reqObjects"
import { TEMPORALITY_FILTER_OPTIONS, type GoalTemporalityType } from "@/lib/constants/goals_temporalities"
import type { GetUserGoalsRequest } from "@/features/goals/types/request/get-user-goals"
import type { GoalSummaryResponse } from "@/features/goals/types/response/user-goals"

interface GoalSelectionListProps {
    filters: GetUserGoalsRequest
    excludeIds: Set<number>
    onGoalClick: (goal: GoalSummaryResponse) => void
}

function GoalSelectionList({ filters, excludeIds, onGoalClick }: GoalSelectionListProps) {
    const { goals } = useGoalsSuspense(filters)
    const filteredGoals = goals.filter(goal => !excludeIds.has(goal.id))

    if (filteredGoals.length === 0) {
        return <FallbackMessage>No se encontraron metas</FallbackMessage>
    }

    return (
        <ul className="flex flex-col gap-2">
            {filteredGoals.map(goal => (
                <li key={goal.id}>
                    <GoalItem
                        goal={goal}
                        showProgress
                        onClick={() => onGoalClick(goal)}
                    />
                </li>
            ))}
        </ul>
    )
}

interface GoalSelectionModalProps {
    excludeIds: Set<number>
    onGoalSelect: (goal: GoalSummaryResponse) => void
}

export function GoalSelectionModal({ excludeIds, onGoalSelect }: GoalSelectionModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [filters, setFilters] = useState<GetUserGoalsRequest>(defaultYearlyGoalReq)

    const handleTemporalitySelect = useCallback((value: string) => {
        const { startDate, endDate } = getTemporalityDateRange(value as GoalTemporalityType)
        setFilters(prev => ({ ...prev, temporality: [value as GoalTemporalityType], startDate, endDate }))
    }, [])

    const handleTemporalityClear = useCallback(() => {
        setFilters(prev => {
            const { temporality: _t, startDate: _s, endDate: _e, ...rest } = prev
            return rest
        })
    }, [])

    const handleClearAll = useCallback(() => {
        setFilters(defaultYearlyGoalReq)
    }, [])

    const isTemporalityActive = filters.temporality !== undefined && filters.temporality.length > 0

    return (
        <>
            <AddButton text="Vincular meta" onClick={() => setIsOpen(true)} />

            <Dialog open={isOpen} onOpenChange={setIsOpen}>
                <DialogContent className="max-w-2xl">
                    <DialogHeader>
                        <DialogTitle>
                            <Typography variant="h3">Vincular meta</Typography>
                        </DialogTitle>
                    </DialogHeader>
                    <div className="flex justify-end">
                        <FilterContainer onClearAll={handleClearAll}>
                            <FilterItem
                                id="temporality"
                                icon={Clock}
                                label="Temporalidad"
                                isActive={isTemporalityActive}
                            >
                                <FilterOptionList
                                    options={TEMPORALITY_FILTER_OPTIONS}
                                    value={filters.temporality?.[0] ?? undefined}
                                    onSelect={handleTemporalitySelect}
                                    onClear={handleTemporalityClear}
                                />
                            </FilterItem>
                        </FilterContainer>
                    </div>
                    <DialogScrollArea>
                        <AsyncErrorBoundary loadingFallback={<GoalsListSkeleton />}>
                            <GoalSelectionList
                                filters={filters}
                                excludeIds={excludeIds}
                                onGoalClick={onGoalSelect}
                            />
                        </AsyncErrorBoundary>
                    </DialogScrollArea>
                </DialogContent>
            </Dialog>
        </>
    )
}
