import { GoalsListSkeleton } from '@/components/ui/loaders/goals-list-skeleton'
import { InputSkeleton } from '@/components/ui/loaders/input-skeleton'

export const FilteredGoalsSectionSkeleton = () => (
  <>
    <div className="spacing-in-title-section">
      <InputSkeleton />
    </div>
    <GoalsListSkeleton count={3} />
  </>
)
