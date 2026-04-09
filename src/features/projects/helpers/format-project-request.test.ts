import { describe, it, expect, vi, afterEach } from "vitest"
import { formatProjectRequest } from "@/features/projects/helpers/format-project-request"
import { goalStatus } from "@/lib/constants/goals_status"
import type { CreateProjectRequest } from "@/features/projects/types/request/create-project"
import type { ProjectCodeString } from "@/features/projects/types/project-code-string"
import type { ISODateString, ISOTimestampString } from "@/types/dates"

const FAKE_TODAY = new Date("2026-04-09T12:00:00Z")

const baseRequest: CreateProjectRequest = {
    name: "Test Project",
    code: "AB-12" as ProjectCodeString,
    startingDate: "2026-01-01" as ISODateString, // in the past
    deadline: "2026-06-01T00:00:00Z" as ISOTimestampString,
}

describe("formatProjectRequest", () => {
    afterEach(() => {
        vi.useRealTimers()
    })

    const useFakeDate = () => {
        vi.useFakeTimers()
        vi.setSystemTime(FAKE_TODAY)
    }

    it("assigns status to the project itself when none is set", () => {
        useFakeDate()

        const result = formatProjectRequest(baseRequest)

        expect(result.status).toBe(goalStatus.IN_PROGRESS)
    })

    it("does not overwrite an explicit project status", () => {
        useFakeDate()
        const req: CreateProjectRequest = {
            ...baseRequest,
            status: goalStatus.COMPLETED,
        }

        const result = formatProjectRequest(req)

        expect(result.status).toBe(goalStatus.COMPLETED)
    })

    it("returns early when there are no stages", () => {
        useFakeDate()

        const result = formatProjectRequest(baseRequest)

        expect(result.stages).toBeUndefined()
    })

    it("assigns sortOrder AND status to stages and tasks", () => {
        useFakeDate()
        const req: CreateProjectRequest = {
            ...baseRequest,
            stages: [
                {
                    name: "Past Stage",
                    startingDate: "2026-01-15",
                    weight: 1,
                    sortOrder: 0,
                    tasks: [
                        { name: "Past Task", startingDate: "2026-02-01", weight: 1, sortOrder: 0 },
                        { name: "Future Task", startingDate: "2026-05-01", weight: 1, sortOrder: 0 },
                    ],
                },
                {
                    name: "Future Stage",
                    startingDate: "2026-05-01",
                    weight: 1,
                    sortOrder: 0,
                    tasks: [],
                },
            ],
        }

        const result = formatProjectRequest(req)

        // sortOrder
        expect(result.stages![0].sortOrder).toBe(1)
        expect(result.stages![1].sortOrder).toBe(2)
        expect(result.stages![0].tasks[0].sortOrder).toBe(1)
        expect(result.stages![0].tasks[1].sortOrder).toBe(2)

        // status
        expect(result.stages![0].status).toBe(goalStatus.IN_PROGRESS)
        expect(result.stages![1].status).toBe(goalStatus.NOT_STARTED)
        expect(result.stages![0].tasks[0].status).toBe(goalStatus.IN_PROGRESS)
        expect(result.stages![0].tasks[1].status).toBe(goalStatus.NOT_STARTED)
    })

    it("preserves explicit status on stages and tasks", () => {
        useFakeDate()
        const req: CreateProjectRequest = {
            ...baseRequest,
            stages: [
                {
                    name: "Done Stage",
                    startingDate: "2026-01-01",
                    weight: 1,
                    sortOrder: 0,
                    status: goalStatus.COMPLETED,
                    tasks: [
                        {
                            name: "Done Task",
                            startingDate: "2026-01-01",
                            weight: 1,
                            sortOrder: 0,
                            status: goalStatus.DISCARDED,
                        },
                    ],
                },
            ],
        }

        const result = formatProjectRequest(req)

        expect(result.stages![0].status).toBe(goalStatus.COMPLETED)
        expect(result.stages![0].tasks[0].status).toBe(goalStatus.DISCARDED)
    })

    it("does not mutate the original request", () => {
        useFakeDate()
        const req: CreateProjectRequest = {
            ...baseRequest,
            stages: [
                { name: "S", startingDate: "2026-01-01", weight: 1, sortOrder: 0, tasks: [] },
            ],
        }

        formatProjectRequest(req)

        expect(req.stages![0].sortOrder).toBe(0)
        expect(req.status).toBeUndefined()
    })
})
