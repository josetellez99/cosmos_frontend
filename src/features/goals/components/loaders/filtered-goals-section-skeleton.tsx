import { GoalsListSkeleton } from '@/features/goals/components/loaders/goals-list-skeleton'

export const FilteredGoalsSectionSkeleton = () => (
  <>
    <div className="spacing-in-title-section flex justify-end">
      <div className="h-8 w-24 rounded-md bg-gray-200 animate-pulse" />
    </div>
    <GoalsListSkeleton count={3} />
  </>
)
