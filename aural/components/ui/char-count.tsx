import React, { forwardRef } from "react"
import { cn } from "../../lib/utils"

interface CharCountProps {
  currentLength: number
  maxLength?: number
  className?: string
  "aria-live"?: "polite" | "assertive" | "off"
  id?: string
}

const CharCount = forwardRef<HTMLSpanElement, CharCountProps>(
  (
    {
      currentLength,
      maxLength,
      className = "",
      "aria-live": ariaLive = "polite",
      id,
    },
    ref
  ) => {
    // Determine if we should show warning/error styling
    const isNearLimit = maxLength && currentLength > maxLength * 0.9
    const isOverLimit = maxLength && currentLength > maxLength

    return (
      <span
        ref={ref}
        id={id}
        className={cn(
          "leading-fm-sm font-fm-brand [font-size:var(--text-fm-sm)] tracking-wide uppercase",
          {
            "text-fm-warning": isNearLimit && !isOverLimit,
            "text-fm-negative": isOverLimit,
            "text-fm-tertiary": !isNearLimit && !isOverLimit,
          },
          className
        )}
        aria-live={ariaLive}
      >
        {maxLength ? `${currentLength}/${maxLength}` : currentLength}
      </span>
    )
  }
)
CharCount.displayName = "CharCount"

export default CharCount
export { CharCount }
export type { CharCountProps }
