import { isDateInDatesStringArray } from "@/helpers/dates/is-date-in-records"

export const getIsCheckedForAmountRangeHabit = (showingDate: string, records: string[]): boolean => {
    return isDateInDatesStringArray(showingDate, records)
}
