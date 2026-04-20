export function getCookie(name: string) : string {
    const cookie = document.cookie.split('; ').find(row => row.startsWith(`${name}=`))?.split('=')[1];
    console.log('cookie csrf')
    console.log(cookie)
    if (!cookie) {
        throw new Error(`Cookie ${name} not found`);
    }
    return cookie;
}
