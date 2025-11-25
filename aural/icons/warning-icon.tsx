import React from "react"
import { AccessibleIcon } from "@radix-ui/react-accessible-icon"

export const WarningIcon = (
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
  <AccessibleIcon label="Warning icon">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="1.5"
      strokeLinecap="square"
      {...props}
    >
      <path
        d="M12 9.75V13.75M12 16.24V16.25M12 3.25L2.5 19.25H21.5L12 3.25Z"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  </AccessibleIcon>
)
