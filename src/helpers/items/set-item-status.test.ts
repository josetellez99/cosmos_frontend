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

    it("assigns 'in progress' when startingDate is in the past", () => {
        useFakeDate()
        const item = { startingDate: "2026-04-01" }

        const result = setItemStatus(item)

        expect(result.status).toBe(goalStatus.IN_PROGRESS)
    })

    it("assigns 'not started' when startingDate is today", () => {
        useFakeDate()
        const item = { startingDate: "2026-04-09" }

        const result = setItemStatus(item)

        expect(result.status).toBe(goalStatus.NOT_STARTED)
    })

    it("assigns 'not started' when startingDate is in the future", () => {
        useFakeDate()
        const item = { startingDate: "2026-05-01" }

        const result = setItemStatus(item)

        expect(result.status).toBe(goalStatus.NOT_STARTED)
    })

    it("does NOT overwrite an explicit status", () => {
        useFakeDate()
        const item = { startingDate: "2026-01-01", status: goalStatus.COMPLETED as const }

        const result = setItemStatus(item)

        expect(result.status).toBe(goalStatus.COMPLETED)
    })

    it("does NOT overwrite 'discarded' status even for past dates", () => {
        useFakeDate()
        const item = { startingDate: "2025-01-01", status: goalStatus.DISCARDED as const }

        const result = setItemStatus(item)

        expect(result.status).toBe(goalStatus.DISCARDED)
    })

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
