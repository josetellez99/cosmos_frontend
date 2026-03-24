"use client";

import { cn } from "@/lib/utils";
import { Link } from "react-router";
import { Typography } from "@/components/ui/typography";
import type { GoalSummaryResponse } from "@/features/goals/types/response/user-goals";
import { strengthenColor } from "@/helpers/getStrengthenColor";
import { appRoutes } from "@/lib/constants/routes";
import { goalTemporality } from "@/lib/constants/goals_temporalities";
import { getNaturalFormatDate } from "@/helpers/dates"
import { goalStatus } from "@/lib/constants/goals_status";

interface props {
  goal: GoalSummaryResponse;
}

export const GoalItem = ({ goal }: props) => {

  const isYearly = goal.temporality === goalTemporality.YEAR;
  const isNotStarted = goal.status === goalStatus.NOT_STARTED;
  const isCompleted = goal.status === goalStatus.COMPLETED;

  const borderColor = isYearly ? strengthenColor(goal.color, 0.08) : undefined;
  const accentColor = isYearly ? strengthenColor(goal.color, 0.9) : undefined;
  const textColor = isYearly ? strengthenColor(goal.color, 0.95) : undefined;

  return (
    <Link to={`/${appRoutes.GOALS}/${goal.id}`}>
      <div
        className={cn(
          "p-4 default-card-rounded",
          !isYearly && "bg-white border border-gray-200",
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
        <div className="flex justify-between items-center mb-3">
          <div className="flex items-center gap-2.5">
            <Typography
              className="font-semibold text-xs"
              style={isYearly ? { color: textColor } : undefined}
            >
              {goal.name}
            </Typography>
          </div>

          {!isNotStarted && (
            <div className="flex items-center gap-3">
              {isCompleted ? (
                <span className="text-xs font-semibold text-green-600 flex items-center gap-1">
                  <span className="animate-pulse">●</span> Completada
                </span>
              ) : (
                <span
                  style={{
                    color: isYearly ? accentColor : "var(--primary)",
                    backgroundColor: "white",
                    borderRadius: "40%",
                    paddingInline: "8px",
                    paddingBlock: "4px",
                    display: "inline-flex",
                    alignItems: "center",
                    justifyContent: "center",
                  }}
                  className={cn("text-xs font-semibold")}
                >
                  {goal.progress}%
                </span>
              )}
            </div>
          )}
        </div>

        {isNotStarted ? (
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
        )}
      </div>
    </Link>
  );
};
