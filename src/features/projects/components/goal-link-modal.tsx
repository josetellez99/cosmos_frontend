import { useState, useCallback } from "react"
import { Clock, Trash2 } from "lucide-react"
import { useQuery } from "@tanstack/react-query"
import { Button } from "@/components/ui/button"
import { Typography } from "@/components/ui/typography"
import { AddButton } from "@/components/ui/add-button"
import { Dialog, DialogContent, DialogHeader, DialogScrollArea, DialogTitle } from "@/components/ui/dialog"
import { FilterContainer, FilterItem, FilterOptionList } from "@/components/filters"
import { GoalsListSkeleton } from "@/features/goals/components/loaders/goals-list-skeleton"
import { goalQueryKeys } from "@/features/goals/helpers/queryKeys"
import { getUserGoalsService } from "@/features/goals/services/get-goals-service"
import { getTemporalityDateRange } from "@/features/goals/helpers/temporalityDateRange"
import { goalLinkProjectSchema } from "@/features/goals/schemas/goal-link-project-schema"
import { DEFAULT_STALE_TIME } from "@/lib/constants/global_constants"
import { TEMPORALITY_FILTER_OPTIONS, type GoalTemporalityType } from "@/lib/constants/goals_temporalities"
import type { GetUserGoalsRequest } from "@/features/goals/types/request/get-user-goals"
import type { GoalSummaryResponse } from "@/features/goals/types/response/user-goals"
import { z } from "zod"

type GoalLinkValues = z.infer<typeof goalLinkProjectSchema>

interface GoalLinkModalProps {
    goalLinks: GoalLinkValues[]
    onAdd: (data: GoalLinkValues) => void
    onRemove: (index: number) => void
}

const defaultFilters: GetUserGoalsRequest = {}

export function GoalLinkModal({ goalLinks, onAdd, onRemove }: GoalLinkModalProps) {
    const [isOpen, setIsOpen] = useState(false)
    const [filters, setFilters] = useState<GetUserGoalsRequest>(defaultFilters)

    const { data, isLoading } = useQuery({
        queryKey: goalQueryKeys.list(filters),
        queryFn: () => getUserGoalsService(filters),
        staleTime: DEFAULT_STALE_TIME,
        enabled: isOpen,
    })

    const goals: GoalSummaryResponse[] = data?.ok ? data.data : []

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
        setFilters(defaultFilters)
    }, [])

    const handleGoalClick = (goal: GoalSummaryResponse) => {
        console.log(goal)
        onAdd({
            goalId: goal.id,
            subitemOrder: goalLinks.length,
            subitemWeight: 1,
        })
    }

    const isTemporalityActive = filters.temporality !== undefined && filters.temporality.length > 0

    return (
        <div className="flex flex-col gap-2">
            {goalLinks.length > 0 && (
                <ul className="flex flex-col gap-2">
                    {goalLinks.map((link, index) => (
                        <li key={index} className="default-card-rounded default-card-padding bg-white border border-soft-gray flex items-center justify-between gap-2">
                            <Typography variant="p">Meta #{link.goalId}</Typography>
                            <Button
                                type="button"
                                variant="ghost"
                                size="icon-xs"
                                onClick={() => onRemove(index)}
                            >
                                <Trash2 />
                            </Button>
                        </li>
                    ))}
                </ul>
            )}
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
                        {isLoading ? (
                            <GoalsListSkeleton />
                        ) : (
                            <ul className="flex flex-col gap-2">
                                {goals.length === 0 ? (
                                    <li>
                                        <Typography variant="p" className="text-medium-gray text-center py-4">
                                            No se encontraron metas
                                        </Typography>
                                    </li>
                                ) : (
                                    goals.map(goal => (
                                        <li key={goal.id}>
                                            <button
                                                type="button"
                                                onClick={() => handleGoalClick(goal)}
                                                className="w-full text-left default-card-rounded default-card-padding border border-soft-gray hover:border-primary hover:bg-primary/5 default-animation cursor-pointer"
                                            >
                                                <Typography variant="p">{goal.name}</Typography>
                                            </button>
                                        </li>
                                    ))
                                )}
                            </ul>
                        )}
                    </DialogScrollArea>
                </DialogContent>
            </Dialog>
        </div>
    )
}
