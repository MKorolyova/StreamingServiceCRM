"use client"

import { Separator as SeparatorPrimitive } from "@base-ui/react/separator"
import { cn } from "cn"

function Separator({
  className,
  orientation = "horizontal",
  variant = "solid",
  ...props
}: SeparatorPrimitive.Props & { variant?: "solid" | "dashed" }) {
  return (
    <SeparatorPrimitive
      data-slot="separator"
      data-variant={variant}
      orientation={orientation}
      className={cn(
        "shrink-0 border-border data-horizontal:h-px data-horizontal:w-full data-vertical:w-px data-vertical:self-stretch data-[variant=dashed]:border-dashed data-[variant=dashed]:data-horizontal:border-t data-[variant=dashed]:data-vertical:border-l data-[variant=solid]:bg-border",
        className
      )}
      {...props}
    />
  )
}

export { Separator }
