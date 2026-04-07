import type { CreateProjectRequest } from "@/features/projects/types/request/create-project"

/**
 * Walks the project request and assigns `sortOrder = index + 1` to every
 * stage and to every task inside each stage. The form doesn't set this
 * field — it's added here, right before the request is posted.
 */
export const setItemsOrder = (req: CreateProjectRequest): CreateProjectRequest => {
    if (!req.stages) return req

    return {
        ...req,
        stages: req.stages.map((stage, stageIndex) => ({
            ...stage,
            sortOrder: stageIndex + 1,
            tasks: stage.tasks.map((task, taskIndex) => ({
                ...task,
                sortOrder: taskIndex + 1,
            })),
        })),
    }
}
