import React from "react"
import { AccessibleIcon } from "@radix-ui/react-accessible-icon"

export const PencilIcon = (
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
  <AccessibleIcon label="Pencil icon">
    <svg
      viewBox="0 0 16 16"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      {...props}
    >
      <path
        d="M8.8335 4.16667L11.0002 2L14.0002 5L11.8335 7.16667M8.8335 4.16667L1.8335 11.1667V14.1667H4.8335L11.8335 7.16667M8.8335 4.16667L11.8335 7.16667"
        strokeLinecap="round"
      />
    </svg>
  </AccessibleIcon>
)
