export const parseObjectParamsToUrlQueryString = <T extends Record<string, any>>(obj?: T): string => {

    if(obj === undefined) return ""
    
    if(Object.entries(obj).length === 0)  {
        return ""
    } else {
        const queryString = "?" + new URLSearchParams(obj).toString();
        return queryString
    }
}