import { parseObjectParamsToUrlQueryString } from "@/helpers/urls/url-parsing"

describe("parseObjectParamsToUrlQueryString", () => {
    it("should return an empty string if the object is empty", () => {
        const object = {}
        expect(parseObjectParamsToUrlQueryString(object)).toBe("")
    })

    it("should return an empty string when no params are passed (undefined)", () => {
        expect(parseObjectParamsToUrlQueryString()).toBe("")
    })

    it("should return a query string with a single param", () => {
        const object = { orderBy: "temporality" }
        expect(parseObjectParamsToUrlQueryString(object)).toBe("?orderBy=temporality")
    })

    it("should return a query string with multiple params joined by &", () => {
        const object = { orderBy: "temporality", status: "active", page: "2" }
        expect(parseObjectParamsToUrlQueryString(object)).toBe("?orderBy=temporality&status=active&page=2")
    })
    it("should return a query string with multiple values for the same key, passign an array", () => {
        const object = { status: ['not started', 'completed']}
        expect(parseObjectParamsToUrlQueryString(object)).toBe("?status=not+started%2Ccompleted")
    })

    it("should encode special characters in values", () => {
        const object = { search: "hello world", filter: "a&b=c" }
        expect(parseObjectParamsToUrlQueryString(object)).toBe("?search=hello+world&filter=a%26b%3Dc")
    })

    it("should encode special characters in keys", () => {
        const object = { "my key": "value" }
        expect(parseObjectParamsToUrlQueryString(object)).toBe("?my+key=value")
    })

    it("should handle numeric values converted to strings", () => {
        const object = { limit: "100", offset: "0" }
        expect(parseObjectParamsToUrlQueryString(object)).toBe("?limit=100&offset=0")
    })

    it("should handle values with unicode characters", () => {
        const object = { name: "José", city: "São Paulo" }
        expect(parseObjectParamsToUrlQueryString(object)).toBe("?name=Jos%C3%A9&city=S%C3%A3o+Paulo")
    })

    it("should handle empty string values", () => {
        const object = { query: "", status: "active" }
        expect(parseObjectParamsToUrlQueryString(object)).toBe("?query=&status=active")
    })

    it("should handle values with slashes and colons", () => {
        const object = { redirect: "https://example.com/path" }
        expect(parseObjectParamsToUrlQueryString(object)).toBe("?redirect=https%3A%2F%2Fexample.com%2Fpath")
    })
})
