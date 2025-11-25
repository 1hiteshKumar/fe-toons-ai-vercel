/* eslint-disable @typescript-eslint/no-explicit-any */
import * as React from "react"
import { cn } from "../../lib/utils"
import * as TooltipPrimitive from "@radix-ui/react-tooltip"
import { cva } from "class-variance-authority"

const tooltipVariants = cva(
  "z-50 w-fit origin-(--radix-tooltip-content-transform-origin) rounded-fm-s text-balance popover-content min-h-11 p-3 [font-size:var(--text-fm-sm)] leading-fm-sm font-fm-text flex items-center gap-2",
  {
    variants: {
      variant: {
        dark: "bg-fm-surface-secondary text-fm-primary",
        light: "bg-fm-primary text-fm-contrast",
      },
      side: {
        top: "",
        right: "",
        bottom: "",
        left: "",
      },
      align: {
        start: "",
        center: "",
        end: "",
      },
    },
    compoundVariants: [
      {
        variant: "dark",
        side: "top",
        align: "center",
        className:
          "bg-[radial-gradient(70.39%_86.36%_at_50%_97.73%,var(--color-fm-secondary-200)_0%,rgba(29,29,29,0.02)_100%)]",
      },
      {
        variant: "dark",
        side: "top",
        align: "start",
        className:
          "bg-[radial-gradient(139.94%_91.41%_at_24.52%_100%,var(--color-fm-secondary-200)_0%,rgba(29,29,29,0.02)_100%)]",
      },
      {
        variant: "dark",
        side: "top",
        align: "end",
        className:
          "bg-[radial-gradient(144.29%_88.59%_at_76.44%_98.86%,var(--color-fm-secondary-200)_0%,rgba(29,29,29,0.02)_100%)]",
      },
      {
        variant: "dark",
        side: "right",
        className:
          "bg-[radial-gradient(227.67%_50%_at_0%_50%,var(--color-fm-secondary-200)_0%,rgba(29,29,29,0.02)_100%)]",
      },
      {
        variant: "dark",
        side: "left",
        className:
          "bg-[radial-gradient(214.53%_47.12%_at_97.12%_50%,var(--color-fm-secondary-200)_0%,rgba(29,29,29,0.02)_100%)]",
      },
      {
        variant: "dark",
        side: "bottom",
        align: "center",
        className:
          "bg-[radial-gradient(65.76%_80.68%_at_50.21%_3.41%,var(--color-fm-secondary-200)_0%,rgba(29,29,29,0.02)_100%)]",
      },
      {
        variant: "dark",
        side: "bottom",
        align: "start",
        className:
          "bg-[radial-gradient(133.68%_87.79%_at_25%_0%,var(--color-fm-secondary-200)_0%,rgba(29,29,29,0.02)_100%)]",
      },
      {
        variant: "dark",
        side: "bottom",
        align: "end",
        className:
          "bg-[radial-gradient(130.2%_87.53%_at_74.52%_0%,var(--color-fm-secondary-200)_0%,rgba(29,29,29,0.02)_100%)]",
      },
      // Light variants
      {
        variant: "light",
        side: "top",
        align: "center",
        className:
          "bg-[radial-gradient(81.99%_100%_at_50%_100%,var(--color-fm-secondary-800)_0%,rgba(255,255,255,0.02)_100%)]",
      },
      {
        variant: "light",
        side: "top",
        align: "start",
        className:
          "bg-[linear-gradient(253deg,rgba(255,255,255,0.00)_35.74%,rgba(197,138,255,0.40)_76.76%),radial-gradient(153.27%_103.56%_at_23.08%_100%,var(--color-fm-secondary-800)_0%,rgba(255,255,255,0.02)_100%)]",
      },
      {
        variant: "light",
        side: "top",
        align: "end",
        className:
          "bg-[linear-gradient(105deg,rgba(255,255,255,0.00)_30.68%,rgba(197,138,255,0.40)_75.77%),radial-gradient(141.12%_102.46%_at_76.44%_100%,var(--color-fm-secondary-800)_0%,rgba(255,255,255,0.02)_100%)]",
      },
      {
        variant: "light",
        side: "right",
        className:
          "bg-[radial-gradient(339.53%_74.52%_at_2.88%_50%,var(--color-fm-secondary-800)_0%,rgba(255,255,255,0.02)_100%)]",
      },
      {
        variant: "light",
        side: "left",
        className:
          "bg-[radial-gradient(330.77%_72.6%_at_95.19%_50%,var(--color-fm-secondary-800)_0%,rgba(255,255,255,0.02)_100%)]",
      },
      {
        variant: "light",
        side: "bottom",
        align: "center",
        className:
          "bg-[radial-gradient(79.28%_96.59%_at_50.21%_3.41%,var(--color-fm-secondary-800)_0%,rgba(255,255,255,0.02)_100%)]",
      },
      {
        variant: "light",
        side: "bottom",
        align: "start",
        className:
          "bg-[linear-gradient(285deg,rgba(255,255,255,0.00)_32.13%,rgba(197,138,255,0.40)_74.24%),radial-gradient(133.78%_103.03%_at_25%_0%,var(--color-fm-secondary-800)_0%,rgba(255,255,255,0.02)_100%)]",
      },
      {
        variant: "light",
        side: "bottom",
        align: "end",
        className:
          "bg-[linear-gradient(75deg,rgba(255,255,255,0.00)_29.62%,rgba(197,138,255,0.40)_75.3%),radial-gradient(150.37%_103.37%_at_75.96%_0%,var(--color-fm-secondary-800)_0%,rgba(255,255,255,0.02)_100%)]",
      },
    ],
    defaultVariants: {
      variant: "dark",
      side: "top",
      align: "center",
    },
  }
)

function DarkArrow(props: React.ComponentProps<typeof TooltipPrimitive.Arrow>) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="9"
      viewBox="0 0 18 9"
      fill="none"
      {...props}
    >
      <path d="M9 9L18 0H9H0L9 9Z" fill="var(--color-fm-neutral-100)" />
      <path d="M9 9L18 0H9H0L9 9Z" fill="var(--color-fm-secondary-200)" />
      <path
        d="M1.20703 0.5H16.793L9 8.29297L1.20703 0.5Z"
        stroke="var(--color-fm-neutral-1100)"
        strokeOpacity="0.04"
      />
      <path
        d="M9.00117 7.5L16.6172 0H1.3668L9.00117 7.5Z"
        fill="url(#paint0_linear_2648_50933)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_2648_50933"
          x1="1.5"
          y1="0.5"
          x2="16.5"
          y2="0.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#350565" />
          <stop offset="0.502442" stopColor="var(--color-fm-secondary-200)" />
          <stop offset="1" stopColor="#350663" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function LightArrow(
  props: React.ComponentProps<typeof TooltipPrimitive.Arrow>
) {
  return (
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="18"
      height="9"
      viewBox="0 0 18 9"
      fill="none"
      {...props}
    >
      <path d="M9 9L18 0H9H0L9 9Z" fill="var(--color-fm-secondary-800)" />
      <path
        d="M1.20703 0.5H16.793L9 8.29297L1.20703 0.5Z"
        stroke="var(--color-fm-neutral-50)"
        strokeOpacity="0.02"
      />
      <path
        d="M9.00117 7.5L16.6172 0H1.3668L9.00117 7.5Z"
        fill="url(#paint0_linear_2648_52230)"
      />
      <defs>
        <linearGradient
          id="paint0_linear_2648_52230"
          x1="2"
          y1="0.5"
          x2="16"
          y2="0.5"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#C992FF" />
          <stop offset="0.499825" stopColor="var(--color-fm-secondary-800)" />
          <stop offset="1" stopColor="#CE9CFF" />
        </linearGradient>
      </defs>
    </svg>
  )
}

function TooltipProvider({
  delayDuration = 0,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Provider>) {
  return (
    <TooltipPrimitive.Provider
      data-slot="tooltip-provider"
      delayDuration={delayDuration}
      {...props}
    />
  )
}

const TooltipContext = React.createContext<{
  variant: "dark" | "light"
}>({
  variant: "dark",
})

interface ToolTipProps
  extends React.ComponentProps<typeof TooltipPrimitive.Root> {
  variant?: "dark" | "light"
}

const useTooltipContext = () => {
  const context = React.useContext(TooltipContext)
  if (!context) {
    throw new Error("Tooltip components must be used within a TooltipProvider")
  }
  return context
}

function Tooltip({ variant = "dark", ...props }: ToolTipProps) {
  return (
    <TooltipContext.Provider value={{ variant }}>
      <TooltipProvider>
        <TooltipPrimitive.Root data-slot="tooltip" {...props} />
      </TooltipProvider>
    </TooltipContext.Provider>
  )
}

function TooltipTrigger({
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Trigger>) {
  return <TooltipPrimitive.Trigger data-slot="tooltip-trigger" {...props} />
}

function TooltipContent({
  className,
  sideOffset = 0,
  side,
  align,
  children,
  ...props
}: React.ComponentProps<typeof TooltipPrimitive.Content>) {
  const { variant } = useTooltipContext()
  return (
    <TooltipPrimitive.Portal>
      <TooltipPrimitive.Content
        data-slot="tooltip-content"
        sideOffset={sideOffset}
        side={side}
        align={align}
        className={cn(tooltipVariants({ variant, side, align }), className)}
        {...props}
      >
        {children}
        <TooltipPrimitive.Arrow asChild>
          {variant === "dark" ? (
            <DarkArrow className="h-2 w-6" />
          ) : (
            <LightArrow className="h-2 w-6" />
          )}
        </TooltipPrimitive.Arrow>
      </TooltipPrimitive.Content>
    </TooltipPrimitive.Portal>
  )
}

export function withTooltip<
  T extends
    | keyof React.JSX.IntrinsicElements
    | React.ForwardRefExoticComponent<any>,
>(Component: T) {
  return React.forwardRef<
    React.ElementRef<T>,
    {
      tooltip?: React.ReactNode
      tooltipContentProps?: Omit<
        React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Content>,
        "children"
      >
      tooltipProps?: Omit<
        React.ComponentPropsWithoutRef<typeof TooltipPrimitive.Root>,
        "children"
      >
    } & React.ComponentPropsWithoutRef<T>
  >(function ExtendComponent(
    { tooltip, tooltipContentProps, tooltipProps, ...props },
    ref
  ) {
    const [mounted, setMounted] = React.useState(false)

    React.useEffect(() => {
      setMounted(true)
    }, [])

    const component = <Component ref={ref} {...(props as any)} />

    if (tooltip && mounted) {
      return (
        <Tooltip delayDuration={200} {...tooltipProps}>
          <TooltipTrigger asChild>{component}</TooltipTrigger>

          <TooltipContent {...tooltipContentProps}>{tooltip}</TooltipContent>
        </Tooltip>
      )
    }

    return component
  })
}

export { Tooltip, TooltipTrigger, TooltipContent, TooltipProvider }
