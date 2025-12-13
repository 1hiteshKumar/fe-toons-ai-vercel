import { cn } from "../aural/lib/utils";
import { DurationIcon, Pencil, Trash } from "@/lib/icons";

export interface ShotHeaderProps {
  hasUrl: boolean;
  shotNumber: number | string;
  duration?: number;
  className?: string;
  onEditClick: () => void;
}

export default function ShotHeader({
  shotNumber,
  duration,
  className,
  hasUrl,
  onEditClick,
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

        {duration && hasUrl && (
          <>
            {/* Duration Indicator Section */}
            <div className="flex items-center justify-center gap-1 p-2 bg-[#1F1F1F] rounded-xl">
              <DurationIcon className="h-4 w-4 text-white" />
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
        <button
          className={cn(hasUrl ? "cursor-pointer" : "cursor-not-allowed")}
          disabled={!hasUrl}
          onClick={onEditClick}
        >
          {" "}
          <Pencil />
        </button>
      </div>
    </div>
  );
}
