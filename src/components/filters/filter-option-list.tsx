import { CheckIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/helpers/cn-tailwind'
import { useFilterContainerContext } from '@/components/filters/filter-context'

interface FilterOption {
  value: string
  label: string
}

interface FilterOptionListProps {
  options: FilterOption[]
  value: string | undefined
  onSelect: (value: string) => void
  onClear: () => void
}

export const FilterOptionList = ({ options, value, onSelect, onClear }: FilterOptionListProps) => {
  const { close } = useFilterContainerContext()

  const handleSelect = (optionValue: string) => {
    onSelect(optionValue)
    close()
  }

  const handleClear = () => {
    onClear()
    close()
  }

  return (
    <div className="flex flex-col p-2">
      <ul className="flex flex-col gap-0.5">
        {options.map(option => {
          const isSelected = option.value === value
          return (
            <li key={option.value}>
              <button
                type="button"
                onClick={() => handleSelect(option.value)}
                className={cn(
                  'flex w-full items-center justify-between rounded-md px-2 py-1.5 text-sm cursor-pointer transition-colors hover:bg-accent',
                  isSelected && 'font-medium text-[var(--primary)]'
                )}
              >
                {option.label}
                {isSelected && <CheckIcon className="size-3.5 text-[var(--primary)]" />}
              </button>
            </li>
          )
        })}
      </ul>
      <div className="border-t border-border my-2" />
      <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={handleClear}>
        Limpiar
      </Button>
    </div>
  )
}
