"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { API_URLS, TABS } from "@/server/constants";
import ShotImages from "../home/dashboard/shot-images";
import { ShotAssets } from "@/lib/types";
import ShotVideos from "../home/dashboard/shot-videos";
import Publish from "../home/dashboard/publish";
import { cn } from "@/aural/lib/utils";
import { toast } from "sonner";
import usePolling, { PollingProvider } from "@/lib/hooks/use-polling";
import {
  CharactersIcon,
  PublishIcon,
  ScenesIcon,
  ShotImagesIcon,
  ShotVideosIcon,
} from "@/lib/icons";

const Characters = dynamic(() => import("../home/dashboard/characters"));
const Scenes = dynamic(() => import("../home/dashboard/scenes"));

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  scenes: ScenesIcon,
  characters: CharactersIcon,
  "shot-images": ShotImagesIcon,
  "shot-videos": ShotVideosIcon,
  publish: PublishIcon,
};

export type TabId = (typeof TABS)[number]["id"];

function DashboardContent({ taskId }: { taskId: string }) {
  const [active, setActive] = useState<TabId>("shot-videos");

  const [shotAssets, setShotAssets] = useState<ShotAssets | null>(null);

  const { poll, stopPolling } = usePolling();

  useEffect(() => {
    const isSharedTabs = ["shot-images", "shot-videos", "publish"].includes(
      active
    );

    if (isSharedTabs && !shotAssets) {
      const pollingKey = `shot_assets_${taskId}`;
      toast.success(
        "We are generating best results for you. This may take some time"
      );
      poll({
        url: API_URLS.FETCH_SHOT_ASSETS({ taskId }),
        pollingKey,
        delay: 5000,
        callback: async (res: ShotAssets | null) => {
          const status = res?.task?.status;
          setShotAssets(res);
          if (status === "COMPLETED" || status === "FAILED") {
            stopPolling(pollingKey);
            if (status === "COMPLETED") {
              toast("Shot assets ready");
            }
          }
        },
      });
    }
  }, [active, poll, shotAssets, stopPolling, taskId]);

  return (
    <div className="flex flex-col h-full w-full">
      <nav className="w-full flex items-center justify-start bg-black border-b border-neutral-800">
        {TABS.map(({ id, label }) => {
          const Icon = iconMap[id];
          const isActive = active === id;
          return (
            <button
              key={id}
              onClick={() => setActive(id)}
              className={cn(
                "flex gap-2 items-center justify-center py-4 px-6 transition-all duration-200 relative group cursor-pointer min-w-[100px] hover:text-white",
                isActive
                  ? "bg-linear-to-r from-purple-900 via-purple-700 to-pink-600"
                  : "bg-black hover:bg-neutral-900"
              )}
            >
              {Icon && (
                <Icon
                  className={cn(
                    "size-4 transition-colors",
                    isActive
                      ? "text-white"
                      : "text-neutral-500 group-hover:text-white"
                  )}
                />
              )}
              <span
                className={cn(
                  "text-sm font-semibold uppercase tracking-wider transition-colors",
                  isActive
                    ? "text-white"
                    : "text-neutral-500 group-hover:text-white"
                )}
              >
                {label}
              </span>
            </button>
          );
        })}
      </nav>
      <main className="flex-1 p-5 overflow-y-scroll">
        {active === "scenes" && <Scenes />}
        {active === "characters" && <Characters />}
        {active === "shot-images" && <ShotImages data={shotAssets} />}
        {active === "shot-videos" && <ShotVideos data={shotAssets} />}
        {active === "publish" && <Publish data={shotAssets} />}
      </main>
    </div>
  );
}

export default function Dashboard({ taskId }: { taskId: string }) {
  return (
    <PollingProvider>
      <DashboardContent taskId={taskId} />
    </PollingProvider>
  );
}
