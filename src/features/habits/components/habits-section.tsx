import { useHabitsSuspense } from '@/features/habits/hooks'
import { HabitsList } from '@/features/habits/components/habits-list'

export const HabitsSection = () => {
  const { habits } = useHabitsSuspense()
  return <HabitsList habits={habits} fallbackMessage='Ups, no has creado ningún hábito por aquí todavía🎯' />
}
