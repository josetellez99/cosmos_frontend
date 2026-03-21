import { useGoals } from "@/features/goals/hooks";
import { SidebarLayout } from "@/components/layouts/sidebar-layout/sidebar-layout";
import { GoalsList } from "@/features/goals/components/goals-list";
import { Typography } from "@/components/ui/typography";

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
                <Typography variant='h3'>Metas anuales</Typography>
                <GoalsList goals={goals} />
            </div>
        </SidebarLayout>
    );
};