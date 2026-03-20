import { useGoals } from "@/features/goals/hooks";

export const GoalsPage = () => {
    const { goals, isLoading, error } = useGoals();

    if (isLoading) {
        return <div>Loading goals...</div>;
    }

    if (error) {
        return <div>Error loading goals: {error?.message}</div>;
    }

    return (
        <div>
            <h1>Goals</h1>
            {goals.length === 0 ? (
                <p>No goals found</p>
            ) : (
                <ul>
                    {goals.map((goal) => (
                        <li key={goal.id}>{goal.name}</li>
                    ))}
                </ul>
            )}
        </div>
    );
};