"use client";

import { Tag } from "@/aural/components/ui/tag";
import { Stories } from "@/lib/hooks/use-user-uploads";
import Heading from "@/components/heading";
import { cn } from "@/aural/lib/utils";

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
    <section className="my-10 w-full max-w-4xl mx-auto">
      <Heading
        heading="Your Stories"
        subHeading="Track the status of your story submissions"
      />

      <div className="space-y-3">
        {stories?.map(({ scriptText, validation_task_id, status, createdAt }) => (
          <div
            key={validation_task_id}
            className={cn(
              "group relative border rounded-lg p-5 bg-fm-surface-secondary",
              "hover:border-fm-divider-contrast w-72 transition-all duration-200",
              "hover:shadow-lg",
              status === "SUCCESS" && "border-fm-positive-500/20",
              status === "FAILED" && "border-fm-negative-500/20",
              status === "PENDING" && "border-fm-warning-500/20"
            )}
          >
            <div className="flex items-start justify-between gap-4">
              <div className="flex-1 min-w-0 space-y-3">
                <div className="flex items-start justify-between gap-3">
                  <div className="flex-1 min-w-0">
                    <p className="text-sm text-fm-secondary-800 line-clamp-3 leading-relaxed">
                      {scriptText || "No script text available"}
                    </p>
                  </div>
                  <div className="shrink-0">
                    <Tag
                      variant="system"
                      color={statusColorMap[status] || "neutral"}
                      size="sm"
                    >
                      {statusDisplayMap[status] || status}
                    </Tag>
                  </div>
                </div>
                {createdAt && (
                  <div className="flex items-center gap-2 text-xs text-fm-secondary-600">
                    <span className="text-fm-neutral-500">
                      Created {formatDate(createdAt)}
                    </span>
                    <span className="text-fm-divider-primary">•</span>
                   
                  </div>
                )}
              </div>
            </div>
          </div>
        ))}
      </div>
    </section>
  );
}
