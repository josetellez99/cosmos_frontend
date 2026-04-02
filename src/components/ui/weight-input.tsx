import { Input } from "@/components/ui/input"
import { Typography } from "@/components/ui/typography"

const WEIGHT_PRESETS = [10, 15, 20, 25, 30, 35, 40]

interface WeightInputProps {
    value: number
    onChange: (value: number) => void
    id?: string
    onBlur?: () => void
}

export function WeightInput({ value, onChange, id, onBlur }: WeightInputProps) {
    return (
        <div className="flex flex-col gap-2">
            <div className="relative">
                <Input
                    id={id}
                    type="number"
                    className="pr-8"
                    value={value ?? ''}
                    onChange={e => onChange(e.target.valueAsNumber)}
                    onBlur={onBlur}
                />
                <span className="absolute right-3 top-1/2 -translate-y-1/2 text-sm text-medium-gray pointer-events-none">
                    %
                </span>
            </div>
            <div className="flex flex-wrap gap-1">
                {WEIGHT_PRESETS.map(preset => (
                    <button
                        key={preset}
                        type="button"
                        onClick={() => onChange(preset)}
                        className="cursor-pointer px-2 py-0.5 rounded-md border border-soft-gray bg-primary/10 hover:border-primary hover:text-primary default-animation"
                    >
                        <Typography variant="p" className="text-xs">{preset}%</Typography>
                    </button>
                ))}
            </div>
        </div>
    )
}
