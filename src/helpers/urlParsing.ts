export const parseObjectParamsToUrlQueryString = <T extends Record<string, any>>(obj?: T): string => {

    if(obj === undefined) return ""
    const queryString = "?" + new URLSearchParams(obj).toString();

    if(Object.entries(obj).length === 0)  {
        return ""
    } else {
        return queryString
    }
}

parseObjectParamsToUrlQueryString()