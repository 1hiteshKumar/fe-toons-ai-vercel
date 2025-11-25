"use client";
import { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { Button } from "@/aural/components/ui/button";
import { TABS } from "@/server/constants";
import ShotImages from "../home/dashboard/shot-images";
import fetchShotAssets from "@/server/queries/fetch-shot-assets";
import { ShotAssets } from "@/lib/types";
import ShotVideos from "../home/dashboard/shot-videos";
import Publish from "../home/dashboard/publish";

const Characters = dynamic(() => import("../home/dashboard/characters"));
const Scenes = dynamic(() => import("../home/dashboard/scenes"));

export type TabId = (typeof TABS)[number]["id"];

export default function Dashboard({ taskId }: { taskId: string }) {
  const [active, setActive] = useState<TabId>("shot-videos");

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
    <>
      <aside className="w-48 flex justify-center flex-col bg-neutral-800 border-r border-fm-neutral-300 p-4 space-y-4">
        {TABS.map(({ id, label }) => (
          <Button
            key={id}
            onClick={() => setActive(id)}
            variant={active === id ? "primary" : "outline"}
            className="w-full"
          >
            {label}
          </Button>
        ))}
      </aside>
      <main className="flex-1 p-5 max-h-screen overflow-y-scroll">
        {active === "scenes" && <Scenes />}
        {active === "characters" && <Characters />}
        {active === "shot-images" && <ShotImages data={shotAssets} />}
        {active === "shot-videos" && <ShotVideos data={shotAssets} />}
        {active === "publish" && <Publish data={shotAssets} />}
      </main>
    </>
  );
}
