import React from "react"
import { AccessibleIcon } from "@radix-ui/react-accessible-icon"

export const FeatureShineIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <AccessibleIcon label="Shine icon">
    <svg
      width="20"
      height="20"
      viewBox="0 0 20 20"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...props}
    >
      <g clipPath="url(#clip0_304_1142)">
        <path
          d="M9.99967 1.45834V6.87501M9.99967 13.125V18.5417M6.87467 10H1.45801M13.1247 10H18.5413M6.66634 6.66668L4.99967 5.00001M13.333 6.66668L14.9997 5.00001M13.333 13.3333L14.9997 15M6.66634 13.3333L4.99967 15"
          stroke="currentColor"
          strokeWidth="1.5"
          strokeLinecap="square"
        />
      </g>
      <defs>
        <clipPath id="clip0_304_1142">
          <rect width="20" height="20" fill="currentColor" />
        </clipPath>
      </defs>
    </svg>
  </AccessibleIcon>
)
