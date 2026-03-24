import { Suspense } from 'react'
import { SidebarLayout } from '@/components/layouts/sidebar-layout/sidebar-layout'
import { Typography } from '@/components/ui/typography'
import { YearlyGoalsSection } from '@/features/goals/components/yearly-goals-section'
import { FilteredGoalsSection } from '@/features/goals/components/filtered-goals-section'
import { GoalsListSkeleton } from '@/components/ui/loaders/goals-list-skeleton'
import { FilteredGoalsSectionSkeleton } from '@/features/goals/components/loaders/filtered-goals-section-skeleton'

export const GoalsPage = () => (
    <SidebarLayout>
        <div className='spacing-in-sections'>
            <div className='spacing-in-title-section'>
                <Typography variant='h3'>Metas anuales</Typography>
            </div>
            <Suspense fallback={<GoalsListSkeleton />}>
                <YearlyGoalsSection />
            </Suspense>
        </div>

        <div>
            <div className='spacing-in-title-section'>
                <Typography variant='h3'>Todas tus metas</Typography>
            </div>
            <Suspense fallback={<FilteredGoalsSectionSkeleton />}>
                <FilteredGoalsSection />
            </Suspense>
        </div>
    </SidebarLayout>
)
