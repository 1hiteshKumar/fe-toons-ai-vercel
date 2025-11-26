import React from "react";
import { ClockIcon } from "../aural/icons/clock-icon";
import { cn } from "../aural/lib/utils";
import { Button } from "@/aural/components/ui/button";
import { EditBigIcon } from "@/aural/icons/edit-big-icon";
import { TrashIcon } from "@/aural/icons/trash-icon";

export interface ShotHeaderProps {
  type?: string;
  shotNumber: number | string;
  duration?: number;
  className?: string;
}

export default function ShotHeader({
  type = "Image",
  shotNumber,
  duration,
  className,
}: ShotHeaderProps) {
  return (
    <div className="flex justify-between">
      <div
        className={cn(
          "flex items-center rounded-full bg-fm-neutral-200 border border-fm-divider-primary w-max ",
          className
        )}
      >
        {/* Shot Identifier Section */}
        <div className="flex items-center justify-center px-4 py-3">
          <span className="font-bold text-white text-sm">
            Shot {shotNumber}
          </span>
        </div>

        {/* Vertical Divider */}
        <div className="h-full w-px bg-fm-divider-secondary" />

        {/* Vertical Divider */}
        {duration && (
          <>
            <div className="h-full w-px bg-fm-divider-primary" />
            {/* Duration Indicator Section */}
            <div className="flex items-center justify-center gap-1.5 px-4 py-3">
              <ClockIcon className="h-4 w-4 text-fm-neutral-600" />
              <span className="text-fm-neutral-600 text-sm">{duration}s</span>
            </div>
          </>
        )}
      </div>
      <div className="flex gap-2">
        <Button
          variant="outline"
          size="sm"
          className="cursor-not-allowed"
          disabled
        >
          {" "}
          <EditBigIcon className="size-5" />
          Edit {type || "Image"}
        </Button>
        <Button
          variant="outline"
          size="sm"
          noise="low"
          disabled
          innerClassName="bg-fm-primary-700 border-none cursor-not-allowed"
        >
          <TrashIcon className="size-5" />
        </Button>
      </div>
    </div>
  );
}
