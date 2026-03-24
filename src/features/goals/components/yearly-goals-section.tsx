import { useGoalsSuspense } from '@/features/goals/hooks'
import { GoalsList } from '@/features/goals/components/goals-list'
import { defaultYearlyGoalReq } from '@/features/goals/constants/reqObjects'

export const YearlyGoalsSection = () => {
  const { goals } = useGoalsSuspense(defaultYearlyGoalReq)
  return <GoalsList goals={goals} fallbackMessage='Ups, no has creado ninguna meta por aquí todavía🎯.' />
}
