import React, {
  forwardRef,
  ForwardRefExoticComponent,
  ReactNode,
  RefAttributes,
  useCallback,
  useEffect,
  useRef,
  useState,
} from "react";
import { CharCount } from "./char-count";
import { HelperText } from "./helper-text";
import { Label } from "./label";
import { cn } from "../../lib/utils";
import { cva } from "class-variance-authority";

// Types
type TextAreaVariant = "default" | "error" | "warning" | "success";
type TextAreaDecoration = "underline" | "outline" | "filled";

interface TextAreaBaseProps {
  variant?: TextAreaVariant;
  decoration?: TextAreaDecoration;
  disabled?: boolean;
  className?: string;
  placeholder?: string;
  value?: string;
  autoComplete?: string;
  autoFocus?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLTextAreaElement>) => void;
  onBlur?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onFocus?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onInput?: (e: React.FocusEvent<HTMLTextAreaElement>) => void;
  onKeyDown?: (e: React.KeyboardEvent<HTMLTextAreaElement>) => void;
  id?: string;
  name?: string;
  required?: boolean;
  maxLength?: number;
  rows?: number;
  autoGrow?: boolean;
  maxHeight?: number;
  minHeight?: number;
  unstyled?: boolean;
  "aria-describedby"?: string;
  "aria-invalid"?: boolean;
  "aria-labelledby"?: string;
}

interface TextAreaProps extends TextAreaBaseProps {
  label?: ReactNode;
  helperText?: ReactNode;
  fullWidth?: boolean;
  showCharCount?: boolean;
  classes?: {
    root?: string;
    label?: string;
    wrapper?: string;
    textarea?: string;
    helperText?: string;
    charCount?: string;
  };
}

interface TextAreaComponent
  extends ForwardRefExoticComponent<
    TextAreaProps & RefAttributes<HTMLTextAreaElement>
  > {
  Root: typeof TextAreaRoot;
  Label: typeof TextAreaLabel;
  Wrapper: typeof TextAreaWrapper;
  Base: typeof TextAreaBase;
  HelperText: typeof HelperText;
  CharCount: typeof CharCount;
}

// CVA for textarea variants with decoration support
const textareaVariants = cva(
  "block w-full focus:outline-none transition-all duration-200 border-solid resize-none overflow-hidden tracking-wide placeholder:text-fm-placeholder font-fm-text text-fm-primary font-fm-poppins",
  {
    variants: {
      variant: {
        default: "border-fm-divider-primary focus:border-fm-divider-contrast",
        error: "border-fm-divider-negative focus:border-fm-divider-negative",
        warning: "border-fm-divider-warning focus:border-fm-divider-warning",
        success: "border-fm-divider-positive focus:border-fm-divider-positive",
      },
      decoration: {
        underline:
          "border-b leading-fm-xl [font-size:var(--text-fm-xl)] px-0 py-2",
        outline:
          "border rounded-fm-s leading-fm-md [font-size:var(--text-fm-md)] px-3 py-2",
        filled:
          "rounded-fm-s bg-fm-surface-frosted/20 border leading-fm-md [font-size:var(--text-fm-md)] px-4 py-2",
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
      decoration: "filled",
      state: "default",
    },
  }
);

// Auto-grow hook
const useAutoGrow = (
  textareaRef: React.RefObject<HTMLTextAreaElement>,
  value: string,
  minHeight?: number,
  maxHeight?: number,
  autoGrow: boolean = true
) => {
  const adjustHeight = useCallback(() => {
    const textarea = textareaRef.current;
    if (!textarea || !autoGrow) return;

    // Reset height to auto to get the correct scrollHeight
    textarea.style.height = "auto";

    let newHeight = textarea.scrollHeight;

    // Apply min height constraint
    if (minHeight && newHeight < minHeight) {
      newHeight = minHeight;
    }

    // Apply max height constraint
    if (maxHeight && newHeight > maxHeight) {
      newHeight = maxHeight;
      textarea.style.overflowY = "auto";
    } else {
      textarea.style.overflowY = "hidden";
    }

    textarea.style.height = `${newHeight}px`;
  }, [textareaRef, minHeight, maxHeight, autoGrow]);

  useEffect(() => {
    adjustHeight();
  }, [value, adjustHeight]);

  useEffect(() => {
    const textarea = textareaRef.current;
    if (!textarea || !autoGrow) return;

    // Set initial min height
    if (minHeight) {
      textarea.style.minHeight = `${minHeight}px`;
    }

    adjustHeight();

    // Handle window resize
    const handleResize = () => adjustHeight();
    window.addEventListener("resize", handleResize);

    return () => {
      window.removeEventListener("resize", handleResize);
    };
  }, [adjustHeight, minHeight, autoGrow, textareaRef]);

  return adjustHeight;
};

// Atomic components

// Root container
const TextAreaRoot = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{
    className?: string;
    fullWidth?: boolean;
  }>
>(({ children, className = "", fullWidth = false }, ref) => (
  <div
    ref={ref}
    className={cn(
      "space-y-1",
      {
        "w-full": fullWidth,
      },
      className
    )}
  >
    {children}
  </div>
));
TextAreaRoot.displayName = "TextAreaRoot";

// Label component (wrapper around existing Label)
const TextAreaLabel = forwardRef<
  HTMLLabelElement,
  {
    htmlFor?: string;
    className?: string;
    children: ReactNode;
    disabled?: boolean;
    required?: boolean;
  }
>((props, ref) => {
  return <Label ref={ref} {...props} />;
});
TextAreaLabel.displayName = "TextAreaLabel";

// Wrapper for textarea with relative positioning
const TextAreaWrapper = forwardRef<
  HTMLDivElement,
  React.PropsWithChildren<{ className?: string }>
>(({ children, className = "" }, ref) => (
  <div ref={ref} className={cn("relative", className)}>
    {children}
  </div>
));
TextAreaWrapper.displayName = "TextAreaWrapper";

// Base textarea component without any wrapper elements
const TextAreaBase = forwardRef<HTMLTextAreaElement, TextAreaBaseProps>(
  (
    {
      variant = "default",
      decoration = "filled",
      disabled = false,
      className = "",
      placeholder = "",
      value,
      onChange,
      onBlur,
      onFocus,
      id,
      name,
      required = false,
      maxLength,
      rows = 3,
      autoGrow = true,
      maxHeight,
      minHeight,
      unstyled,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      "aria-labelledby": ariaLabelledBy,
      ...props
    },
    ref
  ) => {
    const [isFocused, setIsFocused] = useState(false);
    const [textareaValue, setTextareaValue] = useState(value || "");
    const internalRef = useRef<HTMLTextAreaElement>(null);
    const textareaRef =
      (ref as React.RefObject<HTMLTextAreaElement>) || internalRef;

    // Auto-grow functionality
    useAutoGrow(
      textareaRef,
      value !== undefined ? value : textareaValue,
      minHeight,
      maxHeight,
      autoGrow
    );

    // Handle focus state
    const handleFocus = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(true);
      if (onFocus) onFocus(e);
    };

    // Handle blur state
    const handleBlur = (e: React.FocusEvent<HTMLTextAreaElement>) => {
      setIsFocused(false);
      if (onBlur) onBlur(e);
    };

    // Handle textarea change
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;

      // Respect maxLength
      if (maxLength && newValue.length > maxLength) {
        return;
      }

      setTextareaValue(newValue);
      if (onChange) onChange(e);
    };

    // Determine focus state
    const state = disabled ? "disabled" : isFocused ? "focused" : "default";

    // Apply styles only if not unstyled
    const textareaClassName = unstyled
      ? className
      : textareaVariants({
          variant,
          decoration,
          state,
          className,
        });

    return (
      <textarea
        ref={textareaRef}
        id={id}
        name={name}
        className={textareaClassName}
        placeholder={placeholder}
        disabled={disabled}
        value={value !== undefined ? value : textareaValue}
        onChange={handleChange}
        onFocus={handleFocus}
        onBlur={handleBlur}
        required={required}
        rows={autoGrow ? 1 : rows}
        maxLength={maxLength}
        aria-describedby={ariaDescribedBy}
        aria-invalid={ariaInvalid || variant === "error"}
        aria-labelledby={ariaLabelledBy}
        {...props}
      />
    );
  }
);
TextAreaBase.displayName = "TextAreaBase";

// Main TextArea component using composition
const TextArea = forwardRef<HTMLTextAreaElement, TextAreaProps>(
  (
    {
      label,
      helperText,
      placeholder = "",
      variant = "default",
      decoration = "filled",
      disabled = false,
      required = false,
      fullWidth = false,
      className = "",
      value,
      onChange,
      onBlur,
      onFocus,
      id,
      name,
      rows = 3,
      maxHeight,
      minHeight,
      maxLength,
      showCharCount = false,
      autoGrow = true,
      "aria-describedby": ariaDescribedBy,
      "aria-invalid": ariaInvalid,
      "aria-labelledby": ariaLabelledBy,
      classes,
      unstyled = false,
      ...props
    },
    ref
  ) => {
    const [textareaValue, setTextareaValue] = useState(value || "");

    // Generate unique IDs for accessibility
    const textareaId =
      id || `textarea-${Math.random().toString(36).substr(2, 9)}`;
    const helperTextId = helperText ? `${textareaId}-helper` : undefined;
    const charCountId = showCharCount ? `${textareaId}-char-count` : undefined;

    // Handle textarea change
    const handleChange = (e: React.ChangeEvent<HTMLTextAreaElement>) => {
      const newValue = e.target.value;

      // Respect maxLength
      if (maxLength && newValue.length > maxLength) {
        return;
      }

      setTextareaValue(newValue);
      if (onChange) onChange(e);
    };

    // Current character count
    const currentValue = value !== undefined ? value : textareaValue;
    const currentLength = currentValue.length;

    // Build aria-describedby
    const describedByIds = [ariaDescribedBy, helperTextId, charCountId]
      .filter(Boolean)
      .join(" ");

    return (
      <TextAreaRoot
        fullWidth={fullWidth}
        className={cn(className, classes?.root)}
      >
        <div className="flex items-center justify-between gap-2">
          {/* Label */}
          {label && (
            <TextAreaLabel
              htmlFor={textareaId}
              disabled={disabled}
              required={required}
              className={classes?.label}
            >
              {label}
            </TextAreaLabel>
          )}
          {showCharCount && (
            <CharCount
              currentLength={currentLength}
              maxLength={maxLength}
              id={charCountId}
              className={cn("ml-auto", classes?.charCount)}
            />
          )}
        </div>

        {/* TextArea wrapper */}
        <TextAreaWrapper className={classes?.wrapper}>
          {/* TextArea element */}
          <TextAreaBase
            ref={ref}
            id={textareaId}
            name={name}
            variant={variant}
            decoration={decoration}
            disabled={disabled}
            placeholder={placeholder}
            value={value}
            onChange={handleChange}
            onBlur={onBlur}
            onFocus={onFocus}
            required={required}
            rows={rows}
            maxHeight={maxHeight}
            minHeight={minHeight}
            maxLength={maxLength}
            autoGrow={autoGrow}
            aria-describedby={describedByIds || undefined}
            aria-invalid={ariaInvalid || variant === "error"}
            aria-labelledby={ariaLabelledBy}
            className={unstyled ? className : classes?.textarea}
            unstyled={unstyled}
            {...props}
          />
        </TextAreaWrapper>

        {/* Helper text and character count row */}
        {helperText && (
          <HelperText variant={variant} id={helperTextId} disabled={disabled}>
            {helperText}
          </HelperText>
        )}
      </TextAreaRoot>
    );
  }
) as TextAreaComponent;

TextArea.displayName = "TextArea";

// Compose TextArea with its atomic components
TextArea.Root = TextAreaRoot;
TextArea.Label = TextAreaLabel;
TextArea.Wrapper = TextAreaWrapper;
TextArea.Base = TextAreaBase;
TextArea.HelperText = HelperText;
TextArea.CharCount = CharCount;

export default TextArea;
export {
  TextAreaRoot,
  TextAreaLabel,
  TextAreaWrapper,
  TextAreaBase,
  textareaVariants,
};
export type {
  TextAreaProps,
  TextAreaVariant,
  TextAreaComponent,
  TextAreaBaseProps,
  TextAreaDecoration,
};
