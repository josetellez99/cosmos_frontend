import { SidebarLayout } from '@/components/layouts/sidebar-layout/sidebar-layout'
import { Typography } from '@/components/ui/typography'
import { YearlyGoalsSection } from '@/features/goals/components/yearly-goals-section'
import { FilteredGoalsSection } from '@/features/goals/components/filtered-goals-section'
import { GoalsListSkeleton } from '@/features/goals/components/loaders/goals-list-skeleton'
import { FilteredGoalsSectionSkeleton } from '@/features/goals/components/loaders/filtered-goals-section-skeleton'
import { AsyncErrorBoundary } from '@/components/async-boundary'

export const GoalsPage = () => (
    <SidebarLayout>
        <section className='spacing-in-sections'>
            <div className='spacing-in-title-section'>
                <Typography variant='h3'>Metas anuales</Typography>
            </div>
            <AsyncErrorBoundary loadingFallback={<GoalsListSkeleton />}>
                <YearlyGoalsSection />
            </AsyncErrorBoundary>
        </section>

        <section>
            <div className='spacing-in-title-section'>
                <Typography variant='h3'>Todas tus metas</Typography>
            </div>
            <AsyncErrorBoundary loadingFallback={<FilteredGoalsSectionSkeleton />}>
                <FilteredGoalsSection />
            </AsyncErrorBoundary>
        </section>
    </SidebarLayout>
)
