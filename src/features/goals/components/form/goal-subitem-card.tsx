import { ProjectItem } from "@/features/projects/components/project-item"
import { GoalItem } from "@/features/goals/components/goal-item"
import { SystemItem } from "@/features/systems/components/system-item"
import { HabitItem } from "@/features/habits/components/habit-item"
import { SubitemWeightTag } from "@/features/goals/components/form/subitem-weight-tag"
import type { GoalDetailsSubitem } from "@/features/goals/types/response/goal-details"

interface GoalSubitemCardProps {
    subitem: GoalDetailsSubitem
    onClick?: (subitem: GoalDetailsSubitem) => void
}

function renderSubitemBody(subitem: GoalDetailsSubitem) {
    if (subitem.project) {
        return <ProjectItem project={subitem.project} />
    }
    if (subitem.subgoal) {
        return <GoalItem goal={subitem.subgoal} showProgress={false} />
    }
    if (subitem.system) {
        return <SystemItem system={subitem.system}>{null}</SystemItem>
    }
    if (subitem.habit) {
        return <HabitItem habit={subitem.habit} allowCheck={false} isNested={false} />
    }
    return null
}

export function GoalSubitemCard({ subitem, onClick }: GoalSubitemCardProps) {
    const body = renderSubitemBody(subitem)
    if (!body) return null

    return (
        <div className="relative">
            {body}
            <SubitemWeightTag weight={subitem.subitemWeight} />
            {onClick && (
                <button
                    type="button"
                    aria-label="Editar peso"
                    className="absolute inset-0 z-[5] cursor-pointer rounded-[inherit] bg-transparent"
                    onClick={() => onClick(subitem)}
                />
            )}
        </div>
    )
}
