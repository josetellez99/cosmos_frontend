import { useSystemsSuspense } from '@/features/systems/hooks'
import { SystemsList } from '@/features/systems/components/systems-list'

export const SystemsSection = () => {
	const { systems } = useSystemsSuspense()
	return <SystemsList systems={systems} fallbackMessage="No tienes sistemas creados todavía." />
}
