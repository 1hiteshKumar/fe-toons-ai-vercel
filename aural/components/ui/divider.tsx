import * as React from "react"
import { AudioBarIcon } from "../../icons/audio-bar-icon"
import { cn } from "../../lib/utils"
import * as SeparatorPrimitive from "@radix-ui/react-separator"
import { cva } from "class-variance-authority"

const dividerVariants = cva("flex-auto", {
  variants: {
    variant: {
      primary: "bg-fm-divider-secondary",
      secondary: "bg-fm-divider-tertiary",
      stylised: "bg-fm-divider-primary",
      dashed: "border-fm-divider-primary border-dashed bg-transparent",
    },
    size: {
      half_default: "",
      full_default: "",
      full_medium: "",
      full_large: "",
    },
    orientation: {
      horizontal: "mx-auto",
      vertical: "my-auto",
    },
  },
  compoundVariants: [
    // Horizontal orientation variants
    {
      orientation: "horizontal",
      size: "half_default",
      className: "h-0.25 w-1/2",
    },
    {
      orientation: "horizontal",
      size: "full_default",
      className: "h-0.25 w-full",
    },
    {
      orientation: "horizontal",
      size: "full_medium",
      className: "h-1 w-full",
    },
    {
      orientation: "horizontal",
      size: "full_large",
      className: "h-2 w-full",
    },
    // Vertical orientation variants
    {
      orientation: "vertical",
      size: "half_default",
      className: "h-1/2 w-0.25",
    },
    {
      orientation: "vertical",
      size: "full_default",
      className: "h-full w-0.25",
    },
    {
      orientation: "vertical",
      size: "full_medium",
      className: "h-full w-1",
    },
    {
      orientation: "vertical",
      size: "full_large",
      className: "h-full w-2",
    },
    // Dashed variant specific styles
    {
      variant: "dashed",
      orientation: "horizontal",
      size: "half_default",
      className: "w-1/2 border-t",
    },
    {
      variant: "dashed",
      orientation: "horizontal",
      size: "full_default",
      className: "w-full border-t",
    },
    {
      variant: "dashed",
      orientation: "horizontal",
      size: "full_medium",
      className: "w-full border-t-2",
    },
    {
      variant: "dashed",
      orientation: "horizontal",
      size: "full_large",
      className: "w-full border-t-4",
    },
    {
      variant: "dashed",
      orientation: "vertical",
      size: "half_default",
      className: "h-1/2 border-l",
    },
    {
      variant: "dashed",
      orientation: "vertical",
      size: "full_default",
      className: "h-full border-l",
    },
    {
      variant: "dashed",
      orientation: "vertical",
      size: "full_medium",
      className: "h-full border-l-2",
    },
    {
      variant: "dashed",
      orientation: "vertical",
      size: "full_large",
      className: "h-full border-l-4",
    },
  ],
  defaultVariants: {
    variant: "primary",
    size: "full_default",
    orientation: "horizontal",
  },
})

export interface DividerProps
  extends React.ComponentPropsWithoutRef<typeof SeparatorPrimitive.Root> {
  variant?: "primary" | "secondary" | "stylised" | "dashed"
  size?: "half_default" | "full_default" | "full_medium" | "full_large"
  wrapperClassName?: string
}

const Divider = React.forwardRef<
  React.ElementRef<typeof SeparatorPrimitive.Root>,
  DividerProps
>(
  (
    {
      className,
      orientation = "horizontal",
      decorative = true,
      variant,
      size,
      wrapperClassName,
      ...props
    },
    ref
  ) => {
    return (
      <div
        className={cn(
          {
            "flex items-center justify-center": variant === "stylised",
          },
          wrapperClassName
        )}
      >
        <SeparatorPrimitive.Root
          ref={ref}
          decorative={decorative}
          orientation={orientation}
          className={cn(
            dividerVariants({
              variant,
              size,
              orientation,
            }),
            className
          )}
          {...props}
        />
        {variant === "stylised" && (
          <AudioBarIcon width={52} height={12} className="relative top-0.25" />
        )}
      </div>
    )
  }
)
Divider.displayName = SeparatorPrimitive.Root.displayName

export { Divider }
