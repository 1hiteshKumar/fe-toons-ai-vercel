import React from "react";
import { ClockIcon } from "../aural/icons/clock-icon";
import { cn } from "../aural/lib/utils";
import { Pencil, Trash } from "@/lib/icons";

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
      <div className={cn("flex items-center w-max ", className)}>
        {/* Shot Identifier Section */}
        <div className="flex items-center justify-center p-3 pl-0">
          <span className="font-bold text-white text-fm-lg font-fm-poppins">
            Shot {shotNumber}
          </span>
        </div>

        {duration && (
          <>
            {/* Duration Indicator Section */}
            <div className="flex items-center justify-center gap-1 p-2 bg-[#1F1F1F] rounded-xl">
              <ClockIcon className="h-4 w-4 text-white" />
              <span className="text-white text-fm-md font-bold font-fm-poppins">
                {duration}s
              </span>
            </div>
          </>
        )}
      </div>
      <div className="flex gap-5">
        <button className="cursor-not-allowed" disabled>
          <Trash />
        </button>
        <button className="cursor-not-allowed" disabled>
          {" "}
          <Pencil />
        </button>
      </div>
    </div>
  );
}
