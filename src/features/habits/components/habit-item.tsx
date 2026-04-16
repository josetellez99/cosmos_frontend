import type { ReactNode } from "react";
import { Check, Pencil, Trash2 } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import type { HabitSummaryResponse } from "@/features/habits/types/response/habits";
import { cn } from "@/helpers/cn-tailwind";
import { getStrengthenColor } from "@/helpers/strings/colors/get-strengthen-color";
import { getColorByProgress } from "@/helpers/strings/colors/get-color-by-progress";

interface props {
  habit: HabitSummaryResponse;
  allowCheck: boolean;
  isNested: boolean;
  isChecked?: boolean;
  onToggleCheck?: (next: boolean) => void;
  onClick?: () => void;
  onEditClick?: () => void;
  onRemoveClick?: () => void;
  badge?: ReactNode;
}

export const HabitItem = ({ habit, allowCheck, isNested, isChecked, onToggleCheck, onClick, onEditClick, onRemoveClick, badge }: props) => {

  const hasProgress = habit.progress !== undefined

    let progress_bg_color;
    let progress_border_color;
    let progress_accent_color;

    if (hasProgress) {
        progress_bg_color = getColorByProgress(habit.progress);
        progress_border_color = getStrengthenColor(progress_bg_color, 0.2);
        progress_accent_color = getStrengthenColor(progress_bg_color, 0.9);
    }

    const hasActions = onEditClick !== undefined || onRemoveClick !== undefined

  return (
    <div
      onClick={onClick}
      className={cn(
        "flex default-card-rounded items-center default-card-padding justify-between default-animation",
        onClick && "cursor-pointer hover:opacity-70 transition-opacity",
        isNested ? "" : "bg-white border border-soft-gray",
      )}
    >
      <div className="flex items-center gap-3 flex-1 min-w-0">
        {allowCheck && (
          <button
            type="button"
            aria-label={isChecked ? "Desmarcar hábito" : "Marcar hábito"}
            aria-pressed={!!isChecked}
            onClick={(e) => {
              e.stopPropagation()
              onToggleCheck?.(!isChecked)
            }}
            className={cn(
              "flex-shrink-0 size-5 rounded-md border flex items-center justify-center cursor-pointer default-animation",
              isChecked
                ? "bg-primary border-primary text-primary-foreground"
                : "bg-white border-soft-gray hover:border-primary",
            )}
          >
            {isChecked && <Check className="size-3" />}
          </button>
        )}
        <span className="text-xl flex-shrink-0">{habit.emoji}</span>
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2">
            <div className="flex-1 min-w-0">
              <Typography className="group-hover:text-primary break-words">
                {habit.name}
              </Typography>
            </div>
            <div className="flex items-center gap-1">
              {badge}
              {hasActions ? (
                <>
                  {onEditClick && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={(e) => { e.stopPropagation(); onEditClick() }}
                    >
                      <Pencil />
                    </Button>
                  )}
                  {onRemoveClick && (
                    <Button
                      type="button"
                      variant="ghost"
                      size="icon-xs"
                      onClick={(e) => { e.stopPropagation(); onRemoveClick() }}
                    >
                      <Trash2 />
                    </Button>
                  )}
                </>
              ) : (
                hasProgress && (
                  <span
                    className={cn("text-xs font-bold px-2 py-1 rounded-md border")}
                    style={{
                      backgroundColor: progress_bg_color,
                      borderColor: progress_border_color,
                      color: progress_accent_color,
                    }}
                  >
                    {habit.progress}%
                  </span>
                )
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};
