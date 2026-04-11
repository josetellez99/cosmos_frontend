import { useSystemsSuspense } from '@/features/systems/hooks'
import { SystemsList } from '@/features/systems/components/systems-list'
import { systemsWithProgressRequest } from '@/features/systems/constants/requests/systems/system-with-progress'

export const SystemsSection = () => {
	const { systems } = useSystemsSuspense(systemsWithProgressRequest)
	return <SystemsList systems={systems} fallbackMessage="No tienes sistemas creados todavía." />
}
