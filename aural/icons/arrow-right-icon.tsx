import React from "react"
import { AccessibleIcon } from "@radix-ui/react-accessible-icon"

export const ArrowRightIcon = (
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
  <AccessibleIcon label="Arrow Right icon">
    <svg
      width="16"
      height="14"
      viewBox="0 0 16 14"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M9.667 1.792 14.875 7l-5.208 5.208M14.25 7H1.125"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  </AccessibleIcon>
)

export default ArrowRightIcon
