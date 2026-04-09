import { render, screen, waitFor } from "@testing-library/react"
import userEvent from "@testing-library/user-event"
import { describe, it, expect, vi, beforeEach } from "vitest"
import { MemoryRouter } from "react-router"
import { ProjectForm } from "@/features/projects/components/project-form"
import type { ProjectFormValues } from "@/features/projects/types/form/project-form"

// Mock child components that have their own async dependencies
vi.mock("@/features/projects/components/form/stage-form-section", () => ({
    StagesSection: () => <div data-testid="stages-section">StagesSection</div>,
}))
vi.mock("@/features/goals/components/form/goals-linking-section", () => ({
    GoalsLinkingSection: () => <div data-testid="goals-linking-section">GoalsLinkingSection</div>,
}))
vi.mock("@/features/projects/components/project-form-preview", () => ({
    ProjectFormPreview: () => <div data-testid="project-form-preview">Preview</div>,
}))

const mockMutate = vi.fn()
vi.mock("@/features/projects/hooks/useCreateProject", () => ({
    useCreateProject: () => ({
        mutate: mockMutate,
        isPending: false,
    }),
}))

const mockNavigate = vi.fn()
vi.mock("react-router", async () => {
    const actual = await vi.importActual("react-router")
    return {
        ...actual,
        useNavigate: () => mockNavigate,
    }
})

const defaultValues: ProjectFormValues = {
    name: "",
    description: "",
    code: "",
    startingDate: "",
    deadline: "",
    stages: [],
    goalLinks: [],
}

function renderForm(props?: Partial<{ isEditing: boolean; initialValues: ProjectFormValues }>) {
    return render(
        <MemoryRouter>
            <ProjectForm
                isEditing={props?.isEditing ?? false}
                initialValues={props?.initialValues ?? defaultValues}
            />
        </MemoryRouter>
    )
}

beforeEach(() => {
    vi.clearAllMocks()
})

describe("ProjectForm", () => {
    it("renders the 'Crear proyecto' heading when not editing", () => {
        renderForm()

        expect(screen.getByText("Crear proyecto", { selector: "h3" })).toBeInTheDocument()
    })

    it("renders the 'Editar proyecto' heading when editing", () => {
        renderForm({ isEditing: true })

        expect(screen.getByText("Editar proyecto", { selector: "h3" })).toBeInTheDocument()
    })

    it("renders the submit button with 'Crear proyecto' text", () => {
        renderForm()

        expect(screen.getByRole("button", { name: "Crear proyecto" })).toBeInTheDocument()
    })

    it("renders the submit button with 'Guardar cambios' text when editing", () => {
        renderForm({ isEditing: true })

        expect(screen.getByRole("button", { name: "Guardar cambios" })).toBeInTheDocument()
    })

    it("renders all expected form fields", () => {
        renderForm()

        expect(screen.getByLabelText("Nombre")).toBeInTheDocument()
        expect(screen.getByLabelText("Código")).toBeInTheDocument()
        expect(screen.getByLabelText("Fecha de inicio")).toBeInTheDocument()
        expect(screen.getByLabelText("Fecha límite")).toBeInTheDocument()
    })

    it("renders the StagesSection and GoalsLinkingSection", () => {
        renderForm()

        expect(screen.getByTestId("stages-section")).toBeInTheDocument()
        expect(screen.getByTestId("goals-linking-section")).toBeInTheDocument()
    })

    it("calls mutate with correct request shape on valid submission", async () => {
        const user = userEvent.setup()

        const validValues: ProjectFormValues = {
            name: "My Project",
            description: "",
            code: "AB-12",
            startingDate: "2026-05-01",
            deadline: "2026-12-01T00:00:00Z",
            stages: [],
            goalLinks: [],
        }

        renderForm({ initialValues: validValues })

        await user.click(screen.getByRole("button", { name: "Crear proyecto" }))

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledOnce()
        })

        const request = mockMutate.mock.calls[0][0]
        expect(request.name).toBe("My Project")
        expect(request.code).toBe("AB-12")
        expect(request.startingDate).toBe("2026-05-01")
        expect(request.deadline).toBe("2026-12-01T00:00:00Z")
    })

    it("does NOT call mutate when the form has validation errors", async () => {
        const user = userEvent.setup()

        renderForm() // all fields empty → invalid

        await user.click(screen.getByRole("button", { name: "Crear proyecto" }))

        await waitFor(() => {
            expect(mockMutate).not.toHaveBeenCalled()
        })
    })

    it("maps stages with sortOrder in the request", async () => {
        const user = userEvent.setup()

        const valuesWithStages: ProjectFormValues = {
            name: "My Project",
            description: "",
            code: "AB-12",
            startingDate: "2026-05-01",
            deadline: "2026-12-01T00:00:00Z",
            stages: [
                {
                    name: "Stage A",
                    startingDate: "2026-05-01",
                    weight: 1,
                    tasks: [
                        { name: "Task 1", startingDate: "2026-05-01", weight: 1 },
                    ],
                },
            ],
            goalLinks: [],
        }

        renderForm({ initialValues: valuesWithStages })

        await user.click(screen.getByRole("button", { name: "Crear proyecto" }))

        await waitFor(() => {
            expect(mockMutate).toHaveBeenCalledOnce()
        })

        const request = mockMutate.mock.calls[0][0]
        expect(request.stages[0].sortOrder).toBe(1)
        expect(request.stages[0].tasks[0].sortOrder).toBe(1)
    })
})
