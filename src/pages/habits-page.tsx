import { Typography } from '@/components/ui/typography'
import { HabitsSection } from '@/features/habits/components/habits-section'
import { HabitsListSkeleton } from '@/features/habits/components/loaders/habits-list-skeleton'
import { AsyncErrorBoundary } from '@/components/async-boundary'

export const HabitsPage = () => (
    <section className='spacing-in-sections'>
        <div className='spacing-in-title-section'>
            <Typography variant='h3'>Tus hábitos</Typography>
        </div>
        <AsyncErrorBoundary loadingFallback={<HabitsListSkeleton />}>
            <HabitsSection />
        </AsyncErrorBoundary>
    </section>
)
