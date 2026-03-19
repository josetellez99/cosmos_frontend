export const parseObjectParamsToUrlQueryString = <T extends Record<string, any>>(obj: T): string => {
    const queryString = "?" + new URLSearchParams(obj).toString();
    if(Object.entries(obj).length === 0) {
        return ""
    } else {
        return queryString
    }

}