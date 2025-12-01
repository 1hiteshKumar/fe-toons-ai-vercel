"use client";

import Loading from "@/components/loading";
import Heading from "@/components/heading";
import TextArea from "@/aural/components/ui/textarea";
import { useEffect, useState } from "react";
import type { Story } from "@/lib/hooks/use-user-uploads";
import { Button } from "@/aural/components/ui/button";
import { cn } from "@/aural/lib/utils";
import { PencilIcon } from "@/aural/icons/pencil-icon";
import { TrashIcon } from "@/aural/icons/trash-icon";
import ArrowRightIcon from "@/aural/icons/arrow-right-icon";
import { fetchStoryData } from "@/server/queries/fetch-shot-assets";

export default function Story({
  taskId,
  onNext,
}: {
  taskId: string;
  onNext: () => void;
}) {
  const [taskData, setTaskData] = useState<Story>();

  useEffect(() => {
    async function getStory() {
      let storedTasksData = localStorage.getItem("stories");
      if (storedTasksData) {
        storedTasksData = JSON.parse(storedTasksData);
        //@ts-expect-error for now
        const taskData = storedTasksData?.filter(
          (f: Story) => Number(f.finalShowId) === Number(taskId)
        )[0];
        if (!taskData) {
          const data = await fetchStoryData(taskId);

          setTaskData(data);
        } else setTaskData(taskData);
      }
    }
    getStory();
  }, [taskId]);

  if (!taskData) {
    return <Loading text="story" />;
  }

  return (
    <div>
      <Heading
        heading="Story"
        subHeading="View your story details and script"
        rightElement={
          onNext && (
            <Button
              onClick={onNext}
              variant="outline"
              rightIcon={<ArrowRightIcon className="text-white" />}
              noise="none"
              className="font-fm-poppins rounded-lg"
              innerClassName="rounded-lg"
            >
              Continue
            </Button>
          )
        }
      />
      <div className="flex justify-center gap-7">
        <div className="w-1/2 space-y-7">
          <div className="bg-fm-neutral-0! font-fm-poppins p-4! rounded-xl relative">
            <TextArea
              id="script-text"
              minHeight={196}
              maxHeight={400}
              maxLength={2000}
              placeholder="Once upon a time, in a world where..."
              value={taskData.scriptText}
              autoGrow
              // onChange={(e) => setScriptText(e.target.value)}
              classes={{
                textarea: "border-0 bg-fm-neutral-0! p-0! font-fm-poppins",
              }}
            />
            <div className="absolute bottom-2 right-4 flex items-center gap-2">
              <button
                type="button"
                className="p-2 hover:bg-fm-surface-secondary rounded-full transition-colors"
                aria-label="Delete story"
              >
                <TrashIcon className="size-5 text-red-500" />
              </button>
              <button
                type="button"
                className="p-2 hover:bg-fm-surface-secondary rounded-full transition-colors"
                aria-label="Edit story"
              >
                <PencilIcon className="size-5 text-white" />
              </button>
            </div>
          </div>
          <Button
            isDisabled
            variant="outline"
            noise="none"
            className="font-fm-poppins rounded-sm w-full"
            innerClassName={cn(
              "border-none bg-[#833AFF] rounded-lg font-fm-poppins text-fm-lg text-white"
            )}
          >
            <span className="border-none">Re-generate Anime</span>
          </Button>
        </div>
        <div className="space-y-6 flex-1">
          <div className="bg-fm-surface-secondary rounded-lg border border-fm-divider-primary p-6">
            <h2 className="text-xl text-fm-primary mb-4">
              {taskData.showName}
            </h2>
            <div className="space-y-4">
              <div>
                <p className="text-sm text-fm-secondary-800 mb-2">Task ID</p>
                <p className="text-fm-primary">{taskId}</p>
              </div>
              <div>
                <p className="text-sm text-fm-secondary-800 mb-2">Status</p>
                <span
                  className={`inline-block px-3 py-1 rounded-full text-sm font-semibold ${
                    taskData.status === "COMPLETED" ||
                    taskData.status === "SUCCESS"
                      ? "bg-green-500/20 text-green-400"
                      : taskData.status === "FAILED"
                      ? "bg-red-500/20 text-red-400"
                      : "bg-yellow-500/20 text-yellow-400"
                  }`}
                >
                  {taskData.status}
                </span>
              </div>
              {taskData.createdAt && (
                <div>
                  <p className="text-sm text-fm-secondary-800 mb-2">Created</p>
                  <p className="text-fm-primary">
                    {new Date(taskData.createdAt).toLocaleDateString("en-US", {
                      month: "long",
                      day: "numeric",
                      year: "numeric",
                      hour: "2-digit",
                      minute: "2-digit",
                    })}
                  </p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
