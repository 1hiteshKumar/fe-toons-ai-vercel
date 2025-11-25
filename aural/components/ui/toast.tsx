import React from "react"
import { Toaster as Sonner } from "sonner"

type ToasterProps = React.ComponentProps<typeof Sonner>

const Toaster = ({ ...props }: ToasterProps) => {
  return (
    <Sonner
      className="toaster group"
      toastOptions={{
        classNames: {
          toast:
            "group toast !bg-fm-surface-contrast !py-3 !px-4 ![box-shadow:var(--toast-shadow)_var(--color-fm-divider-brand-secondary)] !rounded-none !border-none ",
          title:
            "!text-fm-contrast ![font-size:var(--text-fm-lg)] !leading-fm-lg !tracking-wide !font-fm-text !font-normal",
          description:
            "!text-fm-tertiary ![font-size:var(--text-fm-md)] !leading-fm-md !tracking-wide !font-fm-text !font-normal",
        },
      }}
      position="bottom-center"
      {...props}
    />
  )
}

export { Toaster }
