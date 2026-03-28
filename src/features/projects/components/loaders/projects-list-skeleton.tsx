import { ProjectItemSkeleton } from '@/features/projects/components/loaders/project-item-skeleton'

interface ProjectsListSkeletonProps {
  count?: number
}

export const ProjectsListSkeleton = ({ count = 3 }: ProjectsListSkeletonProps) => (
  <ul className="flex flex-col spacing-in-list-elements">
    {Array.from({ length: count }).map((_, i) => (
      <li key={i}>
        <ProjectItemSkeleton />
      </li>
    ))}
  </ul>
)
