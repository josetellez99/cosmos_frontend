import { isValidDate } from "@/helpers/dates/is-valid-date";

export const dateIsToday = (date: string): boolean => {

    if(!isValidDate(date)) throw new Error('Ingresa una fecha válida')

    const today = new Date()
    const input = new Date(date)

    return (
        input.getFullYear() === today.getFullYear() &&
        input.getMonth() === today.getMonth() &&
        input.getDate() === today.getDate()
    )
}