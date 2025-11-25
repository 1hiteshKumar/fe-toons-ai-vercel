import React from "react"
import { ClockIcon } from "../aural/icons/clock-icon"
import { cn } from "../aural/lib/utils"

export interface ShotHeaderProps {
  shotNumber: number | string
  duration?: string
  className?: string
}

export default function ShotHeader({
  shotNumber,
  duration,
  className,
}: ShotHeaderProps) {
  return (
    <div
      className={cn(
        "flex items-center rounded-full bg-fm-neutral-200 border border-fm-divider-primary",
        className
      )}
    >
      {/* Shot Identifier Section */}
      <div className="flex-1 flex items-center justify-center px-4 py-3">
        <span className="font-bold text-white text-sm">
          Shot {shotNumber}
        </span>
      </div>

      {/* Vertical Divider */}
      <div className="h-full w-px bg-fm-divider-primary" />

      {/* Vertical Divider */}
      {duration && (
        <>
          <div className="h-full w-px bg-fm-divider-primary" />
          {/* Duration Indicator Section */}
          <div className="flex-1 flex items-center justify-center gap-1.5 px-4 py-3">
            <ClockIcon className="h-4 w-4 text-fm-neutral-600" />
            <span className="text-fm-neutral-600 text-sm">{duration}</span>
          </div>
        </>
      )}
    </div>
  )
}

