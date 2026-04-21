import { isValidDate } from "@/helpers/dates/is-valid-date";

export const getNaturalFormatDate = (isoDate: string) => {
    
    if(typeof isoDate !== "string") throw new Error("Ingresa una fecha válida")

    if(!isValidDate(isoDate)) throw new Error('Ingresa una fecha válida')
        
    const date = new Date(isoDate);

    const naturalDate = date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
    return naturalDate
}