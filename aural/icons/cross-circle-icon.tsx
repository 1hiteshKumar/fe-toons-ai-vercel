import React from "react"
import { AccessibleIcon } from "@radix-ui/react-accessible-icon"

export const CrossCircleIcon = (
  props: React.JSX.IntrinsicAttributes & React.SVGProps<SVGSVGElement>
) => (
  <AccessibleIcon label="Cross Circle icon">
    <svg
      xmlns="http://www.w3.org/2000/svg"
      width="16"
      height="16"
      viewBox="0 0 16 16"
      fill="white"
      {...props}
    >
      <path
        fillRule="evenodd"
        clipRule="evenodd"
        d="M1.3335 7.99992C1.3335 4.31802 4.31826 1.33325 8.00016 1.33325C11.682 1.33325 14.6668 4.31802 14.6668 7.99992C14.6668 11.6818 11.682 14.6666 8.00016 14.6666C4.31826 14.6666 1.3335 11.6818 1.3335 7.99992ZM6.00016 5.29281L5.29306 5.99992L7.29303 7.99992L5.29306 9.99992L6.00016 10.7071L8.00016 8.70705L10.0002 10.7071L10.7073 9.99992L8.7073 7.99992L10.7073 5.99992L10.0002 5.29281L8.00016 7.29279L6.00016 5.29281Z"
      />
    </svg>
  </AccessibleIcon>
)
