import { useGoals } from "@/features/goals/hooks";
import { SidebarLayout } from "@/components/layouts/sidebar-layout/sidebar-layout";
import { GoalsList } from "@/features/goals/components/goals-list";

export const GoalsPage = () => {

    const { goals, isLoading, error } = useGoals();

    if (isLoading) {
        return <div>Loading goals...</div>;
    }

    if (error) {
        return <div>Error loading goals: {error?.message}</div>;
    }

    return (
        <SidebarLayout>
            <div>
                <h1>Goals</h1>
                <GoalsList goals={goals} />
            </div>
        </SidebarLayout>
    );
};