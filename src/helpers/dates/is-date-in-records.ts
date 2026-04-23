import { getYYYYMMDDformat } from "@/helpers/dates/get-YYYY-MM-DD-format"
import { isValidDate } from "@/helpers/dates/is-valid-date"

export const isDateInDatesStringArray = (dateToEval: string, dates: string[]): boolean => {
    if(!isValidDate(dateToEval)) throw new Error('Ingresa una fecha válida')
    const variable = dates.some(date => getYYYYMMDDformat(date) === dateToEval)
    console.log(variable)
    return variable
}
