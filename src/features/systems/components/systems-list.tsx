import { useNavigate } from "react-router"
import { SystemItem } from "@/features/systems/components/system-item"
import type { SystemSummaryResponse } from "@/features/systems/types/response/system-summary"
import { FallbackMessage } from "@/components/ui/messages/fallback-message"

interface props {
	systems: SystemSummaryResponse[]
	fallbackMessage: string
}

export const SystemsList = ({ systems, fallbackMessage }: props) => {
	const navigate = useNavigate()

	if (systems.length === 0) {
		return (
			<div>
				<FallbackMessage>{fallbackMessage}</FallbackMessage>
			</div>
		)
	}

	return (
		<ul className="flex flex-col spacing-in-list-elements">
			{systems.map((system) => (
				<li key={system.id}>
					<SystemItem
						system={system}
						onClick={() => navigate(`/sistemas/${system.id}`)}
					/>
				</li>
			))}
		</ul>
	)
}
