import { describe, it, expect } from "vitest"
import { setItemsOrder } from "@/features/projects/helpers/set-items-order"
import type { CreateProjectRequest } from "@/features/projects/types/request/create-project"
import type { ProjectCodeString } from "@/features/projects/types/project-code-string"
import type { ISODateString, ISOTimestampString } from "@/types/dates"

const baseRequest: CreateProjectRequest = {
    name: "Test Project",
    code: "AB-12" as ProjectCodeString,
    startingDate: "2026-04-01" as ISODateString,
    deadline: "2026-06-01T00:00:00Z" as ISOTimestampString,
}

describe("setItemsOrder", () => {
    it("returns the request unchanged when stages is undefined", () => {
        const result = setItemsOrder(baseRequest)

        expect(result).toEqual(baseRequest)
    })

    it("assigns 1-based sortOrder to each stage", () => {
        const req: CreateProjectRequest = {
            ...baseRequest,
            stages: [
                { name: "Stage A", startingDate: "2026-04-01", weight: 1, sortOrder: 0, tasks: [] },
                { name: "Stage B", startingDate: "2026-04-15", weight: 1, sortOrder: 0, tasks: [] },
            ],
        }

        const result = setItemsOrder(req)

        expect(result.stages![0].sortOrder).toBe(1)
        expect(result.stages![1].sortOrder).toBe(2)
    })

    it("assigns 1-based sortOrder to each task within a stage", () => {
        const req: CreateProjectRequest = {
            ...baseRequest,
            stages: [
                {
                    name: "Stage A",
                    startingDate: "2026-04-01",
                    weight: 1,
                    sortOrder: 0,
                    tasks: [
                        { name: "Task 1", startingDate: "2026-04-01", weight: 1, sortOrder: 0 },
                        { name: "Task 2", startingDate: "2026-04-02", weight: 1, sortOrder: 0 },
                        { name: "Task 3", startingDate: "2026-04-03", weight: 1, sortOrder: 0 },
                    ],
                },
            ],
        }

        const result = setItemsOrder(req)
        const tasks = result.stages![0].tasks

        expect(tasks[0].sortOrder).toBe(1)
        expect(tasks[1].sortOrder).toBe(2)
        expect(tasks[2].sortOrder).toBe(3)
    })

    it("overwrites any pre-existing sortOrder values", () => {
        const req: CreateProjectRequest = {
            ...baseRequest,
            stages: [
                { name: "Stage", startingDate: "2026-04-01", weight: 1, sortOrder: 99, tasks: [
                    { name: "Task", startingDate: "2026-04-01", weight: 1, sortOrder: 50 },
                ] },
            ],
        }

        const result = setItemsOrder(req)

        expect(result.stages![0].sortOrder).toBe(1)
        expect(result.stages![0].tasks[0].sortOrder).toBe(1)
    })

    it("does not mutate the original request", () => {
        const req: CreateProjectRequest = {
            ...baseRequest,
            stages: [
                { name: "Stage", startingDate: "2026-04-01", weight: 1, sortOrder: 0, tasks: [] },
            ],
        }

        setItemsOrder(req)

        expect(req.stages![0].sortOrder).toBe(0)
    })

    it("handles empty stages array", () => {
        const req: CreateProjectRequest = {
            ...baseRequest,
            stages: [],
        }

        const result = setItemsOrder(req)

        expect(result.stages).toEqual([])
    })
})
