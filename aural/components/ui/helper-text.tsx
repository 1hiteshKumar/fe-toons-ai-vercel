import React, { forwardRef, ReactNode } from "react"
import { Case, Default, SwitchCase } from "./switch-case"
import { Tag } from "./tag"
import { AlertIcon } from "../../icons/alert-icon"
import { CrossCircleIcon } from "../../icons/cross-circle-icon"
import { TickCircleIcon } from "../../icons/tick-circle-icon"
import { cn } from "../../lib/utils"

type HelperTextVariant = "default" | "error" | "warning" | "success"

interface HelperTextProps {
  variant?: HelperTextVariant
  className?: string
  children: ReactNode
  disabled?: boolean
  id?: string
}

const HelperText = forwardRef<HTMLSpanElement, HelperTextProps>(
  ({ variant = "default", className = "", children, disabled, id }, ref) => {
    return (
      <SwitchCase value={variant}>
        <Case value="error">
          <Tag
            className={cn("w-full justify-normal normal-case", className)}
            ref={ref}
            variant="system"
            leftIcon={
              <span className="inline-block w-4">
                <CrossCircleIcon color="var(--color-fm-icon-negative)" />
              </span>
            }
            size="sm"
            color="negative"
            id={id}
          >
            {children}
          </Tag>
        </Case>
        <Case value="warning">
          <Tag
            className={cn("w-full justify-normal normal-case", className)}
            ref={ref}
            variant="system"
            leftIcon={
              <span className="inline-block w-4">
                <AlertIcon color="var(--color-fm-icon-contrast)" />
              </span>
            }
            size="sm"
            color="warning"
            id={id}
          >
            {children}
          </Tag>
        </Case>
        <Case value="success">
          <Tag
            className={cn("w-full justify-normal normal-case", className)}
            ref={ref}
            variant="system"
            leftIcon={
              <span className="inline-block w-4">
                <TickCircleIcon color="var(--color-fm-icon-positive)" />
              </span>
            }
            size="sm"
            color="positive"
            id={id}
          >
            {children}
          </Tag>
        </Case>
        <Default>
          <Tag
            className={cn(
              "w-full justify-normal !px-0 normal-case",
              {
                "text-fm-inactive": disabled,
                "text-fm-tertiary": !disabled,
              },
              className
            )}
            ref={ref}
            variant="system"
            emphasis="tertiary"
            leftIcon={false}
            size="sm"
            id={id}
          >
            {children}
          </Tag>
        </Default>
      </SwitchCase>
    )
  }
)
HelperText.displayName = "HelperText"

export default HelperText
export { HelperText }
export type { HelperTextProps, HelperTextVariant }
