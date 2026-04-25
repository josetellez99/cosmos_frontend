import type { DateTypesForAmountRangeHabit } from '@/features/habits/types/date-type-amount-range-habits'
import { ENDPOINTS_MAP } from "@/lib/constants/endpoints_map"

export const getEndpointForDateTypeHabit = (dateType: DateTypesForAmountRangeHabit) => {
    if(dateType === 'dayly') {
        return ENDPOINTS_MAP.HABITS.GET_HABITS_FOR_DAY
    } else if( dateType === 'weekly') {
        return ENDPOINTS_MAP.HABITS.GET_HABITS_FOR_WEEK
    } else if(dateType === 'monthly') {
        return ENDPOINTS_MAP.HABITS.GET_HABITS_FOR_MONTH
    }
}