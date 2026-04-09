import { cn } from "@/helpers/cn-tailwind";
import { Pencil, Trash2 } from "lucide-react";
import { Typography } from "@/components/ui/typography";
import { Button } from "@/components/ui/button";
import type { GoalSummaryResponse } from "@/features/goals/types/response/user-goals";
import { getStrengthenColor } from "@/helpers/strings/colors/get-strengthen-color";
import { goalTemporality } from "@/lib/constants/goals_temporalities";
import { getNaturalFormatDate } from "@/helpers/dates/get-natural-format-date"
import { goalStatus } from "@/lib/constants/goals_status";

interface props {
  goal: GoalSummaryResponse | null;
  showProgress?: boolean;
  onClick?: () => void;
  onEdit?: () => void;
  onRemove?: () => void;
}

export const GoalItem = ({ goal, showProgress = true, onClick, onEdit, onRemove }: props) => {

  if (!goal) return null;

  const isYearly = goal.temporality === goalTemporality.YEAR;
  const isNotStarted = goal.status === goalStatus.NOT_STARTED;
  const isCompleted = goal.status === goalStatus.COMPLETED;

  const borderColor = isYearly ? getStrengthenColor(goal.color, 0.08) : undefined;
  const accentColor = isYearly ? getStrengthenColor(goal.color, 0.9) : undefined;
  const textColor = isYearly ? getStrengthenColor(goal.color, 0.95) : undefined;

  const hasActions = onEdit || onRemove;

  const cardContent = (
    <div
      className={cn(
        "default-card-padding default-card-rounded",
        !isYearly && "bg-white border border-soft-gray",
        isNotStarted && "opacity-60",
      )}
      style={
        isYearly
          ? {
              backgroundColor: goal.color,
              borderColor: borderColor,
              borderWidth: "1px",
            }
          : undefined
      }
    >
      <div className={cn("flex justify-between items-center", showProgress && "mb-3")}>
        <div className="flex items-center gap-3">
          <Typography
            className="font-semibold text-xs"
            style={isYearly ? { color: textColor } : undefined}
          >
            {goal.name}
          </Typography>
        </div>

        <div className="flex items-center gap-2">
          {showProgress && !isNotStarted && (
            <div className="flex items-center gap-3">
              {isCompleted ? (
                <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                  <span className="animate-pulse">●</span> Completada
                </span>
              ) : (
                <span
                  style={{
                    color: isYearly ? accentColor : "var(--primary)",
                  }}
                  className={cn("text-xs font-semibold bg-white rounded-[40%] px-2 py-1 inline-flex items-center justify-center")}
                >
                  {goal.progress}%
                </span>
              )}
            </div>
          )}

          {hasActions && (
            <div className="flex items-center gap-1">
              {onEdit && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={(e) => { e.stopPropagation(); onEdit(); }}
                >
                  <Pencil />
                </Button>
              )}
              {onRemove && (
                <Button
                  type="button"
                  variant="ghost"
                  size="icon-xs"
                  onClick={(e) => { e.stopPropagation(); onRemove(); }}
                >
                  <Trash2 />
                </Button>
              )}
            </div>
          )}
        </div>
      </div>

      {showProgress && (
        isNotStarted ? (
          <p className="text-xs text-right">
            Empieza el {getNaturalFormatDate(goal.startingDate)}
          </p>
        ) : (
          <div
            className={cn("h-1.5 w-full rounded-full overflow-hidden mb-1")}
            style={
              isYearly
                ? { backgroundColor: accentColor + "30" }
                : { backgroundColor: "rgb(229, 231, 235)" }
            }
          >
            <div
              className={cn(
                "h-full transition-all duration-1000 ease-out rounded-full",
              )}
              style={{
                width: `${goal.progress}%`,
                backgroundColor: isYearly ? accentColor : "var(--primary)",
              }}
            />
          </div>
        )
      )}
    </div>
  );

  if (onClick) {
    return (
      <button type="button" onClick={onClick} className="w-full text-left cursor-pointer">
        {cardContent}
      </button>
    );
  }

  return (
    <div>
      {cardContent}
    </div>
  );
};
