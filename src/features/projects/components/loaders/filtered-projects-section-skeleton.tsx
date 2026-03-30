import { ProjectsListSkeleton } from '@/features/projects/components/loaders/projects-list-skeleton'

export const FilteredProjectsSectionSkeleton = () => (
  <>
    <div className="spacing-in-title-section flex justify-end">
      <div className="h-8 w-24 rounded-md bg-gray-200 animate-pulse" />
    </div>
    <ProjectsListSkeleton count={3} />
  </>
)
