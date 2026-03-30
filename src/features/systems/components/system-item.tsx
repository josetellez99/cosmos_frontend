import { Typography } from "@/components/ui/typography"
import type { SystemSummaryResponse } from "@/features/systems/types/response/system-summary"

interface props {
	system: SystemSummaryResponse
}

export const SystemItem = ({ system }: props) => {
	return (
		<div className="p-4 default-card-rounded bg-white border border-gray-200">
			<Typography className="font-semibold text-xs">
				{system.name}
			</Typography>
		</div>
	)
}
