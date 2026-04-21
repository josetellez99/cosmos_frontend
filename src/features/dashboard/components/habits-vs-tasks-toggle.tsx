import { Button } from "@/components/ui/button"
import { cn } from "@/helpers/cn-tailwind"
import type { HabitsVsTasksView } from "@/features/dashboard/types/habits-vs-tasks-view"

interface props {
    view: HabitsVsTasksView
    onChange: (next: HabitsVsTasksView) => void
}

const isSelected = (view: HabitsVsTasksView, target: HabitsVsTasksView) => view === target

const buttonClass = (selected: boolean) =>
    cn(
        "border",
        selected
            ? "bg-primary text-primary-foreground border-primary"
            : "bg-transparent text-foreground border-soft-gray hover:bg-accent",
    )

export const HabitsVsTasksToggle = ({ view, onChange }: props) => (
    <div className="flex gap-2 w-full justify-end">
        <Button
            type="button"
            size="sm"
            variant="ghost"
            className={buttonClass(isSelected(view, 'habits'))}
            onClick={() => onChange('habits')}
        >
            Hábitos
        </Button>
        <Button
            type="button"
            size="sm"
            variant="ghost"
            className={buttonClass(isSelected(view, 'tasks'))}
            onClick={() => onChange('tasks')}
        >
            Tareas
        </Button>
    </div>
)
