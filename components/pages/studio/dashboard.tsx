"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { TABS } from "@/server/constants";
import ShotImages from "../home/dashboard/shot-images";
import fetchShotAssets from "@/server/queries/fetch-shot-assets";
import { ShotAssets } from "@/lib/types";
import ShotVideos from "../home/dashboard/shot-videos";
import Publish from "../home/dashboard/publish";
import { cn } from "@/aural/lib/utils";

const Characters = dynamic(() => import("../home/dashboard/characters"));
const Scenes = dynamic(() => import("../home/dashboard/scenes"));

// Icon components for each tab
const ScenesIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <line x1="9" y1="3" x2="9" y2="21" />
    <line x1="15" y1="3" x2="15" y2="21" />
  </svg>
);

const CharactersIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
    <circle cx="9" cy="7" r="4" />
    <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
    <path d="M16 3.13a4 4 0 0 1 0 7.75" />
  </svg>
);

const ShotImagesIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <rect x="3" y="3" width="18" height="18" rx="2" />
    <circle cx="8.5" cy="8.5" r="1.5" />
    <path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21" />
  </svg>
);

const ShotVideosIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <polygon points="5 3 19 12 5 21 5 3" />
  </svg>
);

const PublishIcon = ({ className }: { className?: string }) => (
  <svg
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
    className={className}
  >
    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
    <polyline points="17 8 12 3 7 8" />
    <line x1="12" y1="3" x2="12" y2="15" />
  </svg>
);

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  scenes: ScenesIcon,
  characters: CharactersIcon,
  "shot-images": ShotImagesIcon,
  "shot-videos": ShotVideosIcon,
  publish: PublishIcon,
};

export type TabId = (typeof TABS)[number]["id"];

export default function Dashboard({ taskId }: { taskId: string }) {
  const [active, setActive] = useState<TabId>("scenes");

  const [shotAssets, setShotAssets] = useState<ShotAssets | null>(null);

  useEffect(() => {
    const isSharedTabs = ["shot-images", "shot-videos", "publish"].includes(
      active
    );
    if (isSharedTabs && !shotAssets) {
      async function fetchData() {
        const res = await fetchShotAssets(taskId);
        setShotAssets(res);
      }
      fetchData();
    }
  }, [active, shotAssets, taskId]);

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
        {active === "scenes" && (
          <Scenes onNext={() => setActive("characters")} />
        )}
        {active === "characters" && (
          <Characters onNext={() => setActive("shot-images")} />
        )}
        {active === "shot-images" && (
          <ShotImages
            data={shotAssets}
            onNext={() => setActive("shot-videos")}
          />
        )}
        {active === "shot-videos" && (
          <ShotVideos data={shotAssets} onNext={() => setActive("publish")} />
        )}
        {active === "publish" && <Publish data={shotAssets} />}
      </main>
    </div>
  );
}
