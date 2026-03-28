import { ProjectsListSkeleton } from '@/features/projects/components/loaders/projects-list-skeleton'
import { InputSkeleton } from '@/components/ui/loaders/input-skeleton'

export const FilteredProjectsSectionSkeleton = () => (
  <>
    <div className="spacing-in-title-section flex gap-4">
      <InputSkeleton />
      <InputSkeleton />
    </div>
    <ProjectsListSkeleton count={3} />
  </>
)
