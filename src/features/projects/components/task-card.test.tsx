import { render, screen } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi } from "vitest"
import { TaskCard } from "@/features/projects/components/task-card"
import type { TaskFormValues } from "@/features/projects/types/form/project-form"

const baseTask: TaskFormValues = {
    name: "Write documentation",
    startingDate: "2026-04-01",
    weight: 1,
}

describe("TaskCard", () => {
    it("renders the task name", () => {
        render(<TaskCard task={baseTask} index={0} onEdit={vi.fn()} onRemove={vi.fn()} />)

        expect(screen.getByText("Write documentation")).toBeInTheDocument()
    })

    it("calls onEdit with the correct index when the edit button is clicked", async () => {
        const onEdit = vi.fn()
        const user = userEvent.setup()

        render(<TaskCard task={baseTask} index={5} onEdit={onEdit} onRemove={vi.fn()} />)

        const buttons = screen.getAllByRole("button")
        await user.click(buttons[0])

        expect(onEdit).toHaveBeenCalledOnce()
        expect(onEdit).toHaveBeenCalledWith(5)
    })

    it("calls onRemove with the correct index when the remove button is clicked", async () => {
        const onRemove = vi.fn()
        const user = userEvent.setup()

        render(<TaskCard task={baseTask} index={1} onEdit={vi.fn()} onRemove={onRemove} />)

        const buttons = screen.getAllByRole("button")
        await user.click(buttons[1])

        expect(onRemove).toHaveBeenCalledOnce()
        expect(onRemove).toHaveBeenCalledWith(1)
    })

    it("renders two action buttons (edit and remove)", () => {
        render(<TaskCard task={baseTask} index={0} onEdit={vi.fn()} onRemove={vi.fn()} />)

        expect(screen.getAllByRole("button")).toHaveLength(2)
    })
})
