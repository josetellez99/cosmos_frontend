import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { StageCard } from "@/features/projects/components/stage-card"
import type { StageFormValues } from "@/features/projects/types/form/project-form"

const baseStage: StageFormValues = {
    name: "Design Phase",
    startingDate: "2026-04-01",
    weight: 1,
    tasks: [],
}

describe("StageCard", () => {
    it("renders the stage name", () => {
        render(<StageCard stage={baseStage} index={0} onEdit={vi.fn()} onRemove={vi.fn()} />)

        expect(screen.getByText("Design Phase")).toBeInTheDocument()
    })

    it("shows singular 'tarea' when there is exactly 1 task", () => {
        const stage: StageFormValues = {
            ...baseStage,
            tasks: [{ name: "Task 1", startingDate: "2026-04-01", weight: 1 }],
        }

        render(<StageCard stage={stage} index={0} onEdit={vi.fn()} onRemove={vi.fn()} />)

        expect(screen.getByText("1 tarea")).toBeInTheDocument()
    })

    it("shows plural 'tareas' when there are multiple tasks", () => {
        const stage: StageFormValues = {
            ...baseStage,
            tasks: [
                { name: "Task 1", startingDate: "2026-04-01", weight: 1 },
                { name: "Task 2", startingDate: "2026-04-02", weight: 1 },
            ],
        }

        render(<StageCard stage={stage} index={0} onEdit={vi.fn()} onRemove={vi.fn()} />)

        expect(screen.getByText("2 tareas")).toBeInTheDocument()
    })

    it("shows '0 tareas' when there are no tasks", () => {
        render(<StageCard stage={baseStage} index={0} onEdit={vi.fn()} onRemove={vi.fn()} />)

        expect(screen.getByText("0 tareas")).toBeInTheDocument()
    })

    it("calls onEdit with the correct index when the edit button is clicked", async () => {
        const onEdit = vi.fn()
        const user = userEvent.setup()

        render(<StageCard stage={baseStage} index={2} onEdit={onEdit} onRemove={vi.fn()} />)

        const buttons = screen.getAllByRole("button")
        // First button is edit (Pencil icon)
        await user.click(buttons[0])

        expect(onEdit).toHaveBeenCalledOnce()
        expect(onEdit).toHaveBeenCalledWith(2)
    })

    it("calls onRemove with the correct index when the remove button is clicked", async () => {
        const onRemove = vi.fn()
        const user = userEvent.setup()

        render(<StageCard stage={baseStage} index={3} onEdit={vi.fn()} onRemove={onRemove} />)

        const buttons = screen.getAllByRole("button")
        // Second button is remove (Trash2 icon)
        await user.click(buttons[1])

        expect(onRemove).toHaveBeenCalledOnce()
        expect(onRemove).toHaveBeenCalledWith(3)
    })
})
