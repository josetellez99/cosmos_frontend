import { colors_progress_config } from "@/lib/constants/global_constants"

export const getColorByProgress = (progress: number): string => {
  const thresholds = Object.entries(colors_progress_config)
    .sort(([keyA], [keyB]) => Number(keyA) - Number(keyB))

  const entry = thresholds.find(([threshold]) => progress <= Number(threshold))
  return entry?.[1] ?? ''
}