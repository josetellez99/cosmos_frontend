import { useState } from 'react';
import { useGoals } from "@/features/goals/hooks";
import { SidebarLayout } from "@/components/layouts/sidebar-layout/sidebar-layout";
import { GoalsList } from "@/features/goals/components/goals-list";
import { Typography } from "@/components/ui/typography";
import { GoalsTemporalityFilter } from "@/features/goals/components/goals-temporality-filter";
import { GoalsListSkeleton } from "@/components/loaders/goals-list-skeleton";
import type { GoalTemporalityType } from "@/lib/constants/temporality";

export const GoalsPage = () => {

    const { goals, isLoading, error } = useGoals({temporality: 'year'});

    const [selectedTemporality, setSelectedTemporality] = useState<GoalTemporalityType>('semester');
    const { goals: filteredGoals, isLoading: isFilteredLoading } = useGoals({ temporality: selectedTemporality });

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

            <div>
                <Typography variant='h3'>Otras metas</Typography>
                <GoalsTemporalityFilter value={selectedTemporality} onChange={setSelectedTemporality} />
                {isFilteredLoading
                    ? <GoalsListSkeleton count={3} />
                    : <GoalsList goals={filteredGoals} />
                }
            </div>
        </SidebarLayout>
    );
};

