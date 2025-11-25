import React from "react"
import { AccessibleIcon } from "@radix-ui/react-accessible-icon"

export const DownloadIcon = (
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
  <AccessibleIcon label="Download Icon">
    <svg
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      stroke="currentColor"
      {...props}
    >
      <path
        d="M20.25 14.75V20.25H3.75V14.75M12 3.75L12 14M8.5 11.5L12 15L15.5 11.5"
        strokeLinecap="square"
        strokeWidth="1.5"
      />
    </svg>
  </AccessibleIcon>
)
