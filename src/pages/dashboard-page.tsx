import { Typography } from '@/components/ui/typography'
import { AsyncErrorBoundary } from '@/components/async-boundary'
import { GoalsSectionDashboard } from '@/features/dashboard/components/goals-section-dashboard'
import { HabitsVsTasksSection } from '@/features/dashboard/components/habits-vs-tasks-section'
import { FilteredGoalsSectionSkeleton } from '@/features/goals/components/loaders/filtered-goals-section-skeleton'
import { DatePicker } from '@/components/ui/date-picker'
import { useUiContext } from '@/hooks/useUiContext'
import { formatDateForApi } from '@/features/habits/helpers/format-date-for-api'

export const DashboardPage = () => {
    const { dashboardDate, setDashboardDate } = useUiContext()
    const selectedDate = new Date(dashboardDate + 'T00:00:00')

    return (
    <>
        <section className='spacing-in-sections'>
            <div className='spacing-in-title-section flex items-center justify-between'>
                <Typography variant='h3'>Tus metas</Typography>
                <DatePicker
                    value={selectedDate}
                    onChange={(date) => { if (date) setDashboardDate(formatDateForApi(date)) }}
                />
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
}
