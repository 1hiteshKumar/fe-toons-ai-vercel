import React, { ButtonHTMLAttributes, forwardRef } from "react"
import { FeatureShineIcon } from "../../icons/feature-shine-icon"
import { cn } from "../../lib/utils"
import { cva } from "class-variance-authority"

import { withTooltip } from "../ui/tooltip"

export const buttonVariants = cva(
  "group relative font-fm-brand focus-visible:ring-fm-primary focus-visible:ring-offset-fm-contrast outline-none focus-visible:ring-2 focus-visible:ring-offset-6",
  {
    variants: {
      variant: {
        primary:
          "before:absolute before:inset-0 before:rounded-full before:border-[length:var(--stroke-fm-xsm)] before:border-transparent before:[background-image:var(--button-fm-background),linear-gradient(to_top,color-mix(in_srgb,var(--color-fm-primary-600)_50%,_transparent))] text-fm-neutral-1100",
        secondary:
          "before:absolute before:inset-0 rounded-full before:border-[length:var(--stroke-fm-xsm)] before:border-transparent bg-fm-surface-secondary text-fm-primary",
        outline: "text-fm-primary",
        text: "bg-transparent text-fm-secondary-800",
        default: "",
      },
      noise: {
        none: "",
        low: "",
        medium: "",
        strong: "",
      },
      disabled: {
        true: "cursor-not-allowed",
        false: "cursor-pointer",
      },
    },
    defaultVariants: {
      variant: "primary",
      disabled: false,
    },
  }
)

export const innerButtonVariants = cva(
  "flex items-center justify-center gap-2 rounded-full border-[length:var(--stroke-fm-xsm)] border-transparent transition-[_translate,_--gradientSizeX,_--gradientSizeY,_--gradientPositionY]",
  {
    variants: {
      variant: {
        primary:
          "shadow-[0_0_1.5rem_var(--color-fm-primary-400)_inset] group-active:translate-y-0 [--gradientSizeX:50%] [--gradientSizeY:150%] [--gradientPositionY:100%] group-hover:[--gradientSizeX:40%] group-hover:[--gradientSizeY:110%] group-hover:[--gradientPositionY:50%] bg-cover bg-center [background-blend-mode:color-dodge,multiply,darken] duration-300 bg-repeat-x bg-auto bg-center bg-origin-border",
        secondary:
          "group-active:translate-y-0 bg-fm-button-fill-secondary bg-repeat-x bg-auto bg-center bg-origin-border",
        outline:
          "border-[length:var(--stroke-fm-sm)] border-fm-divider-contrast !translate-y-0",
        text: "",
      },
      noise: {
        none: "",
        low: "[background-image:var(--button-fm-noise-low)]",
        medium: "[background-image:var(--button-fm-noise)]",
        strong: "[background-image:var(--button-fm-noise-strong)]",
      },
      disabled: {
        default: "",
        primary:
          "bg-fm-surface-secondary [color:var(--color-fm-inactive)] border-[length:var(--stroke-fm-xsm)] border-fm-divider-tertiary",
        secondary:
          "bg-fm-surface-secondary [color:var(--color-fm-inactive)] border-[length:var(--stroke-fm-xsm)] border-fm-divider-tertiary",
        outline:
          "bg-fm-divider-tertiary [color:var(--color-fm-inactive)] border-[length:var(--stroke-fm-sm)] border-fm-divider-tertiary",
        text: "bg-fm-divider-tertiary [color:var(--color-fm-inactive)] border-[length:var(--stroke-fm-sm)] border-fm-divider-tertiary",
      },
      size: {
        sm: "py-fm-lg px-fm-2xl text-fm-sm -translate-y-1",
        md: "py-fm-xl px-fm-4xl text-fm-md -translate-y-1",
        lg: "py-fm-2xl px-fm-5xl text-fm-xl -translate-y-1.5",
      },
    },
    compoundVariants: [
      {
        variant: "primary",
        noise: "low",
        className:
          "[background-image:var(--button-fm-noise-low),_radial-gradient(ellipse_var(--gradientSizeX)_var(--gradientSizeY)_at_50%_var(--gradientPositionY),_var(--color-fm-primary-600),_var(--color-fm-secondary-300)),_linear-gradient(_to_top,_color-mix(in_srgb,var(--color-fm-primary-600)_50%,_transparent),_color-mix(in_srgb,var(--color-fm-primary-200)_50%,_transparent))]",
      },
      {
        variant: "primary",
        noise: "medium",
        className:
          "[background-image:var(--button-fm-noise),_radial-gradient(ellipse_var(--gradientSizeX)_var(--gradientSizeY)_at_50%_var(--gradientPositionY),_var(--color-fm-primary-600),_var(--color-fm-secondary-300)),_linear-gradient(_to_top,_color-mix(in_srgb,var(--color-fm-primary-600)_50%,_transparent),_color-mix(in_srgb,var(--color-fm-primary-200)_50%,_transparent))]",
      },
      {
        variant: "primary",
        noise: "strong",
        className:
          "[background-image:var(--button-fm-noise-strong),_radial-gradient(ellipse_var(--gradientSizeX)_var(--gradientSizeY)_at_50%_var(--gradientPositionY),_var(--color-fm-primary-600),_var(--color-fm-secondary-300)),_linear-gradient(_to_top,_color-mix(in_srgb,var(--color-fm-primary-600)_50%,_transparent),_color-mix(in_srgb,var(--color-fm-primary-200)_50%,_transparent))]",
      },
      {
        variant: "secondary",
        noise: "low",
        className: "[background-image:var(--button-fm-noise-low)]",
      },
      {
        variant: "secondary",
        noise: "medium",
        className: "[background-image:var(--button-fm-noise)]",
      },
      {
        variant: "secondary",
        noise: "strong",
        className: "[background-image:var(--button-fm-noise-strong)]",
      },
    ],
    defaultVariants: {
      variant: "primary",
      disabled: "default",
      size: "md",
      noise: "medium",
    },
  }
)

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: React.ReactNode
  className?: string
  leftIcon?: React.ReactNode
  rightIcon?: React.ReactNode
  iconProps?: React.SVGProps<SVGSVGElement>
  innerClassName?: string
  isDisabled?: boolean
  size?: "sm" | "md" | "lg"
  variant?: "primary" | "secondary" | "outline" | "text"
  noise?: "none" | "low" | "medium" | "strong"
}

export const RawButton = forwardRef<HTMLButtonElement, ButtonProps>(
  (
    {
      variant = "primary",
      size = "md",
      noise = "medium",
      children,
      className = "",
      innerClassName = "",
      isDisabled = false,
      leftIcon,
      rightIcon,
      iconProps = {},
      ...props
    },
    ref
  ) => {
    const iconColor = isDisabled
      ? "var(--icon-fm-inactive)"
      : variant === "text"
        ? "var(--color-fm-secondary-800)"
        : "var(--color-fm-primary)"

    const renderIcon = (icon: React.ReactNode) => {
      if (!icon) {
        return null
      }

      if (React.isValidElement(icon)) {
        return React.cloneElement(icon, {
          color: iconColor,
          className: cn(
            "h-4 w-4",
            (icon.props as React.SVGProps<SVGSVGElement>).className
          ),
          ...iconProps,
        })
      }

      return (
        <FeatureShineIcon
          height={12}
          width={12}
          color={iconColor}
          {...iconProps}
        />
      )
    }

    return (
      <button
        ref={ref}
        disabled={isDisabled}
        className={cn(
          buttonVariants({
            variant: isDisabled ? "default" : variant,
            disabled: isDisabled,
          }),
          className
        )}
        {...props}
      >
        <span
          className={cn(
            innerButtonVariants({
              variant: isDisabled ? "text" : variant,
              disabled: isDisabled ? variant : "default",
              size,
              noise: isDisabled ? "none" : noise,
            }),
            innerClassName
          )}
        >
          {renderIcon(leftIcon)}
          {children}
          {renderIcon(rightIcon)}
        </span>
      </button>
    )
  }
)

RawButton.displayName = "RawButton"

export const Button = withTooltip(RawButton)
