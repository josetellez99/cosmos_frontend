import { Controller } from "react-hook-form"
import { cn } from "@/helpers/cn-tailwind"
import { Typography } from "@/components/ui/typography"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import type { Control } from "react-hook-form"

const WEIGHT_PRESETS = [5, 10, 15, 20, 25, 30, 35, 40, 45, 50, 55, 60, 65, 70, 75, 80, 85, 90, 95, 100]

interface WeightInputProps {
    name: string
    control: Control<any>
    label: string
}

export function WeightInput({ name, control, label }: WeightInputProps) {
    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                        <Typography variant="p">{label}</Typography>
                    </FieldLabel>
                    <div id={field.name} className="flex flex-wrap gap-1">
                        {WEIGHT_PRESETS.map(preset => (
                            <button
                                key={preset}
                                type="button"
                                onClick={() => field.onChange(preset)}
                                className={cn(
                                    "cursor-pointer px-2 py-0.5 rounded-md border default-animation",
                                    preset === field.value
                                        ? "bg-primary text-white border-primary"
                                        : "border-soft-gray bg-primary/10 hover:border-primary hover:text-primary"
                                )}
                            >
                                <Typography variant="p" className="text-xs">{preset}%</Typography>
                            </button>
                        ))}
                    </div>
                    {fieldState.invalid && (
                        <FieldError>{fieldState.error?.message}</FieldError>
                    )}
                </Field>
            )}
        />
    )
}
