import { goalStatus, type GoalStatusType } from "@/lib/constants/goals_status"
import { getYYYYMMDDformat } from "@/helpers/dates/get-YYYY-MM-DD-format"

type StatusableItem = {
    startingDate: string
    status?: GoalStatusType | null
}

/**
 * Fills in a default `status` for any item with a `startingDate`:
 *   - past startingDate  → "in progress"
 *   - today or future    → "not started"
 *
 * Respects an explicit status: if `item.status` is already set, the item is
 * returned unchanged. Generic so callers keep their concrete type.
 */
export const setItemStatus = <T extends StatusableItem>(item: T): T => {
    if (item.status) return item

    const today = getYYYYMMDDformat(new Date().toISOString())
    const hasStarted = item.startingDate < today

    return {
        ...item,
        status: hasStarted ? goalStatus.IN_PROGRESS : goalStatus.NOT_STARTED,
    }
}
