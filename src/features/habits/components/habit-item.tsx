import { Typography } from "@/components/ui/typography";
import type { HabitSummaryResponse } from "@/features/habits/types/response/habits";
import { cn } from "@/helpers/cn-tailwind";
import { Link } from "react-router";
import { Check } from "lucide-react";
import { getStrengthenColor } from "@/helpers/strings/colors/get-strengthen-color";
import { getColorByProgress } from "@/helpers/strings/colors/get-color-by-progress";
import { useState } from "react";

interface props {
  habit: HabitSummaryResponse;
  allowCheck: boolean;
  isNested: boolean;
}

export const HabitItem = ({ habit, allowCheck, isNested }: props) => {

  const [isChecked, setIsChecked] = useState(false)

  const hasProgress = habit.progress !== undefined

    let progress_bg_color;
    let progress_border_color;
    let progress_accent_color;

    if (hasProgress) {
        progress_bg_color = getColorByProgress(habit.progress);
        progress_border_color = getStrengthenColor(progress_bg_color, 0.2);
        progress_accent_color = getStrengthenColor(progress_bg_color, 0.9);
    }

  const onToggle = () => {
    setIsChecked(prev => !prev)
  };

  return (
    <Link
      to={`/habitos/${habit.id}`}
      className="hover:opacity-70 transition-opacity truncate"
    >
      <div
      className={cn(
        "flex default-card-rounded items-center default-card-padding justify-between default-animation cursor-pointer",
        isNested
          ? ""
          : "bg-white border border-soft-gray",
        !isNested && isChecked && "bg-success/10 border-success/80 shadow-none",
      )}
    >
      <div className="flex items-center gap-3 flex-1">
        <span className="text-xl flex-shrink-0">{habit.emoji}</span>
        <div className="flex flex-col flex-1 min-w-0">
          <div className="flex items-center justify-between gap-2 pr-4">
          <div className="flex-1 min-w-0">
              <Typography className="group-hover:text-primary">
                  {habit.name}
              </Typography>
          </div>
            <div className="text-right">
              {hasProgress && (
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
              )}
            </div>
          </div>
        </div>
      </div>

      {/* {allowCheck && (
        <button
        onClick={onToggle}
        className={cn(
          "w-8 h-8 rounded-lg border flex items-center justify-center transition-all duration-300 cursor-pointer flex-shrink-0",
          isChecked
            ? "bg-green-500 border-green-500 text-white shadow-sm shadow-green-200"
            : "border-gray-200 hover:border-gray-300 bg-white active:scale-90",
        )}
      >
        <Check
          className={cn(
            "w-4 h-4 stroke-[3] transition-all",
            isChecked ? "scale-100 rotate-0" : "scale-0 rotate-45",
          )}
        />
      </button>
      )} */}
    </div>
    </Link>
  );
};
