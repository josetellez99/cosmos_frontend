export const getNaturalFormatDate = (isoDate: string) => {
    const date = new Date(isoDate);

    if(typeof isoDate !== "string") return "Ingresa una fecha válida" 
    if(isNaN(date.getTime())) return "Ingresa una fecha válida"

    const naturalDate = date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
    return naturalDate
}

getNaturalFormatDate('2026-03-26');