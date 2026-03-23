import { GoalItemSkeleton } from './goal-item-skeleton';

interface GoalsListSkeletonProps {
  count?: number;
}

export const GoalsListSkeleton = ({ count = 3 }: GoalsListSkeletonProps) => (
  <ul className="flex flex-col default-spacing-between-list-elements">
    {Array.from({ length: count }).map((_, i) => (
      <li key={i}>
        <GoalItemSkeleton />
      </li>
    ))}
  </ul>
);
