import { useState, useCallback } from 'react'
import { Clock, CircleDot } from 'lucide-react'
import { useGoalsSuspense } from '@/features/goals/hooks'
import { GoalsList } from '@/features/goals/components/goals-list'
import { FilterContainer, FilterItem, FilterOptionList } from '@/components/filters'
import { AsyncErrorBoundary } from '@/components/async-boundary'
import { GoalsListSkeleton } from '@/features/goals/components/loaders/goals-list-skeleton'
import { goalsPageDynamicFiltersReq } from '@/features/goals/constants/reqObjects'
import { TEMPORALITY_FILTER_OPTIONS, type GoalTemporalityType } from '@/lib/constants/goals_temporalities'
import { GOAL_STATUS_FILTER_OPTIONS, type GoalStatusType } from '@/lib/constants/goals_status'
import { getTemporalityDateRange } from '@/features/goals/helpers/temporalityDateRange'
import type { GetUserGoalsRequest } from '@/features/goals/types/request/get-user-goals'

const DashboardGoalsList = ({ filters }: { filters: GetUserGoalsRequest }) => {
  const { goals } = useGoalsSuspense(filters)
  return <GoalsList goals={goals} fallbackMessage='Ups, no has creado ninguna meta por aquí todavía🎯.' />
}

export const GoalsSectionDashboard = () => {

  const [filters, setFilters] = useState<GetUserGoalsRequest>(goalsPageDynamicFiltersReq)

  const handleTemporalitySelect = useCallback((val: string) => {
    const temporality = val as GoalTemporalityType
    setFilters(prev => ({
      ...prev,
      temporality: [temporality],
      ...getTemporalityDateRange(temporality),
    }))
  }, [])

  const handleTemporalityClear = useCallback(() => {
    setFilters(prev => ({
      ...prev,
      temporality: undefined,
      startDate: undefined,
      endDate: undefined,
    }))
  }, [])

  const handleStatusSelect = useCallback((val: string) => {
    setFilters(prev => ({ ...prev, status: [val as GoalStatusType] }))
  }, [])

  const handleStatusClear = useCallback(() => {
    setFilters(prev => ({ ...prev, status: undefined }))
  }, [])

  const handleClearAll = useCallback(() => {
    setFilters(goalsPageDynamicFiltersReq)
  }, [])

  const isTemporalityActive = !!filters.temporality?.length
  const isStatusActive = filters.status?.length === 1

  return (
    <>
      <div className="spacing-in-title-section flex justify-end">
        <FilterContainer onClearAll={handleClearAll}>
          <FilterItem id="temporality" icon={Clock} label="Temporalidad" isActive={isTemporalityActive}>
            <FilterOptionList
              options={TEMPORALITY_FILTER_OPTIONS}
              value={filters.temporality?.[0]}
              onSelect={handleTemporalitySelect}
              onClear={handleTemporalityClear}
            />
          </FilterItem>
          <FilterItem id="status" icon={CircleDot} label="Estatus" isActive={isStatusActive}>
            <FilterOptionList
              options={GOAL_STATUS_FILTER_OPTIONS}
              value={filters.status?.length === 1 ? filters.status[0] : undefined}
              onSelect={handleStatusSelect}
              onClear={handleStatusClear}
            />
          </FilterItem>
        </FilterContainer>
      </div>
      <AsyncErrorBoundary loadingFallback={<GoalsListSkeleton />}>
        <DashboardGoalsList filters={filters} />
      </AsyncErrorBoundary>
    </>
  )
}
