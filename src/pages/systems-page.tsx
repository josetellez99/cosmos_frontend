import { Typography } from '@/components/ui/typography'
import { SystemsSection } from '@/features/systems/components/systems-section'
import { SystemsListSkeleton } from '@/features/systems/components/loaders/systems-list-skeleton'
import { AsyncErrorBoundary } from '@/components/async-boundary'

export const SystemsPage = () => (
	<section className='spacing-in-sections'>
		<div className='spacing-in-title-section'>
			<Typography variant='h3'>Sistemas</Typography>
		</div>
		<AsyncErrorBoundary loadingFallback={<SystemsListSkeleton />}>
			<SystemsSection />
		</AsyncErrorBoundary>
	</section>
)
