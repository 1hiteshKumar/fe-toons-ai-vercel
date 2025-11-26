import React from "react"
import { AccessibleIcon } from "@radix-ui/react-accessible-icon"

interface PlayPauseIconProps extends React.SVGProps<SVGSVGElement> {
  isPlaying?: boolean
}

export const PlayPauseIcon = ({ isPlaying = false, ...props }: PlayPauseIconProps) => (
  <AccessibleIcon label={isPlaying ? "Pause icon" : "Play icon"}>
    {isPlaying ? (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        {...props}
      >
        <rect x="6" y="4" width="4" height="16" strokeWidth="2" strokeLinecap="round" />
        <rect x="14" y="4" width="4" height="16" strokeWidth="2" strokeLinecap="round" />
      </svg>
    ) : (
      <svg
        viewBox="0 0 24 24"
        fill="none"
        xmlns="http://www.w3.org/2000/svg"
        stroke="currentColor"
        {...props}
      >
        <path
          d="M8 5V19L19 12L8 5Z"
          strokeWidth="2"
          strokeLinecap="round"
          strokeLinejoin="round"
          fill="currentColor"
        />
      </svg>
    )}
  </AccessibleIcon>
)

