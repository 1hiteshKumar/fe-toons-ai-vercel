"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { useRouter } from "next/navigation";
import Link from "next/link";
import Image from "next/image";
import { API_URLS, TABS } from "@/server/constants";
import { GeneratingStatus, ShotAssets } from "@/lib/types";
import { cn } from "@/aural/lib/utils";
import { toast } from "sonner";
import usePolling, { PollingProvider } from "@/lib/hooks/use-polling";

import {
  CharactersIcon,
  Pencil,
  PublishIcon,
  ShotImagesIcon,
  ShotVideosIcon,
  ScenesIcon,
  StoryIcon,
  EditorIcon,
} from "@/lib/icons";

import Characters from "../home/dashboard/characters";
const Editor = dynamic(() => import("../home/dashboard/editor"));
const ShotImages = dynamic(() => import("../home/dashboard/shot-images"));
const Story = dynamic(() => import("../home/dashboard/story"));
const Scenes = dynamic(() => import("../home/dashboard/scenes"));
const Publish = dynamic(() => import("../home/dashboard/publish"));
const ShotVideos = dynamic(() => import("../home/dashboard/shot-videos"));

const iconMap: Record<string, React.ComponentType<{ className?: string }>> = {
  story: StoryIcon,
  scenes: ScenesIcon,
  characters: CharactersIcon,
  "shot-images": ShotImagesIcon,
  editor: EditorIcon,
  "shot-videos": ShotVideosIcon,
  publish: PublishIcon,
};

export type TabId = (typeof TABS)[number]["id"];

function DashboardContent({ taskId }: { taskId: string }) {
  const [active, setActive] = useState<TabId>("shot-images");
  const router = useRouter();

  const [shotAssets, setShotAssets] = useState<ShotAssets | null>(null);

  const { poll, stopPolling } = usePolling();

  const [generatingStatus, setGeneratingStatus] =
    useState<GeneratingStatus>("PENDING");

    const [characterToAvatarMapping, setCharacterToAvatarMapping] = useState({});

  useEffect(() => {
    const isSharedTabs = ["shot-images", "shot-videos", "publish"].includes(
      active
    );

    if (isSharedTabs && !shotAssets) {
      const pollingKey = `shot_assets_${taskId}`;
      poll({
        url: API_URLS.FETCH_SHOT_ASSETS({ taskId }),
        pollingKey,
        delay: 5000,
        callback: async (res: ShotAssets | null) => {
          const status = res?.task?.status;
          setShotAssets(res);
          if (status === "COMPLETED" || status === "FAILED") {
            setGeneratingStatus(status);
            stopPolling(pollingKey);
            if (status === "COMPLETED") {
              toast.success("Shot assets ready");
            } else {
              toast.error("Something went wrong while generating shots");
            }
          }
        },
      });
    }
  }, [active, poll, shotAssets, stopPolling, taskId]);

  return (
    <div className="flex flex-col h-full w-full">
      <nav className="w-full p-5  flex items-center gap-0 justify-between border-b border-neutral-800 overflow-x-auto">
        <div className="shrink-0">
          <Link href="/">
            <Image
              src="/images/pockettoons-logo.webp"
              alt="PocketToons Logo"
              width={120}
              height={40}
              className="h-10 w-auto"
              priority
            />
          </Link>
        </div>
        <div className="flex gap-1 items-center justify-center bg-black rounded-xl">
          {TABS.map(({ id, label }) => {
            const Icon = iconMap[id];
            const isActive = active === id;
            return (
              <button
                key={id}
                onClick={() => {
                  setActive(id);
                }}
                className={cn(
                  "flex gap-2 items-center justify-center rounded-xl py-3.5 px-4 transition-all duration-200 relative group cursor-pointer hover:text-[#833AFF] font-poppins",
                  isActive ? "bg-white" : "bg-black hover:bg-white"
                )}
              >
                {Icon && (
                  <Icon
                    className={cn(
                      "size-3 transition-colors",
                      isActive
                        ? "text-[#833AFF]"
                        : "text-neutral-500 group-hover:text-[#833AFF]"
                    )}
                  />
                )}
                <span
                  className={cn(
                    "text-sm font-bold uppercase tracking-wider transition-colors text-nowrap",
                    isActive
                      ? "text-[#833AFF]"
                      : "text-neutral-500 group-hover:text-[#833AFF]"
                  )}
                >
                  {label}
                </span>
              </button>
            );
          })}
        </div>
        <button
          onClick={() => router.push("/")}
          className={cn(
            "flex gap-2 items-center justify-center rounded-xl py-3.5 px-3 transition-all duration-200 relative group cursor-pointer bg-[#833AFF] font-poppins"
          )}
        >
          <Pencil className="size-5" />

          <span
            className={cn(
              "text-sm font-bold tracking-wider transition-colors text-nowrap"
            )}
          >
            New Story
          </span>
        </button>
      </nav>
      <main className="flex-1 p-5  overflow-y-scroll">
        {active === "story" && (
          <Story onNext={() => setActive("characters")} taskId={taskId} />
        )}
        {active === "scenes" && (
          <Scenes onNext={() => setActive("shot-images")} characterToAvatarMapping={characterToAvatarMapping} />
        )}
        {active === "characters" && (
          <Characters onNext={() => setActive("scenes")} setCharacterToAvatarMapping={setCharacterToAvatarMapping} />
        )}
        {active === "shot-images" && (
          <ShotImages
            data={shotAssets}
            onNext={() => setActive("shot-videos")}
            generatingStatus={generatingStatus}
          />
        )}
        {active === "editor" && <Editor onNext={() => setActive("publish")} />}
        {active === "shot-videos" && (
          <ShotVideos
            data={shotAssets}
            onNext={() => setActive("editor")}
            generatingStatus={generatingStatus}
          />
        )}
        {active === "publish" && (
          <Publish data={shotAssets} generatingStatus={generatingStatus} />
        )}
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
