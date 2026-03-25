import type { GoalTemporalityType } from '@/lib/constants/goals_temporalities'
import { getYYYYMMDDformat } from '@/helpers/dates/get-YYYY-MM-DD-format'

/**
 * Returns the start and end dates (YYYY-MM-DD) for the given temporality,
 * relative to the current date.
 * Useful for the goals-temporality-filter component which is a select that returns on each onChange event
 * an object that is send as the req for the /goals GET endpoint
 *
 * @param temporality - The goal temporality type (e.g. 'year', 'month', 'week').
 * @returns An object with `startDate` and `endDate` strings in YYYY-MM-DD format.
 */

export const getTemporalityDateRange = (temporality: GoalTemporalityType): { startDate: string; endDate: string } => {
    const now = new Date()
    const year = now.getFullYear()
    const month = now.getMonth() // 0-indexed

    switch (temporality) {
        case 'year':
            return { startDate: `${year}-01-01`, endDate: `${year}-12-31` }

        case 'semester': {
            if (month < 6) {
                return { startDate: `${year}-01-01`, endDate: `${year}-06-30` }
            }
            return { startDate: `${year}-07-01`, endDate: `${year}-12-31` }
        }

        case 'quarter': {
            const quarter = Math.floor(month / 3)
            const starts = ['01-01', '04-01', '07-01', '10-01']
            const ends = ['03-31', '06-30', '09-30', '12-31']
            return { startDate: `${year}-${starts[quarter]}`, endDate: `${year}-${ends[quarter]}` }
        }

        case 'month': {
            const firstDay = new Date(year, month, 1)
            const lastDay = new Date(year, month + 1, 0)
            return { startDate: getYYYYMMDDformat(firstDay.toISOString()), endDate: getYYYYMMDDformat(lastDay.toISOString()) }
        }

        case 'week': {
            const dayOfWeek = now.getDay()
            const startOfWeek = new Date(now)
            startOfWeek.setDate(now.getDate() - dayOfWeek)
            const endOfWeek = new Date(now)
            endOfWeek.setDate(now.getDate() + (6 - dayOfWeek))
            return { startDate: getYYYYMMDDformat(startOfWeek.toISOString()), endDate: getYYYYMMDDformat(endOfWeek.toISOString()) }
        }

        case 'day':
            return { startDate: getYYYYMMDDformat(now.toISOString()), endDate: getYYYYMMDDformat(now.toISOString()) }

        case 'long_term':
        default:
            return { startDate: `${year}-01-01`, endDate: `${year}-12-31` }
    }
}