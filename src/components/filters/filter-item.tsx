import type { LucideIcon } from 'lucide-react'
import { ChevronLeft } from 'lucide-react'
import { Typography } from '@/components/ui/typography'
import { cn } from '@/helpers/cn-tailwind'
import { useFilterContainerContext } from '@/components/filters/filter-context'

interface FilterItemProps {
  id: string
  icon: LucideIcon
  label: string
  isActive: boolean
  children: React.ReactNode
}

export const FilterItem = ({ id, icon: Icon, label, isActive, children }: FilterItemProps) => {
  const { activeFilter, setActiveFilter } = useFilterContainerContext()

  if (activeFilter !== null && activeFilter !== id) return null

  if (activeFilter === id) {
    return (
      <div>
        <button
          type="button"
          onClick={() => setActiveFilter(null)}
          className="flex items-center gap-2 px-3 py-2.5 w-full cursor-pointer transition-colors hover:bg-accent"
        >
          <ChevronLeft className="size-3.5 text-[var(--color-medium-gray)]" />
          <Icon className={cn('size-3.5', isActive ? 'text-[var(--primary)]' : 'text-[var(--color-medium-gray)]')} />
          <Typography as="p" className="text-[var(--color-medium-gray)]">{label}</Typography>
        </button>
        <div className="border-t border-border" />
        {children}
      </div>
    )
  }

  return (
    <button
      type="button"
      onClick={() => setActiveFilter(id)}
      className="flex items-center gap-2 px-4 py-2.5 w-full cursor-pointer transition-colors hover:bg-accent"
    >
      <Icon className={cn('size-3.5', isActive ? 'text-[var(--primary)]' : 'text-[var(--color-medium-gray)]')} />
      <Typography as="p" className={cn('text-[var(--color-medium-gray)]', isActive && 'font-bold text-[var(--primary)]')}>{label}</Typography>
    </button>
  )
}
