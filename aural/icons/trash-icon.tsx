import React from "react"
import { AccessibleIcon } from "@radix-ui/react-accessible-icon"

export const TrashIcon = (
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
  <AccessibleIcon label="Trash icon">
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <path
        d="M5.75 5.75V21.25H18.25V5.75M5.75 5.75H18.25M5.75 5.75H3.75M18.25 5.75H20.25M14 10.75V16.25M10 10.75V16.25M9.02154 5.38866C9.19999 3.90218 10.4654 2.75 12 2.75C13.5346 2.75 14.8 3.90218 14.9785 5.38866"
        stroke="CurrentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  </AccessibleIcon>
)
