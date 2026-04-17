import { CalendarIcon } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Calendar } from '@/components/ui/calendar'
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover'

const formatShortDate = (date: Date): string =>
    date.toLocaleDateString('es-ES', { day: '2-digit', month: 'short', year: 'numeric' })

interface DatePickerProps {
    value?: Date
    onChange: (date: Date | undefined) => void
    placeholder?: string
}

export const DatePicker = ({
    value,
    onChange,
    placeholder = 'Seleccionar fecha',
}: DatePickerProps) => (
    <Popover>
        <PopoverTrigger asChild>
            <Button variant="outline" size="sm" className="gap-1.5">
                <CalendarIcon className="size-4" />
                {value ? formatShortDate(value) : placeholder}
            </Button>
        </PopoverTrigger>
        <PopoverContent className="w-auto p-0" align="end">
            <Calendar
                mode="single"
                selected={value}
                onSelect={onChange}
            />
        </PopoverContent>
    </Popover>
)
