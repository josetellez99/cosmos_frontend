import { HabitItemSkeleton } from "@/features/habits/components/loaders/habit-item-skeleton"

interface props {
    count?: number
}

export const TodayHabitsSkeleton = ({ count = 3 }: props) => (
    <ul className="flex flex-col spacing-in-list-elements">
        {Array.from({ length: count }).map((_, i) => (
            <li key={i}>
                <HabitItemSkeleton />
            </li>
        ))}
    </ul>
)
