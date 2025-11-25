import React from "react"
import { AccessibleIcon } from "@radix-ui/react-accessible-icon"

export const ClockIcon = (
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
  <AccessibleIcon label="Clock icon">
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      {...props}
    >
      <circle cx="8" cy="8" r="6" strokeWidth="1.5" />
      <path
        d="M8 4V8L10.5 10.5"
        strokeWidth="1.5"
        strokeLinecap="round"
        strokeLinejoin="round"
      />
    </svg>
  </AccessibleIcon>
)

