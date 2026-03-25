export const getYYYYMMDDformat = (dateString: string): string => {
    if (typeof dateString !== 'string') return 'Ingresa una fecha válida'

    const date = new Date(dateString)

    if (isNaN(date.getTime())) return 'Ingresa una fecha válida'

    const year = date.getFullYear()
    const month = String(date.getMonth() + 1).padStart(2, '0')
    const day = String(date.getDate()).padStart(2, '0')

    return `${year}-${month}-${day}`
}
