import { Calendar } from '@/components/ui/calendar'
import { Button } from '@/components/ui/button'
import { useFilterContainerContext } from '@/components/filters/filter-context'
import type { DateRange } from 'react-day-picker'

type FilterCalendarProps = {
  onClear: () => void
} & (
  | { mode: 'single'; value?: Date; onChange: (date: Date | undefined) => void }
  | { mode: 'range'; from?: Date; to?: Date; onChange: (range: { from?: Date; to?: Date }) => void }
)

export const FilterCalendar = (props: FilterCalendarProps) => {
  const { mode, onClear } = props
  const { close } = useFilterContainerContext()

  const handleClear = () => {
    onClear()
    close()
  }

  return (
    <div>
      {mode === 'single' ? (
        <Calendar
          mode="single"
          selected={props.value}
          onSelect={(date) => {
            props.onChange(date)
            if (date) close()
          }}
        />
      ) : (
        <Calendar
          mode="range"
          selected={props.from ? { from: props.from, to: props.to } as DateRange : undefined}
          onSelect={(range) => {
            props.onChange({ from: range?.from, to: range?.to })
            if (props.from && range?.from && range?.to) close()
          }}
        />
      )}
      <div className="p-3 border-t border-border">
        <Button variant="ghost" size="sm" className="w-full text-muted-foreground" onClick={handleClear}>
          Limpiar
        </Button>
      </div>
    </div>
  )
}
