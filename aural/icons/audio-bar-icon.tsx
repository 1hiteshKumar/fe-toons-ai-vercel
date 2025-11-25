import React from "react"
import { AccessibleIcon } from "@radix-ui/react-accessible-icon"

export const AudioBarIcon = (
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
  <AccessibleIcon label="Audio Bar icon">
    <svg
      width="52"
      height="12"
      viewBox="0 0 52 12"
      xmlns="http://www.w3.org/2000/svg"
      fill="currentColor"
      {...props}
    >
      <path d="M19.068 0h1.5v12h-1.5zm4 2h1.5v8h-1.5zm4 2h1.5v3.81h-1.5zm-10-2h-1.5v8h1.5zm-4 2h-1.5v3.81h1.5zm-4 .5h-1.5v2h1.5zm-4 0h-1.5v2h1.5zM1.5 4.5H0v2h1.5zM36.068 0h-1.5v12h1.5zm4 2h-1.5v8h1.5zm-8 2h-1.5v3.81h1.5zm14-2h1.5v8h-1.5zm-4 2h1.5v3.81h-1.5zm8 1h1.5v2h-1.5z" />
    </svg>
  </AccessibleIcon>
)
