import { HabitItemSkeleton } from "@/features/habits/components/loaders/habit-item-skeleton";

interface HabitsListSkeletonProps {
  count?: number;
}

export const HabitsListSkeleton = ({ count = 3 }: HabitsListSkeletonProps) => (
  <ul className="flex flex-col spacing-in-list-elements">
    {Array.from({ length: count }).map((_, i) => (
      <li key={i}>
        <HabitItemSkeleton />
      </li>
    ))}
  </ul>
);
