import * as React from "react"
import { Divider } from "./divider"
import { Label } from "./label"
import { ChevronRightIcon } from "../../icons/chevron-right-icon"
import { TickIcon } from "../../icons/tick-icon"
import { cn } from "../../lib/utils"
import * as DropdownMenuPrimitive from "@radix-ui/react-dropdown-menu"

function DropdownMenu({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Root>) {
  return <DropdownMenuPrimitive.Root data-slot="dropdown-menu" {...props} />
}

function DropdownMenuPortal({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Portal>) {
  return (
    <DropdownMenuPrimitive.Portal data-slot="dropdown-menu-portal" {...props} />
  )
}

function DropdownMenuTrigger({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Trigger>) {
  return (
    <DropdownMenuPrimitive.Trigger
      data-slot="dropdown-menu-trigger"
      {...props}
    />
  )
}

type DropdownMenuContentProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Content
> & {
  classes?: {
    root?: string
    border?: string
  }
}

function DropdownMenuContent({
  className,
  sideOffset = 4,
  classes = {},
  children,
  ...props
}: DropdownMenuContentProps) {
  return (
    <DropdownMenuPrimitive.Portal>
      <DropdownMenuPrimitive.Content
        data-slot="dropdown-menu-content"
        sideOffset={sideOffset}
        className={cn(
          "bg-fm-surface-frosted/20 rounded-fm-s relative z-50 min-w-40 border-0 shadow-lg backdrop-blur-lg",
          // Animation classes
          "popover-content",
          className,
          classes?.root
        )}
        {...props}
      >
        {/* Top border gradient */}
        <div
          className={cn(
            "absolute top-0 right-0 left-0 block h-0.5 w-full bg-(image:--gradient-fm-stroke-neutral)",
            classes?.border
          )}
        />
        {children}
      </DropdownMenuPrimitive.Content>
    </DropdownMenuPrimitive.Portal>
  )
}

function DropdownArrow({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Arrow>) {
  return (
    <DropdownMenuPrimitive.Arrow
      data-slot="dropdown-menu-arrow"
      className={cn("fill-fm-surface-frosted/20", className)}
      {...props}
    />
  )
}

function DropdownMenuGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Group>) {
  return (
    <DropdownMenuPrimitive.Group data-slot="dropdown-menu-group" {...props} />
  )
}

type DropdownMenuItemProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Item
> & {
  inset?: boolean
  variant?: "default" | "destructive"
  classes?: {
    root?: string
  }
}

function DropdownMenuItem({
  className,
  inset,
  variant = "default",
  classes = {},
  ...props
}: DropdownMenuItemProps) {
  return (
    <DropdownMenuPrimitive.Item
      data-slot="dropdown-menu-item"
      data-inset={inset}
      data-variant={variant}
      className={cn(
        // Base styles
        "rounded-fm-s relative flex cursor-default items-center gap-2 px-4 py-3",
        "text-fm-primary font-fm-text leading-fm-lg [font-size:var(--text-fm-lg)] tracking-wide",
        "transition-colors duration-200 outline-none select-none",
        // Hover and focus states
        "hover:bg-fm-surface-frosted/20 focus-visible:bg-fm-surface-frosted/20",
        // Checked state
        "data-[state=checked]:not-data-[disabled]:bg-fm-surface-frosted/10",
        // Disabled state
        "data-[disabled]:text-fm-inactive data-[disabled]:bg-fm-surface-frosted/30 data-[disabled]:pointer-events-none",
        // Destructive variant
        "data-[variant=destructive]:text-fm-negative",
        "data-[variant=destructive]:hover:bg-fm-surface-negative-alpha-15",
        "data-[variant=destructive]:focus:bg-fm-surface-negative-alpha-15",
        // Inset
        "data-[inset]:pl-8",
        // Icon styling
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        "[&_svg:not([class*='text-'])]:text-fm-icon-active",
        "data-[variant=destructive]:*:[svg]:!text-fm-negative",
        className,
        classes?.root
      )}
      {...props}
    />
  )
}

type DropdownMenuCheckboxItemProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.CheckboxItem
> & {
  classes?: {
    root?: string
    indicator?: string
  }
}

function DropdownMenuCheckboxItem({
  className,
  children,
  checked,
  classes = {},
  ...props
}: DropdownMenuCheckboxItemProps) {
  return (
    <DropdownMenuPrimitive.CheckboxItem
      data-slot="dropdown-menu-checkbox-item"
      className={cn(
        // Base styles
        "rounded-fm-s relative flex cursor-default items-center gap-2 px-4 py-3 pl-8",
        "text-fm-primary font-fm-text leading-fm-lg [font-size:var(--text-fm-lg)] tracking-wide",
        "transition-colors duration-200 outline-none select-none",
        // Hover and focus states
        "hover:bg-fm-surface-frosted/20 focus-visible:bg-fm-surface-frosted/20",
        // Checked state
        "data-[state=checked]:not-data-[disabled]:bg-fm-surface-frosted/10",
        // Disabled state
        "data-[disabled]:text-fm-inactive data-[disabled]:bg-fm-surface-frosted/30 data-[disabled]:pointer-events-none",
        // Icon styling
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
        classes?.root
      )}
      checked={checked}
      {...props}
    >
      <span className="pointer-events-none absolute left-4 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <TickIcon
            className={cn("text-fm-icon-active size-4", classes?.indicator)}
          />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.CheckboxItem>
  )
}

function DropdownMenuRadioGroup({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.RadioGroup>) {
  return (
    <DropdownMenuPrimitive.RadioGroup
      data-slot="dropdown-menu-radio-group"
      {...props}
    />
  )
}

type DropdownMenuRadioItemProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.RadioItem
> & {
  classes?: {
    root?: string
    indicator?: string
  }
}

function DropdownMenuRadioItem({
  className,
  children,
  classes = {},
  ...props
}: DropdownMenuRadioItemProps) {
  return (
    <DropdownMenuPrimitive.RadioItem
      data-slot="dropdown-menu-radio-item"
      className={cn(
        // Base styles
        "rounded-fm-s relative flex cursor-default items-center gap-2 px-4 py-3",
        "text-fm-primary font-fm-text leading-fm-lg [font-size:var(--text-fm-lg)] tracking-wide",
        "transition-colors duration-200 outline-none select-none",
        // Hover and focus states
        "hover:bg-fm-surface-frosted/20 focus-visible:bg-fm-surface-frosted/20",
        // Checked state
        "data-[state=checked]:not-data-[disabled]:bg-fm-surface-frosted/10",
        // Disabled state
        "data-[disabled]:text-fm-inactive data-[disabled]:bg-fm-surface-frosted/30 data-[disabled]:pointer-events-none",
        // Icon styling
        "[&_svg]:pointer-events-none [&_svg]:shrink-0 [&_svg:not([class*='size-'])]:size-4",
        className,
        classes?.root
      )}
      {...props}
    >
      <span className="pointer-events-none absolute left-4 flex size-3.5 items-center justify-center">
        <DropdownMenuPrimitive.ItemIndicator>
          <TickIcon className={cn("text-fm-icon-active", classes?.indicator)} />
        </DropdownMenuPrimitive.ItemIndicator>
      </span>
      {children}
    </DropdownMenuPrimitive.RadioItem>
  )
}

function DropdownMenuItemIndicator({
  className,
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.ItemIndicator>) {
  return (
    <DropdownMenuPrimitive.ItemIndicator
      data-slot="dropdown-menu-item-indicator"
      className={cn("text-fm-icon-active", className)}
      {...props}
    />
  )
}

type DropdownMenuLabelProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Label
> & {
  inset?: boolean
  classes?: {
    root?: string
  }
}

function DropdownMenuLabel({
  className,
  inset,
  classes = {},
  ...props
}: DropdownMenuLabelProps) {
  return (
    <DropdownMenuPrimitive.Label
      data-slot="dropdown-menu-label"
      data-inset={inset}
      className={cn(
        // Label styling
        "text-fm-label-secondary px-4 py-2 text-sm font-medium tracking-wide",
        "data-[inset]:pl-8",
        className,
        classes?.root
      )}
      {...props}
      asChild
    >
      <Label>{props.children}</Label>
    </DropdownMenuPrimitive.Label>
  )
}

type DropdownMenuSeparatorProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.Separator
> & {
  classes?: {
    root?: string
  }
}

function DropdownMenuSeparator({
  className,
  classes = {},
  ...props
}: DropdownMenuSeparatorProps) {
  return (
    <DropdownMenuPrimitive.Separator
      data-slot="dropdown-menu-separator"
      className={cn("my-1", className, classes?.root)}
      {...props}
      asChild
    >
      <Divider variant="dashed" size="full_default" />
    </DropdownMenuPrimitive.Separator>
  )
}

type DropdownMenuShortcutProps = React.ComponentProps<"span"> & {
  classes?: {
    root?: string
  }
}

function DropdownMenuShortcut({
  className,
  classes = {},
  ...props
}: DropdownMenuShortcutProps) {
  return (
    <span
      data-slot="dropdown-menu-shortcut"
      className={cn(
        "font-fm-brand ml-auto text-xs tracking-widest",
        className,
        classes?.root
      )}
      {...props}
    />
  )
}

function DropdownMenuSub({
  ...props
}: React.ComponentProps<typeof DropdownMenuPrimitive.Sub>) {
  return <DropdownMenuPrimitive.Sub data-slot="dropdown-menu-sub" {...props} />
}

type DropdownMenuSubTriggerProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.SubTrigger
> & {
  inset?: boolean
  classes?: {
    root?: string
    icon?: string
  }
}

function DropdownMenuSubTrigger({
  className,
  inset,
  children,
  classes = {},
  ...props
}: DropdownMenuSubTriggerProps) {
  return (
    <DropdownMenuPrimitive.SubTrigger
      data-slot="dropdown-menu-sub-trigger"
      data-inset={inset}
      className={cn(
        // Base styles
        "rounded-fm-s relative flex cursor-default items-center gap-2 px-4 py-3",
        "text-fm-primary font-fm-text leading-fm-lg [font-size:var(--text-fm-lg)] tracking-wide",
        "transition-colors duration-200 outline-none select-none",
        // Hover and focus states
        "hover:bg-fm-surface-frosted/20 focus-visible:bg-fm-surface-frosted/20",
        // Checked state
        "data-[state=checked]:not-data-[disabled]:bg-fm-surface-frosted/10",
        // Disabled state
        "data-[disabled]:text-fm-inactive data-[disabled]:bg-fm-surface-frosted/30 data-[disabled]:pointer-events-none",
        // Inset
        "data-[inset]:pl-8",
        className,
        classes?.root
      )}
      {...props}
    >
      {children}
      <ChevronRightIcon
        className={cn("text-fm-icon-active ml-auto size-4", classes?.icon)}
      />
    </DropdownMenuPrimitive.SubTrigger>
  )
}

type DropdownMenuSubContentProps = React.ComponentProps<
  typeof DropdownMenuPrimitive.SubContent
> & {
  classes?: {
    root?: string
    border?: string
  }
}

function DropdownMenuSubContent({
  className,
  classes = {},
  children,
  ...props
}: DropdownMenuSubContentProps) {
  return (
    <DropdownMenuPrimitive.SubContent
      data-slot="dropdown-menu-sub-content"
      className={cn(
        "bg-fm-surface-frosted/20 rounded-fm-s relative z-50 min-w-40 overflow-hidden border-0 shadow-lg backdrop-blur-lg",
        // Animation classes
        "popover-content",
        className,
        classes?.root
      )}
      {...props}
    >
      {/* Top border gradient */}
      <div
        className={cn(
          "absolute top-0 right-0 left-0 block h-0.5 w-full bg-(image:--gradient-fm-stroke-neutral)",
          classes?.border
        )}
      />
      {children}
    </DropdownMenuPrimitive.SubContent>
  )
}

export const useOpenState = () => {
  const [open, setOpen] = React.useState(false)

  const onOpenChange = React.useCallback(
    (_value = !open) => {
      setOpen(_value)
    },
    [open]
  )

  return {
    open,
    onOpenChange,
  }
}

export {
  DropdownMenu,
  DropdownMenuPortal,
  DropdownMenuTrigger,
  DropdownMenuContent,
  DropdownArrow,
  DropdownMenuGroup,
  DropdownMenuLabel,
  DropdownMenuItem,
  DropdownMenuCheckboxItem,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuItemIndicator,
  DropdownMenuSeparator,
  DropdownMenuShortcut,
  DropdownMenuSub,
  DropdownMenuSubTrigger,
  DropdownMenuSubContent,
}

export type {
  DropdownMenuContentProps,
  DropdownMenuItemProps,
  DropdownMenuCheckboxItemProps,
  DropdownMenuRadioItemProps,
  DropdownMenuLabelProps,
  DropdownMenuSeparatorProps,
  DropdownMenuShortcutProps,
  DropdownMenuSubTriggerProps,
  DropdownMenuSubContentProps,
}
