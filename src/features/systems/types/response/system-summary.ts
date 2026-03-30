import type { ISODateString, ISOTimestampString } from "@/types/dates"

export interface SystemSummaryResponse {
	id: number
	name: string
	description: string | null
	symbol: string | null
	startingDate: ISODateString
	createdAt: ISOTimestampString | null
	modifiedAt: ISOTimestampString | null
	progress: number
}
