import { Typography } from '@/components/ui/typography'
import { AsyncErrorBoundary } from '@/components/async-boundary'
import { GoalsSectionDashboard } from '@/features/dashboard/components/goals-section-dashboard'
import { HabitsVsTasksSection } from '@/features/dashboard/components/habits-vs-tasks-section'
import { FilteredGoalsSectionSkeleton } from '@/features/goals/components/loaders/filtered-goals-section-skeleton'

export const DashboardPage = () => (
    <>
        <section className='spacing-in-sections'>
            <div className='spacing-in-title-section'>
                <Typography variant='h3'>Tus metas</Typography>
            </div>
            <AsyncErrorBoundary loadingFallback={<FilteredGoalsSectionSkeleton />}>
                <GoalsSectionDashboard />
            </AsyncErrorBoundary>
        </section>

        <section>
            <HabitsVsTasksSection />
        </section>
    </>
)
