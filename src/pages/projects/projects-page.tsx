import { Typography } from '@/components/ui/typography'
import { FilteredProjectsSection } from '@/features/projects/components/filtered-projects-section'
import { FilteredProjectsSectionSkeleton } from '@/features/projects/components/loaders/filtered-projects-section-skeleton'
import { AsyncErrorBoundary } from '@/components/async-boundary'

export const ProjectsPage = () => (
    <section>
        <div className='spacing-in-title-section'>
            <Typography variant='h3'>Proyectos</Typography>
        </div>
        <AsyncErrorBoundary loadingFallback={<FilteredProjectsSectionSkeleton />}>
            <FilteredProjectsSection />
        </AsyncErrorBoundary>
    </section>
)
