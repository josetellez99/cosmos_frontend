import { Typography } from "@/components/ui/typography"
import type { HabitSummaryResponse } from "@/features/habits/types/response/habits"

interface props {
  habit: HabitSummaryResponse
}

export const HabitItem = ({ habit }: props) => {
  return (
    <div className="default-card-padding default-card-rounded bg-white border border-soft-gray">
      <Typography className="font-semibold text-sm">
        {habit.emoji} {habit.name}
      </Typography>
    </div>
  )
}
