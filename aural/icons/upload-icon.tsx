import React from "react"
import { AccessibleIcon } from "@radix-ui/react-accessible-icon"

export interface UploadIconProps extends React.SVGProps<SVGSVGElement> {
  withAccessibility?: boolean
}

export const UploadIcon = (props: UploadIconProps) => {
  const { withAccessibility = true, ...svgProps } = props

  const svg = (
    <svg
      width="24"
      height="24"
      viewBox="0 0 24 24"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
      {...svgProps}
    >
      <path
        d="M20.25 12.75V20.25H3.75V12.75M12 15V4.5M16.5 8.25L12 3.75L7.5 8.25"
        stroke="currentColor"
        strokeWidth="1.5"
        strokeLinecap="square"
      />
    </svg>
  )

  if (withAccessibility) {
    return <AccessibleIcon label="Upload icon">{svg}</AccessibleIcon>
  }

  return svg
}
