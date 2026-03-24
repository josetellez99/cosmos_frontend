import { Typography } from "@/components/ui/typography"
import type { ReactNode } from "react"

interface props {
    children: ReactNode
}

export const FallbackMessage = ({children}: props) => {
    return (
        <Typography className="text-center text-muted-foreground py-6">
            {children}
        </Typography>
    )
}