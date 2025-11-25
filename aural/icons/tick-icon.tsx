import React from "react"
import { AccessibleIcon } from "@radix-ui/react-accessible-icon"

export const TickIcon = (
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
  <AccessibleIcon label="Tick icon">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      xmlns="http://www.w3.org/2000/svg"
      fill="transparent"
      {...props}
    >
      <path
        d="m7 13 3 3 7-8"
        stroke="currentColor"
        strokeWidth="2"
        strokeLinecap="square"
      />
    </svg>
  </AccessibleIcon>
)
