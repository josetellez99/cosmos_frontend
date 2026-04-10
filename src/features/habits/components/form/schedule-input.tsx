import { useEffect, useRef } from "react"
import { Controller, useWatch, useFormContext, type Control } from "react-hook-form"
import { cn } from "@/helpers/cn-tailwind"
import { Typography } from "@/components/ui/typography"
import { Input } from "@/components/ui/input"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Select, SelectTrigger, SelectContent, SelectItem, SelectValue } from "@/components/ui/select"
import type { HabitFormValues } from "@/features/habits/types/form/habit-form"

const SCHEDULE_TYPE_OPTIONS = [
    { value: "each_x_days", label: "Cada x dias" },
    { value: "fixed_weekly_days", label: "Dias fijos de la semana" },
    { value: "fixed_calendar_days", label: "Dias fijos al mes" },
] as const

const WEEKDAY_LABELS = [
    { value: 1, label: "Lun" },
    { value: 2, label: "Mar" },
    { value: 3, label: "Mie" },
    { value: 4, label: "Jue" },
    { value: 5, label: "Vie" },
    { value: 6, label: "Sab" },
    { value: 7, label: "Dom" },
] as const

const CALENDAR_DAYS = Array.from({ length: 31 }, (_, i) => i + 1)

interface ScheduleInputProps {
    control: Control<HabitFormValues>
}

export function ScheduleInput({ control }: ScheduleInputProps) {
    const { setValue } = useFormContext<HabitFormValues>()
    const scheduleType = useWatch({ control, name: "scheduleType" })
    const isFirstRender = useRef(true)

    useEffect(() => {
        if (isFirstRender.current) {
            isFirstRender.current = false
            return
        }
        if (scheduleType === "each_x_days") {
            setValue("scheduleConfig", { days: 1 })
        } else {
            setValue("scheduleConfig", { days: [] })
        }
    }, [scheduleType, setValue])

    return (
        <div className="flex flex-col gap-4">
            <Controller
                name="scheduleType"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        <FieldLabel htmlFor={field.name}>
                            <Typography variant="p">Tipo de programacion</Typography>
                        </FieldLabel>
                        <Select
                            value={field.value}
                            onValueChange={field.onChange}
                        >
                            <SelectTrigger id={field.name}>
                                <SelectValue placeholder="Selecciona un tipo" />
                            </SelectTrigger>
                            <SelectContent>
                                {SCHEDULE_TYPE_OPTIONS.map(option => (
                                    <SelectItem key={option.value} value={option.value}>
                                        {option.label}
                                    </SelectItem>
                                ))}
                            </SelectContent>
                        </Select>
                        {fieldState.invalid && (
                            <FieldError>{fieldState.error?.message}</FieldError>
                        )}
                    </Field>
                )}
            />

            <Controller
                name="scheduleConfig"
                control={control}
                render={({ field, fieldState }) => (
                    <Field data-invalid={fieldState.invalid}>
                        {scheduleType === "each_x_days" && (
                            <>
                                <FieldLabel htmlFor="scheduleConfig-days">
                                    <Typography variant="p">Cada cuantos dias</Typography>
                                </FieldLabel>
                                <Input
                                    id="scheduleConfig-days"
                                    type="number"
                                    min={1}
                                    value={typeof field.value.days === "number" ? field.value.days : 1}
                                    onChange={(e) => field.onChange({ days: parseInt(e.target.value) || 1 })}
                                />
                            </>
                        )}

                        {scheduleType === "fixed_weekly_days" && (
                            <>
                                <FieldLabel>
                                    <Typography variant="p">Dias de la semana</Typography>
                                </FieldLabel>
                                <div className="flex flex-wrap gap-1">
                                    {WEEKDAY_LABELS.map(({ value, label }) => {
                                        const days = Array.isArray(field.value.days) ? field.value.days : []
                                        const isSelected = days.includes(value)
                                        return (
                                            <button
                                                key={value}
                                                type="button"
                                                onClick={() => {
                                                    const next = isSelected
                                                        ? days.filter(d => d !== value)
                                                        : [...days, value].sort((a, b) => a - b)
                                                    field.onChange({ days: next })
                                                }}
                                                className={cn(
                                                    "cursor-pointer px-3 py-1 rounded-md border default-animation",
                                                    isSelected
                                                        ? "bg-primary text-white border-primary"
                                                        : "border-soft-gray bg-primary/10 hover:border-primary hover:text-primary"
                                                )}
                                            >
                                                <Typography variant="p" className="text-xs">{label}</Typography>
                                            </button>
                                        )
                                    })}
                                </div>
                            </>
                        )}

                        {scheduleType === "fixed_calendar_days" && (
                            <>
                                <FieldLabel>
                                    <Typography variant="p">Dias del mes</Typography>
                                </FieldLabel>
                                <div className="grid grid-cols-7 gap-1">
                                    {CALENDAR_DAYS.map((day) => {
                                        const days = Array.isArray(field.value.days) ? field.value.days : []
                                        const isSelected = days.includes(day)
                                        return (
                                            <button
                                                key={day}
                                                type="button"
                                                onClick={() => {
                                                    const next = isSelected
                                                        ? days.filter(d => d !== day)
                                                        : [...days, day].sort((a, b) => a - b)
                                                    field.onChange({ days: next })
                                                }}
                                                className={cn(
                                                    "cursor-pointer px-2 py-1 rounded-md border default-animation",
                                                    isSelected
                                                        ? "bg-primary text-white border-primary"
                                                        : "border-soft-gray bg-primary/10 hover:border-primary hover:text-primary"
                                                )}
                                            >
                                                <Typography variant="p" className="text-xs">{day}</Typography>
                                            </button>
                                        )
                                    })}
                                    <button
                                        type="button"
                                        onClick={() => {
                                            const days = Array.isArray(field.value.days) ? field.value.days : []
                                            const isSelected = days.includes(-1)
                                            const next = isSelected
                                                ? days.filter(d => d !== -1)
                                                : [...days, -1].sort((a, b) => a - b)
                                            field.onChange({ days: next })
                                        }}
                                        className={cn(
                                            "cursor-pointer px-2 py-1 rounded-md border default-animation col-span-3",
                                            Array.isArray(field.value.days) && field.value.days.includes(-1)
                                                ? "bg-primary text-white border-primary"
                                                : "border-soft-gray bg-primary/10 hover:border-primary hover:text-primary"
                                        )}
                                    >
                                        <Typography variant="p" className="text-xs">Ultimo dia</Typography>
                                    </button>
                                </div>
                            </>
                        )}

                        {fieldState.invalid && (
                            <FieldError>{fieldState.error?.message}</FieldError>
                        )}
                    </Field>
                )}
            />
        </div>
    )
}
