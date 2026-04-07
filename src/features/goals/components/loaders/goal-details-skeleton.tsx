import { GoalItemSkeleton } from "@/features/goals/components/loaders/goal-item-skeleton"

export const GoalDetailsSkeleton = () => (
    <div className="flex flex-col gap-3">
        <GoalItemSkeleton />
        <div className="flex flex-col gap-3 pl-2">
            <GoalItemSkeleton />
            <GoalItemSkeleton />
            <GoalItemSkeleton />
        </div>
    </div>
)
