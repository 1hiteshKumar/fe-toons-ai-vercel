"use client";

import Link from "next/link";
import { Tag } from "@/aural/components/ui/tag";
import { Stories } from "@/lib/hooks/use-user-uploads";
import Heading from "@/components/heading";
import { cn } from "@/aural/lib/utils";
import { ChevronRightIcon } from "@/aural/icons/chevron-right-icon";

export default function UserStories({ stories }: { stories: Stories[] }) {
  if (stories.length === 0) return null;

  const statusColorMap: Record<string, "warning" | "positive" | "negative"> = {
    PENDING: "warning",
    SUCCESS: "positive",
    FAILED: "negative",
  };

  const statusDisplayMap: Record<string, string> = {
    SUCCESS: "completed",
    PENDING: "in Progress",
    FAILED: "failed",
  };

  const formatDate = (dateString?: string) => {
    if (!dateString) return "";
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString("en-US", {
        month: "short",
        day: "numeric",
        year: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    } catch {
      return "";
    }
  };

  return (
    <section className="w-full">
      <Heading
        heading="Your Stories"
        subHeading="Track the status of your story submission."
      />

      <div className="flex gap-4 w-full max-w-[636px] overflow-x-auto ">
        {stories?.map(
          ({
            showName,
            scriptText,
            validation_task_id,
            status,
            createdAt,
            finalShowId,
          }) => {
            const StoryCard = (
              <div
                className={cn(
                  "group relative border rounded-lg p-5 bg-fm-surface-secondary w-74 h-41",
                  "hover:border-fm-divider-contrast transition-all duration-200",
                  "hover:shadow-lg flex items-start justify-between gap-4",
                  status === "SUCCESS" && "border-fm-positive-500/20",
                  status === "FAILED" && "border-fm-negative-500/20",
                  status === "PENDING" && "border-fm-warning-500/20",
                  finalShowId && "cursor-pointer"
                )}
              >
                <div className="flex-1 min-w-0 space-y-2">
                  <div className="flex items-start justify-between gap-3">
                    <div className="flex-1 min-w-0">
                      <p className="font-medium text-fm-base">{showName}</p>
                      <p className="text-sm text-fm-secondary-800 line-clamp-2 leading-relaxed mt-1">
                        {scriptText || "No script text available"}
                      </p>
                    </div>
                    <div className="shrink-0">
                      <Tag
                        variant="system"
                        color={statusColorMap[status] || "neutral"}
                        size="sm"
                      >
                        {statusDisplayMap[status]?.toUpperCase() || status}
                      </Tag>
                    </div>
                  </div>
                  {createdAt && (
                    <div className="flex items-center text-xs text-fm-neutral-500">
                      <span>Created {formatDate(createdAt)}</span>
                    </div>
                  )}
                </div>
                {finalShowId && (
                  <div className="shrink-0 flex items-center">
                    <ChevronRightIcon className="size-5 text-fm-icon-active" />
                  </div>
                )}
              </div>
            );

            return finalShowId ? (
              <Link key={validation_task_id} href={`/studio/${finalShowId}`}>
                {StoryCard}
              </Link>
            ) : (
              <div key={validation_task_id}>{StoryCard}</div>
            );
          }
        )}
      </div>
    </section>
  );
}
