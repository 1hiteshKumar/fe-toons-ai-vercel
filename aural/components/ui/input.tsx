import React, {
  forwardRef,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
  useState,
} from "react"
import CharCount from "./char-count"
import HelperText from "./helper-text"
import { Else, If, IfElse } from "./if-else"
import { Label } from "./label"
import { EyeCloseIcon } from "../../icons/eye-close-icon"
import { EyeOpenIcon } from "../../icons/eye-open-icon"
import { cn } from "../../lib/utils"
import { cva } from "class-variance-authority"

interface InputComponent
  extends ForwardRefExoticComponent<
    InputProps & RefAttributes<HTMLInputElement>
  > {
  Root: typeof InputRoot
  Label: typeof InputLabel
  Wrapper: typeof InputWrapper
  StartIcon: typeof StartIcon
  EndIcon: typeof EndIcon
  PasswordToggle: typeof PasswordToggle
  Base: typeof InputBase
  HelperText: typeof HelperText
  CharCount: typeof CharCount
}

// CVA for input variants
export const inputVariants = cva(
  // Base styles
  "block w-full focus:outline-none transition-all duration-200 border-solid tracking-wide placeholder:text-fm-placeholder font-fm-text text-fm-primary",
  {
    variants: {
      variant: {
        default: "border-fm-divider-primary focus:border-fm-divider-contrast ",
        error: "border-fm-divider-negative focus:border-fm-divider-negative",
        warning: "border-fm-divider-warning focus:border-fm-divider-warning",
        success: "border-fm-divider-positive focus:border-fm-divider-positive",
      },
      decoration: {
        underline: "border-b h-11 leading-fm-xl [font-size:var(--text-fm-xl)]",
        outline:
          "border rounded-fm-s h-12 leading-fm-md [font-size:var(--text-fm-md)] px-3 py-4",
        filled:
          "h-10 rounded-fm-s bg-fm-surface-frosted/20 border leading-fm-md [font-size:var(--text-fm-md)] px-4",
      },
      state: {
        default: "",
        focused: "",
        disabled:
          "border-fm-divider-tertiary !text-fm-inactive cursor-not-allowed",
      },
    },

    defaultVariants: {
      variant: "default",
      state: "default",
      decoration: "underline",
    },
  }
)

// Types
type InputVariant = "default" | "error" | "warning" | "success"
type InputDecoration = "underline" | "outline" | "filled"
type InputProps = {
  label?: ReactNode
  helperText?: ReactNode
  placeholder?: string
  variant?: InputVariant
  disabled?: boolean
  decoration?: InputDecoration
  type?: string
  required?: boolean
  fullWidth?: boolean
  className?: string
  value?: string | number
  defaultValue?: string | number
  autoComplete?: string
  autoFocus?: boolean
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
  onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
  onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
  onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
  ariaLabel?: string
  startIcon?: ReactNode
  endIcon?: ReactNode
  id?: string
  name?: string
  maxLength?: number
  min?: number
  max?: number
  unstyled?: boolean
  transparentOnAutofill?: boolean
  classes?: {
    root?: string
    label?: string
    wrapper?: string
    startIcon?: string
    endIcon?: string
    passwordToggle?: string
    helperText?: string
    characterCounter?: string
    input?: string
  }
}

// Sub-components for atomic design pattern
const InputRoot = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{ className?: string; fullWidth?: boolean }>
>(({ children, className = "", fullWidth = false }, ref) => (
  <div
    ref={ref}
    className={cn(
      {
        "w-full": fullWidth,
      },
      className
    )}
  >
    {children}
  </div>
))
InputRoot.displayName = "InputRoot"

const InputLabel = forwardRef<
  HTMLLabelElement,
  {
    htmlFor?: string
    className?: string
    children: ReactNode
    disabled?: boolean
    required?: boolean
  }
>((props, ref) => {
  return <Label ref={ref} {...props} />
})
InputLabel.displayName = "InputLabel"

const InputWrapper = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{ className?: string }>
>(({ children, className = "" }, ref) => (
  <div ref={ref} className={cn("relative mt-1", className)}>
    {children}
  </div>
))
InputWrapper.displayName = "InputWrapper"

const StartIcon = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{ className?: string }>
>(({ children, className = "" }, ref) => (
  <div
    ref={ref}
    className={cn(
      "pointer-events-none absolute inset-y-0 left-0 flex items-center pl-3",
      className
    )}
  >
    {children}
  </div>
))
StartIcon.displayName = "StartIcon"

const EndIcon = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{ className?: string }>
>(({ children, className = "" }, ref) => (
  <div
    ref={ref}
    className={cn(
      "absolute inset-y-0 right-0 flex items-center pr-3",
      className
    )}
  >
    {children}
  </div>
))
EndIcon.displayName = "EndIcon"

const PasswordToggle = forwardRef<
  HTMLButtonElement,
  {
    isVisible: boolean
    onToggle: () => void
    className?: string
  }
>(({ isVisible, onToggle, className = "" }, ref) => (
  <button
    ref={ref}
    type="button"
    onClick={onToggle}
    className={cn(
      "text-fm-primary hover:text-fm-primary/90 h-full focus:outline-none",
      className
    )}
  >
    <IfElse condition={isVisible}>
      <If>
        <EyeCloseIcon />
      </If>
      <Else>
        <EyeOpenIcon />
      </Else>
    </IfElse>
  </button>
))

PasswordToggle.displayName = "PasswordToggle"

// InputBase component - Core input functionality without any wrapper elements
const InputBase = forwardRef<
  HTMLInputElement,
  {
    variant?: InputVariant
    decoration?: InputDecoration
    disabled?: boolean
    className?: string
    unstyled?: boolean
    ariaLabel?: string
    type?: string
    placeholder?: string
    value?: string | number
    defaultValue?: string | number
    onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void
    onBlur?: (e: React.FocusEvent<HTMLInputElement>) => void
    onFocus?: (e: React.FocusEvent<HTMLInputElement>) => void
    onKeyDown?: (e: React.KeyboardEvent<HTMLInputElement>) => void
    id?: string
    name?: string
    required?: boolean
    maxLength?: number
    startIcon?: boolean // Indicates if start icon spacing should be applied
    endIcon?: boolean // Indicates if end icon spacing should be applied
    transparentOnAutofill?: boolean
  } & Omit<
    React.InputHTMLAttributes<HTMLInputElement>,
    "onChange" | "onBlur" | "onFocus" | "defaultValue"
  >
>(
  (
    {
      variant = "default",
      decoration = "underline",
      disabled = false,
      className = "",
      unstyled = false,
      type = "text",
      placeholder = "",
      value,
      defaultValue,
      onChange,
      onBlur,
      onFocus,
      id,
      name,
      required = false,
      maxLength,
      startIcon = false,
      endIcon = false,
      ariaLabel,
      transparentOnAutofill = false,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false)

    // Handle focus state
    const handleFocus = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(true)
      if (onFocus) onFocus(e)
    }

    // Handle blur state
    const handleBlur = (e: React.FocusEvent<HTMLInputElement>) => {
      setIsFocused(false)
      if (onBlur) onBlur(e)
    }

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      if (onChange) onChange(e)
    }

    // Determine focus state
    const state = disabled ? "disabled" : isFocused ? "focused" : "default"

    const autoFillStyle = transparentOnAutofill
      ? {
          WebkitTextFillColor: "#ffffff",
          color: "#ffffff",
          caretColor: "#ffffff",
          transition: "background-color 999999s ease-in-out 0s",
          backgroundColor: "transparent",
        }
      : {}

    // Apply styles only if not unstyled
    const inputClassName = unstyled
      ? className
      : inputVariants({
          variant,
          state,
          decoration,
          className: cn(
            {
              "pl-10": startIcon,
              "pr-10": endIcon,
            },
            className
          ),
        })

    return (
      <input
        ref={ref}
        type={type}
        id={id}
        aria-label={ariaLabel}
        name={name}
        className={inputClassName}
        placeholder={placeholder}
        disabled={disabled}
        value={value}
        defaultValue={defaultValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required={required}
        maxLength={maxLength}
        style={autoFillStyle}
        {...props}
      />
    )
  }
)
InputBase.displayName = "InputBase"

// Main Input component
const Input = forwardRef<HTMLInputElement, InputProps>(
  (
    {
      label,
      helperText,
      placeholder = "",
      variant = "default",
      disabled = false,
      type = "text",
      required = false,
      fullWidth = false,
      className = "",
      value,
      defaultValue,
      onChange,
      onBlur,
      onFocus,
      onKeyDown,
      startIcon,
      endIcon,
      id,
      name,
      maxLength,
      decoration,
      unstyled = false,
      classes = {},
      transparentOnAutofill = false,
      ...props
    },
    ref
  ) => {
    const [inputValue, setInputValue] = useState(value || defaultValue || "")
    const [isPasswordVisible, setIsPasswordVisible] = useState(false)

    // Handle input change
    const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
      // Only update internal state if component is uncontrolled (no value prop)
      if (value === undefined) {
        setInputValue(e.target.value)
      }
      if (onChange) onChange(e)
    }

    // Toggle password visibility
    const togglePasswordVisibility = () => {
      setIsPasswordVisible(!isPasswordVisible)
    }

    // Determine input type for password fields
    const inputType = type === "password" && isPasswordVisible ? "text" : type

    // Determine which value to use for character count
    const currentValue = value !== undefined ? value : inputValue
    const currentLength = String(currentValue).length || 0

    return (
      <InputRoot fullWidth={fullWidth} className={cn(className, classes.root)}>
        <div className="flex items-center justify-between gap-2">
          {/* Label */}
          <If condition={!!label}>
            <InputLabel
              htmlFor={id || name}
              disabled={disabled}
              required={required}
              className={cn("flex-1", classes.label)}
            >
              {label}
            </InputLabel>
          </If>
          <If condition={!!maxLength}>
            <CharCount
              currentLength={currentLength}
              maxLength={maxLength || 0}
              className={cn(classes.characterCounter)}
            />
          </If>
        </div>

        {/* Input wrapper for icons */}
        <InputWrapper className={cn(classes.wrapper)}>
          {/* Start icon */}
          <If condition={!!startIcon}>
            <StartIcon className={classes.startIcon}>{startIcon}</StartIcon>
          </If>

          {/* Input element using InputBase */}
          <InputBase
            ref={ref}
            type={inputType}
            id={id || name}
            name={name}
            variant={variant}
            decoration={decoration}
            disabled={disabled}
            placeholder={placeholder}
            value={value !== undefined ? value : inputValue}
            defaultValue={value === undefined ? defaultValue : undefined}
            onChange={handleChange}
            onFocus={onFocus}
            onBlur={onBlur}
            onKeyDown={onKeyDown}
            required={required}
            maxLength={maxLength}
            startIcon={!!startIcon}
            endIcon={!!(endIcon || type === "password")}
            unstyled={unstyled}
            className={unstyled ? className : classes.input}
            transparentOnAutofill={transparentOnAutofill}
            {...props}
          />

          {/* End icon or password toggle */}
          <If condition={!!endIcon || type === "password"}>
            <EndIcon className={cn(classes.endIcon)}>
              <IfElse condition={type === "password"}>
                <If>
                  <PasswordToggle
                    isVisible={isPasswordVisible}
                    onToggle={togglePasswordVisibility}
                    className={cn(
                      { "pointer-events-none": disabled },
                      classes.passwordToggle
                    )}
                  />
                </If>
                <Else>{endIcon}</Else>
              </IfElse>
            </EndIcon>
          </If>
        </InputWrapper>

        {/* Helper text */}
        <If condition={!!helperText}>
          <HelperText
            variant={variant}
            disabled={disabled}
            className={cn(classes.helperText)}
          >
            {helperText}
          </HelperText>
        </If>
      </InputRoot>
    )
  }
) as InputComponent
Input.displayName = "Input"

// Compose Input with its sub-components
Input.Root = InputRoot
Input.Label = InputLabel
Input.Wrapper = InputWrapper
Input.StartIcon = StartIcon
Input.EndIcon = EndIcon
Input.PasswordToggle = PasswordToggle
Input.Base = InputBase
Input.HelperText = HelperText
Input.CharCount = CharCount

export default Input
export {
  InputRoot,
  InputLabel,
  InputWrapper,
  StartIcon,
  EndIcon,
  PasswordToggle,
  InputBase,
}
export type { InputProps, InputVariant, InputComponent }
