import * as React from "react"
import { cva, type VariantProps } from "class-variance-authority"
import { cn } from "@/lib/utils"

const typographyVariants = cva(
    "text-foreground",
    {
        variants: {
            variant: {
                h1: "scroll-m-20 text-3xl bold tracking-tight lg:text-4xl",
                h2: "scroll-m-20 border-b pb-2 text-3xl font-semibold tracking-tight first:mt-0",
                h3: "scroll-m-20 font-semibold mb-4",
                p: "leading-4 text-sm",
            },
        },
        defaultVariants: {
            variant: "p",
        },
    }
)

type TypographyTag = "h1" | "h2" | "h3" | "p"

export interface TypographyProps
    extends React.HTMLAttributes<HTMLElement>,
    VariantProps<typeof typographyVariants> {
    as?: TypographyTag
}

const Typography = React.forwardRef<any, TypographyProps>(
    ({ className, variant, as, ...props }, ref) => {
        // Determine the tag: use 'as' prop if provided, otherwise default to variant name
        // (if variant is 'h1', use 'h1' tag; if variant is 'p', use 'p' tag)
        const Component = as || (variant as TypographyTag) || "p"

        return (
            <Component
                className={cn(typographyVariants({ variant, className }))}
                ref={ref}
                {...props}
            />
        )
    }
)
Typography.displayName = "Typography"

export { Typography, typographyVariants }
