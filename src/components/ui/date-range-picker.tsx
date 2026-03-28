import { CalendarIcon } from 'lucide-react'
import type { DateRange } from 'react-day-picker'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'
import { cn } from '@/helpers/cn-tailwind'

const formatShortDate = (date: Date): string =>
  date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })

interface DateRangePickerProps {
  from?: Date
  to?: Date
  onChange: (range: { from?: Date; to?: Date }) => void
  placeholder?: string
}

export const DateRangePicker = ({
  from,
  to,
  onChange,
  placeholder = 'Seleccionar rango de fechas',
}: DateRangePickerProps) => {

  const selected: DateRange | undefined = from ? { from, to } : undefined

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button
          variant="outline"
          className={cn(
            'w-full justify-start text-left font-normal',
            !from && 'text-muted-foreground'
          )}
        >
          <CalendarIcon className="size-4" />
          {from ? (
            to ? (
              <>
                {formatShortDate(from)} – {formatShortDate(to)}
              </>
            ) : (
              formatShortDate(from)
            )
          ) : (
            placeholder
          )}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-auto p-0" align="start">
        <Calendar
          mode="range"
          selected={selected}
          onSelect={(range) => onChange({ from: range?.from, to: range?.to })}
          numberOfMonths={2}
        />
      </PopoverContent>
    </Popover>
  )
}
