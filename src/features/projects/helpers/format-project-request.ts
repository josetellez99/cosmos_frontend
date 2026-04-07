import type { CreateProjectRequest } from "@/features/projects/types/request/create-project"
import { setItemsOrder } from "@/features/projects/helpers/set-items-order"
import { setItemStatus } from "@/helpers/items/set-item-status"

/**
 * Single entry point for shaping a CreateProjectRequest before it's posted:
 *   1. setItemsOrder — assigns sortOrder to every stage and task.
 *   2. setItemStatus — fills a default status (based on startingDate) on
 *      the project itself, every stage, and every task. Items that already
 *      have an explicit status are left untouched.
 *
 * The status helper is generic on purpose so it stays reusable for goal
 * subitems and habit items; that's why we apply it per-item here instead
 * of pushing project-specific knowledge into the helper.
 */
export const formatProjectRequest = (req: CreateProjectRequest): CreateProjectRequest => {
    const ordered = setItemsOrder(req)
    const withProjectStatus = setItemStatus(ordered)

    if (!withProjectStatus.stages) return withProjectStatus

    return {
        ...withProjectStatus,
        stages: withProjectStatus.stages.map((stage) => {
            const stageWithStatus = setItemStatus(stage)
            return {
                ...stageWithStatus,
                tasks: stageWithStatus.tasks.map((task) => setItemStatus(task)),
            }
        }),
    }
}
