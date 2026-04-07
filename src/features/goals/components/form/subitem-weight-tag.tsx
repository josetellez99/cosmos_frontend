interface SubitemWeightTagProps {
    weight: number
}

export function SubitemWeightTag({ weight }: SubitemWeightTagProps) {
    return (
        <span className="absolute -top-2 left-4 z-10 bg-primary text-white text-xs px-2 py-0.5 rounded-full border border-white shadow-sm">
            {weight}%
        </span>
    )
}
