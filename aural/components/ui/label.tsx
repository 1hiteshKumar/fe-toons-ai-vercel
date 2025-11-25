import React, {
  ComponentPropsWithoutRef,
  ElementRef,
  forwardRef,
  ReactNode,
} from "react"
import { If } from "./if-else"
import { cn } from "../../lib/utils"
import * as LabelPrimitive from "@radix-ui/react-label"

export interface LabelProps {
  htmlFor?: string
  className?: string
  children: ReactNode
  disabled?: boolean
  required?: boolean
}

export const Label = forwardRef<
  ElementRef<typeof LabelPrimitive.Root>,
  ComponentPropsWithoutRef<typeof LabelPrimitive.Root> & LabelProps
>(({ className, disabled, children, required, ...props }, ref) => (
  <LabelPrimitive.Root
    ref={ref}
    className={cn(
      "leading-fm-xs font-fm-brand flex items-center gap-2 [font-size:var(--text-fm-sm)] tracking-wider uppercase",
      {
        "text-fm-inactive": disabled,
        "text-fm-primary": !disabled,
      },
      className
    )}
    {...props}
  >
    {children}
    <If condition={required}>
      <sup className="text-current">*</sup>
    </If>
  </LabelPrimitive.Root>
))
Label.displayName = LabelPrimitive.Root.displayName

export default Label
