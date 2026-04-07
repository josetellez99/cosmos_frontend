import { CheckCircle2, AlertCircle } from "lucide-react"
import { Typography } from "@/components/ui/typography"
import { cn } from "@/helpers/cn-tailwind"

export type FormStatusState =
    | { kind: "idle" }
    | { kind: "success"; message: string }
    | { kind: "error"; message: string }

interface props {
    state: FormStatusState
}

export const FormStatus = ({ state }: props) => {
    if (state.kind === "idle") return null

    const isSuccess = state.kind === "success"
    const Icon = isSuccess ? CheckCircle2 : AlertCircle

    return (
        <div
            role={isSuccess ? "status" : "alert"}
            className={cn(
                "flex items-center gap-2 rounded-md border px-3 py-2",
                isSuccess
                    ? "border-success/40 bg-success/10 text-success"
                    : "border-destructive/40 bg-destructive/10 text-destructive"
            )}
        >
            <Icon className="size-4 shrink-0" />
            <Typography variant="p">{state.message}</Typography>
        </div>
    )
}
