import { useState, memo } from "react"
import { Controller, type Control } from "react-hook-form"
import { Typography } from "@/components/ui/typography"
import { Field, FieldLabel, FieldError } from "@/components/ui/field"
import { Popover, PopoverTrigger, PopoverContent } from "@/components/ui/popover"
import { EMOJIS } from "@/features/habits/constants/emoji-list"
import { cn } from "@/helpers/cn-tailwind"

interface EmojiPickerFieldProps {
    name: string
    control: Control<any> // eslint-disable-line @typescript-eslint/no-explicit-any -- same pattern as WeightInput
    label: string
}

function getFlagImageUrl(emoji: string): string | null {
    const chars = [...emoji]
    if (chars.length !== 2) return null
    const codePoints = chars.map(c => c.codePointAt(0) ?? 0)
    if (!codePoints.every(cp => cp >= 0x1F1E6 && cp <= 0x1F1FF)) return null
    const cc = codePoints
        .map(cp => String.fromCodePoint(cp - 0x1F1E6 + 0x41))
        .join("")
        .toLowerCase()
    return `https://flagcdn.com/w20/${cc}.png`
}

interface CategoryGridProps {
    category: { name: string; emojis: string[] }
    onSelect: (emoji: string) => void
}

const CategoryGrid = memo(function CategoryGrid({ category, onSelect }: CategoryGridProps) {
    return (
        <div className="grid grid-cols-8 gap-1">
            {category.emojis.map((emoji, index) => {
                const flagUrl = getFlagImageUrl(emoji)
                return (
                    <button
                        key={`${category.name}-${index}`}
                        type="button"
                        onClick={() => onSelect(emoji)}
                        className="cursor-pointer p-1 rounded-md hover:bg-primary/10 default-animation flex items-center justify-center w-8 h-8"
                    >
                        {flagUrl ? (
                            <img src={flagUrl} alt={emoji} className="w-5 h-auto" loading="lazy" />
                        ) : (
                            <span className="text-xl">{emoji}</span>
                        )}
                    </button>
                )
            })}
        </div>
    )
})

export function EmojiPickerField({ name, control, label }: EmojiPickerFieldProps) {
    const [open, setOpen] = useState(false)
    const [activeCategory, setActiveCategory] = useState(0)

    return (
        <Controller
            name={name}
            control={control}
            render={({ field, fieldState }) => (
                <Field data-invalid={fieldState.invalid}>
                    <FieldLabel htmlFor={field.name}>
                        <Typography variant="p">{label}</Typography>
                    </FieldLabel>
                    <div className="flex items-center gap-2">
                        <Popover open={open} onOpenChange={setOpen}>
                            <PopoverTrigger asChild>
                                <button
                                    id={field.name}
                                    type="button"
                                    className="text-2xl rounded-md p-1 hover:bg-primary/10 default-animation leading-none"
                                >
                                    {field.value || "🎯"}
                                </button>
                            </PopoverTrigger>
                            <PopoverContent className="w-80 p-2" align="start">
                                <div className="flex gap-1 border-b pb-2 mb-2 flex-wrap">
                                    {EMOJIS.map((cat, i) => (
                                        <button
                                            key={cat.name}
                                            type="button"
                                            title={cat.name}
                                            onClick={() => setActiveCategory(i)}
                                            className={cn(
                                                "p-1 rounded-md text-lg hover:bg-primary/10 default-animation",
                                                activeCategory === i && "bg-primary/10"
                                            )}
                                        >
                                            {cat.cover}
                                        </button>
                                    ))}
                                </div>
                                <div className="max-h-48 overflow-y-auto">
                                    <CategoryGrid
                                        category={EMOJIS[activeCategory]}
                                        onSelect={(emoji) => {
                                            field.onChange(emoji)
                                            setOpen(false)
                                        }}
                                    />
                                </div>
                            </PopoverContent>
                        </Popover>
                    </div>
                    {fieldState.invalid && (
                        <FieldError>{fieldState.error?.message}</FieldError>
                    )}
                </Field>
            )}
        />
    )
}
