import React, { forwardRef } from "react"
import { FeatureShineIcon } from "../../icons/feature-shine-icon"
import { cn } from "../../lib/utils"
import { cva } from "class-variance-authority"

// Define the props interface for the Tag component
interface TagProps {
  variant?: "promotional" | "system"
  color?:
    | "neutral"
    | "info"
    | "positive"
    | "negative"
    | "warning"
    | "lemon"
    | "emerald"
    | "hotpink"
    | "electricblue"
    | "neongreen"
  emphasis?: "primary" | "secondary" | "tertiary"
  className?: string
  size?: "xs" | "sm" | "md"
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  children: React.ReactNode
  iconProps?: React.SVGProps<SVGSVGElement>
  id?: string
}

// Create the tag variants using class-variance-authority
export const tagVariants = cva(
  "inline-flex items-center justify-center gap-fm-md py-fm-md px-fm-lg uppercase gap-1 font-fm-brand",
  {
    variants: {
      variant: {
        promotional: "",
        system: "",
      },
      color: {
        neutral: "",
        info: "",
        positive: "",
        negative: "",
        warning: "",
        lemon: "",
        emerald: "",
        hotpink: "",
        electricblue: "",
        neongreen: "",
      },
      emphasis: {
        primary: "",
        secondary: "",
        tertiary: "",
        "no-fill": "",
      },
      size: {
        xs: "[font-size:var(--text-fm-xs)] tracking-wide",
        sm: "[font-size:var(--text-fm-sm)] tracking-wide",
        md: "[font-size:var(--text-fm-md)] tracking-wider",
      },
    },
    compoundVariants: [
      // Promotional Variants
      // Lemon
      {
        variant: "promotional",
        color: "lemon",
        emphasis: "primary",
        className: "bg-fm-surface-lemon text-fm-contrast",
      },
      {
        variant: "promotional",
        color: "lemon",
        emphasis: "secondary",
        className: "bg-fm-lemon-100 text-fm-lemon-900",
      },
      {
        variant: "promotional",
        color: "lemon",
        emphasis: "tertiary",
        className: "bg-transparent text-fm-tag-lemon",
      },
      // Emerald
      {
        variant: "promotional",
        color: "emerald",
        emphasis: "primary",
        className: "bg-fm-surface-emerald text-fm-contrast",
      },
      {
        variant: "promotional",
        color: "emerald",
        emphasis: "secondary",
        className: "bg-fm-emerald-100 text-fm-emerald-900",
      },
      {
        variant: "promotional",
        color: "emerald",
        emphasis: "tertiary",
        className: "bg-transparent text-fm-tag-emerald",
      },
      // Hot Pink
      {
        variant: "promotional",
        color: "hotpink",
        emphasis: "primary",
        className: "bg-fm-surface-hotpink text-fm-contrast",
      },
      {
        variant: "promotional",
        color: "hotpink",
        emphasis: "secondary",
        className: "bg-fm-hotpink-100 text-fm-hotpink-900",
      },
      {
        variant: "promotional",
        color: "hotpink",
        emphasis: "tertiary",
        className: "bg-transparent text-fm-tag-hotpink",
      },
      // Electric Blue
      {
        variant: "promotional",
        color: "electricblue",
        emphasis: "primary",
        className: "bg-fm-surface-electricblue text-fm-primary",
      },
      {
        variant: "promotional",
        color: "electricblue",
        emphasis: "secondary",
        className: "bg-fm-electricblue-200 text-fm-electricblue-1000",
      },
      {
        variant: "promotional",
        color: "electricblue",
        emphasis: "tertiary",
        className: "bg-transparent text-fm-tag-electricblue",
      },
      // Neon Green
      {
        variant: "promotional",
        color: "neongreen",
        emphasis: "primary",
        className: "bg-fm-surface-neongreen text-fm-contrast",
      },
      {
        variant: "promotional",
        color: "neongreen",
        emphasis: "secondary",
        className: "bg-fm-neongreen-100 text-fm-neongreen-900",
      },
      {
        variant: "promotional",
        color: "neongreen",
        emphasis: "tertiary",
        className: "bg-transparent text-fm-tag-neongreen",
      },

      // System Variants
      // Neutral
      {
        variant: "system",
        color: "neutral",
        emphasis: "primary",
        className: "bg-fm-surface-secondary text-fm-secondary",
      },
      {
        variant: "system",
        color: "neutral",
        emphasis: "secondary",
        className: "bg-fm-surface-secondary text-fm-secondary",
      },
      {
        variant: "system",
        color: "neutral",
        emphasis: "tertiary",
        className: "bg-transparent text-fm-secondary",
      },
      // Info
      {
        variant: "system",
        color: "info",
        emphasis: "primary",
        className: "bg-fm-surface-info text-fm-contrast",
      },
      {
        variant: "system",
        color: "info",
        emphasis: "secondary",
        className: "bg-fm-surface-info-sec text-fm-info-sec",
      },
      {
        variant: "system",
        color: "info",
        emphasis: "tertiary",
        className: "bg-transparent text-fm-info",
      },
      // Positive
      {
        variant: "system",
        color: "positive",
        emphasis: "primary",
        className: "bg-fm-surface-positive text-fm-contrast",
      },
      {
        variant: "system",
        color: "positive",
        emphasis: "secondary",
        className: "bg-fm-surface-positive-sec text-fm-positive-sec",
      },
      {
        variant: "system",
        color: "positive",
        emphasis: "tertiary",
        className: "bg-transparent text-fm-positive",
      },
      // Negative
      {
        variant: "system",
        color: "negative",
        emphasis: "primary",
        className: "bg-fm-surface-negative text-fm-primary",
      },
      {
        variant: "system",
        color: "negative",
        emphasis: "secondary",
        className: "bg-fm-surface-negative-sec text-fm-negative-tert",
      },
      {
        variant: "system",
        color: "negative",
        emphasis: "tertiary",
        className: "bg-transparent text-fm-negative",
      },
      // Warning
      {
        variant: "system",
        color: "warning",
        emphasis: "primary",
        className: "bg-fm-surface-warning text-fm-contrast",
      },
      {
        variant: "system",
        color: "warning",
        emphasis: "secondary",
        className: "bg-fm-yellow-200 text-fm-yellow-900",
      },
      {
        variant: "system",
        color: "warning",
        emphasis: "tertiary",
        className: "bg-transparent text-fm-warning",
      },
    ],
    defaultVariants: {
      variant: "system",
      color: "neutral",
      emphasis: "primary",
      size: "md",
    },
  }
)

// The Tag component
export const Tag = forwardRef<HTMLSpanElement, TagProps>(
  (
    {
      variant = "system",
      color = "neutral",
      emphasis = "primary",
      size = "md",
      leftIcon = false,
      rightIcon = false,
      className = "",
      children,
      iconProps = {},
      id,
      ...props
    },
    ref
  ) => {
    const renderIcon = (icon: React.ReactNode | boolean) => {
      if (!icon) {
        return null
      }

      if (React.isValidElement(icon)) {
        return icon
      }

      return (
        <FeatureShineIcon
          height={size === "xs" ? 10 : size === "sm" ? 12 : 14}
          width={size === "xs" ? 10 : size === "sm" ? 12 : 14}
          color="currentColor"
          {...iconProps}
        />
      )
    }

    return (
      <span
        className={cn(
          tagVariants({ variant, color, emphasis, size }),
          className
        )}
        ref={ref}
        id={id}
        {...props}
      >
        {renderIcon(leftIcon)}
        {children}
        {renderIcon(rightIcon)}
      </span>
    )
  }
)
