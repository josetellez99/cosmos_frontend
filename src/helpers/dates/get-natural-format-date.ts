export const getNaturalFormatDate = (isoDate: string) => {
    
    if(typeof isoDate !== "string") throw new Error("Ingresa una fecha válida")
        
    const date = new Date(isoDate);
    if(isNaN(date.getTime())) throw new Error("Ingresa una fecha válida")

    const naturalDate = date.toLocaleDateString('es-ES', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
    })
    return naturalDate
}