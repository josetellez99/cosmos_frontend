import { describe, it, expect, vi, afterEach } from "vitest"
import { setItemStatus } from "@/helpers/items/set-item-status"
import { goalStatus } from "@/lib/constants/goals_status"

// Freeze "today" so tests are deterministic
const FAKE_TODAY = new Date("2026-04-09T12:00:00Z")

describe("setItemStatus", () => {
    afterEach(() => {
        vi.useRealTimers()
    })

    const useFakeDate = () => {
        vi.useFakeTimers()
        vi.setSystemTime(FAKE_TODAY)
    }

    it("preserves all other properties on the item", () => {
        useFakeDate()
        const item = { startingDate: "2026-05-01", name: "Test", weight: 5 }

        const result = setItemStatus(item)

        expect(result.name).toBe("Test")
        expect(result.weight).toBe(5)
    })

    it("treats null status as unset and assigns a default", () => {
        useFakeDate()
        const item = { startingDate: "2026-01-01", status: null }

        const result = setItemStatus(item)

        // null is falsy so the helper should assign a status
        expect(result.status).toBe(goalStatus.IN_PROGRESS)
    })
})
