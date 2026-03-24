import type { GoalTemporalityType } from '@/lib/constants/temporality'

const formatDate = (date: Date): string => {
    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')
    return `${year}-${month}-${day}`
}

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
            return { startDate: formatDate(firstDay), endDate: formatDate(lastDay) }
        }

        case 'week': {
            const dayOfWeek = now.getDay()
            const startOfWeek = new Date(now)
            startOfWeek.setDate(now.getDate() - dayOfWeek)
            const endOfWeek = new Date(now)
            endOfWeek.setDate(now.getDate() + (6 - dayOfWeek))
            return { startDate: formatDate(startOfWeek), endDate: formatDate(endOfWeek) }
        }

        case 'day':
            return { startDate: formatDate(now), endDate: formatDate(now) }

        case 'long_term':
        default:
            return { startDate: `${year}-01-01`, endDate: `${year}-12-31` }
    }
}
