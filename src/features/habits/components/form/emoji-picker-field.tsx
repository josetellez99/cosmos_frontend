import { useState } from "react"
import { Controller, type Control } from "react-hook-form"
import { Typography } from "@/components/ui/typography"
import { Button } from "@/components/ui/button"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { EMOJI_LIST } from "@/features/habits/constants/emoji-list"

interface EmojiPickerFieldProps {
    name: string
    control: Control<any> // eslint-disable-line @typescript-eslint/no-explicit-any -- same pattern as WeightInput
    label: string
}

export function EmojiPickerField({ name, control, label }: EmojiPickerFieldProps) {
    const [open, setOpen] = useState(false)

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                        <Typography variant="p">{label}</Typography>
                    </FieldLabel>
                    <Popover open={open} onOpenChange={setOpen}>
                        <PopoverTrigger asChild>
                            <Button
                                id={field.name}
                                type="button"
                                variant="outline"
                                size="icon"
                                className="text-2xl"
                            >
                                {field.value || "🎯"}
                            </Button>
                        </PopoverTrigger>
                        <PopoverContent className="w-80 max-h-64 overflow-y-auto p-2" align="start">
                            <div className="grid grid-cols-8 gap-1">
                                {EMOJI_LIST.map((emoji) => (
                                    <button
                                        key={emoji}
                                        type="button"
                                        onClick={() => {
                                            field.onChange(emoji)
                                            setOpen(false)
                                        }}
                                        className="cursor-pointer p-1 rounded-md text-xl hover:bg-primary/10 default-animation"
                                    >
                                        {emoji}
                                    </button>
                                ))}
                            </div>
                        </PopoverContent>
                    </Popover>
                    {fieldState.invalid && (
                        <FieldError>{fieldState.error?.message}</FieldError>
                    )}
                </Field>
            )}
        />
    )
}
