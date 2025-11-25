import React from "react"
import { AccessibleIcon } from "@radix-ui/react-accessible-icon"

export const TickCircleIcon = (
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
  <AccessibleIcon label="Tick Circle icon">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="currentColor"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M8.00016 1.33325C4.31826 1.33325 1.3335 4.31802 1.3335 7.99992C1.3335 11.6818 4.31826 14.6666 8.00016 14.6666C11.682 14.6666 14.6668 11.6818 14.6668 7.99992C14.6668 4.31802 11.682 1.33325 8.00016 1.33325ZM10.7038 6.26289L9.92983 5.62965L6.96303 9.25572L5.66683 7.95945L4.95972 8.66658L7.0373 10.7441L10.7038 6.26289Z"
      />
    </svg>
  </AccessibleIcon>
)
