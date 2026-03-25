import { useState, useCallback } from 'react'
import { useGoalsSuspense } from '@/features/goals/hooks'
import { GoalsList } from '@/features/goals/components/goals-list'
import { GoalsTemporalityFilter } from '@/features/goals/components/goals-temporality-filter'
import { goalsPageDynamicFiltersReq } from '@/features/goals/constants/reqObjects'
import { goalTemporality, type GoalTemporalityType } from '@/lib/constants/goals_temporalities'
import type { GetUserGoalsRequest } from '@/features/goals/types/request/get-user-goals'

export const FilteredGoalsSection = () => {
  
  const [filters, setFilters] = useState<GetUserGoalsRequest>(goalsPageDynamicFiltersReq)

  const handleFilterChange = useCallback(
    (updated: Pick<GetUserGoalsRequest, 'temporality' | 'startDate' | 'endDate'>) => {
      setFilters(prev => ({ ...prev, ...updated }))
    }, []
  )

  const { goals } = useGoalsSuspense(filters)

  return (
    <>
      <div className="spacing-in-title-section">
        <GoalsTemporalityFilter
          value={(filters.temporality?.[0] ?? goalTemporality.SEMESTER) as GoalTemporalityType}
          onChange={handleFilterChange}
        />
      </div>
      <GoalsList goals={goals} fallbackMessage='Ups, no has creado ninguna meta por aquí todavía🎯.' />
    </>
  )
}
