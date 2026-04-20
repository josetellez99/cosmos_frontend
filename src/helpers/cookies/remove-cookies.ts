export function removeCookies(names: string[]): void {
    for (const name of names) {
        document.cookie = `${name}=; Path=/; Expires=Thu, 01 Jan 1970 00:00:00 GMT`;
    }
}
