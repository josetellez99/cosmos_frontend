import { useState } from 'react';
import { useGoals } from "@/features/goals/hooks";
import { SidebarLayout } from "@/components/layouts/sidebar-layout/sidebar-layout";
import { GoalsList } from "@/features/goals/components/goals-list";
import { Typography } from "@/components/ui/typography";
import { GoalsTemporalityFilter } from "@/features/goals/components/goals-temporality-filter";
import { GoalsListSkeleton } from "@/components/loaders/goals-list-skeleton";
import { goalTemporality, type GoalTemporalityType } from "@/lib/constants/temporality";
import { defaultYearlyGoalReq, goalsPageDynamicFiltersReq } from '@/features/goals/constants/reqObjects';

export const GoalsPage = () => {

    const { goals, isLoading, error } = useGoals(defaultYearlyGoalReq);

    const [selectedTemporality, setSelectedTemporality] = useState<GoalTemporalityType>(goalTemporality.SEMESTER);
    const { goals: filteredGoals, isLoading: isFilteredLoading } = useGoals(goalsPageDynamicFiltersReq);

    if (isLoading) {
        return <div>Loading goals...</div>;
    }

    if (error) {
        return <div>Error loading goals: {error?.message}</div>;
    }

    return (
        <SidebarLayout>
            <div className='spacing-in-sections'>
                <div className='spacing-in-title-section'>
                    <Typography variant='h3'>Metas anuales</Typography>
                </div>
                <GoalsList goals={goals} />
            </div>

            <div>
                <div className='spacing-in-title-section'>
                    <Typography variant='h3'>Otras metas</Typography>
                </div>
                <div className='spacing-in-title-section'>
                    <GoalsTemporalityFilter value={selectedTemporality} onChange={setSelectedTemporality} />
                </div>
                {isFilteredLoading
                    ? <GoalsListSkeleton count={3} />
                    : <GoalsList goals={filteredGoals} />
                }
            </div>
        </SidebarLayout>
    );
};

