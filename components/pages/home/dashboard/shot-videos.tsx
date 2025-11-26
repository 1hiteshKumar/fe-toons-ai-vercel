"use client";

import { ShotAssets } from "@/lib/types";
import { convertGoogleDriveUrl, getGroupedShots } from "@/lib/helpers";
import Loading from "@/components/loading";
import { useMemo, useState } from "react";
import { Button } from "@/aural/components/ui/button";
import TextArea from "@/aural/components/ui/textarea";
import Heading from "@/components/heading";
import { EditBigIcon } from "@/aural/icons/edit-big-icon";
import ShotHeader from "@/components/shot-header";
import Image from "next/image";

interface StartFrame {
  sfx?: string[];
  [key: string]: unknown;
}

interface EndFrame {
  sfx?: string[];
  [key: string]: unknown;
}

interface Action {
  summary?: string;
  [key: string]: unknown;
}

export default function ShotVideos({ data }: { data: ShotAssets | null }) {
  const groupedShots = useMemo(() => getGroupedShots(data), [data]);

  const initialScene = useMemo(
    () => (groupedShots.length > 0 ? groupedShots[0].scene_beat_id : ""),
    [groupedShots]
  );

  const [selectedScene, setSelectedScene] = useState<string>(initialScene);
  const [selectedShot, setSelectedShot] = useState(0);
  const [playingVideo, setPlayingVideo] = useState<number | null>(null);

  // Update selected scene if initial scene changes and current selection is invalid
  const effectiveSelectedScene = useMemo(() => {
    const sceneExists = groupedShots.some(
      (group) => group.scene_beat_id === selectedScene
    );
    return sceneExists ? selectedScene : initialScene;
  }, [selectedScene, initialScene, groupedShots]);

  const getVideoUrl = (url: string) => {
    if (!url) return "";
    return convertGoogleDriveUrl(url);
  };

  const getImageUrl = (url: string) => {
    if (!url) return "";
    return convertGoogleDriveUrl(url);
  };

  const getCombinedSfx = (
    startFrame: StartFrame | undefined,
    endFrame: EndFrame | undefined
  ): string[] => {
    const startSfx =
      startFrame && Array.isArray(startFrame.sfx) ? startFrame.sfx : [];
    const endSfx = endFrame && Array.isArray(endFrame.sfx) ? endFrame.sfx : [];
    return [...startSfx, ...endSfx].filter(Boolean);
  };

  if (!data) {
    return <Loading text="shot videos" />;
  }

  if (!data.results || data.results.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-fm-primary text-lg">No shot videos found</p>
      </div>
    );
  }

  const selectedSceneGroup = groupedShots.find(
    (group) => group.scene_beat_id === effectiveSelectedScene
  );

  const shotsInScene = selectedSceneGroup?.shots || [];
  const selectedShotData = shotsInScene[selectedShot];
  const selectedShotVideoUrl = selectedShotData
    ? getVideoUrl(selectedShotData.single_image_video_url || "")
    : "";

  return (
    <div>
      <Heading
        heading="Shot Videos"
        subHeading="Review your generated shot videos and export your final production."
      />
      <div className="flex gap-6 w-full min-h-0 h-full">
        {/* Scene Selection - Left Column */}
        <div className="flex flex-col gap-3 shrink-0">
          <h3 className="text-sm font-semibold text-fm-secondary-800 uppercase tracking-wide shrink-0">
            Scenes
          </h3>
          <div className="flex flex-col gap-2 w-32 max-h-[65vh] overflow-y-auto min-h-0 p-1">
            {groupedShots.map(({ scene_beat_id, shots }) => {
              const total = shots.length;
              const completed = shots.filter(
                (shot) => shot.start_frame_url
              ).length;

              return (
                <Button
                  key={scene_beat_id}
                  variant={
                    effectiveSelectedScene === scene_beat_id
                      ? "primary"
                      : "secondary"
                  }
                  onClick={() => {
                    setSelectedScene(scene_beat_id);
                    setSelectedShot(0);
                  }}
                  size="sm"
                >
                  Scene {scene_beat_id}{" "}
                  <span className="bg-">
                    ({completed}/{total})
                  </span>
                </Button>
              );
            })}
          </div>
        </div>

        {/* Main Video Display - Middle Column */}
        <div className="w-84">
          <div>
            {selectedShotVideoUrl ? (
              <div className="relative aspect-9/16 w-full shrink-0 max-h-[60vh] mt-7 flex justify-center">
                <video
                  src={selectedShotVideoUrl}
                  controls
                  className="h-full object-contain"
                  onPlay={() =>
                    setPlayingVideo(selectedShotData?.id || selectedShot)
                  }
                  onPause={() => setPlayingVideo(null)}
                  onEnded={() => setPlayingVideo(null)}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-14"
                  disabled
                >
                  <EditBigIcon className="size-5" />
                  Edit Video
                </Button>
                {/* Play overlay indicator */}
                {playingVideo === (selectedShotData?.id || selectedShot) && (
                  <div className="absolute top-2 right-2 bg-fm-primary-600 text-white px-2 py-1 rounded text-xs font-semibold flex items-center gap-1 z-10">
                    <span className="w-2 h-2 bg-white rounded-full animate-pulse" />
                    Playing
                  </div>
                )}
              </div>
            ) : (
              <div className="aspect-9/16 flex items-center justify-center text-fm-secondary-800 bg-fm-surface-tertiary shrink-0">
                <div className="text-center">
                  <svg
                    className="w-12 h-12 mx-auto mb-2 opacity-50"
                    fill="none"
                    stroke="currentColor"
                    viewBox="0 0 24 24"
                  >
                    <path
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      strokeWidth={2}
                      d="M15 10l4.553-2.276A1 1 0 0121 8.618v6.764a1 1 0 01-1.447.894L15 14M5 18h8a2 2 0 002-2V8a2 2 0 00-2-2H5a2 2 0 00-2 2v8a2 2 0 002 2z"
                    />
                  </svg>
                  <p className="text-sm">No video available</p>
                </div>
              </div>
            )}
          </div>
        </div>

        {/* Shot List - Right Column */}
        <div className="flex flex-col flex-1 min-w-0 space-y-3 max-h-[75vh]">
          <h3 className="text-sm font-semibold text-fm-secondary-800 uppercase tracking-wide shrink-0">
            Videos ({shotsInScene.length})
          </h3>
          <div className="flex-1 space-y-2 overflow-y-auto min-h-0">
            {shotsInScene.map((shot, index) => {
              const isSelected = index === selectedShot;
              const shotStartFrame = shot.panel_data?.start_frame as
                | StartFrame
                | undefined;
              const shotEndFrame = shot.panel_data?.end_frame as
                | EndFrame
                | undefined;
              const shotAction = shot.panel_data?.action as Action | undefined;
              const shotSfxList = getCombinedSfx(shotStartFrame, shotEndFrame);
              const shotDescription = shotAction?.summary || "";

              return (
                <div
                  key={shot.id}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`Select shot ${index + 1}`}
                  onClick={() => setSelectedShot(index)}
                  className={`w-full text-left p-3 rounded-lg border flex transition-all duration-200 shrink-0 ${
                    isSelected
                      ? "border-fm-primary  shadow-sm"
                      : "border-fm-divider-primary bg-fm-surface-secondary hover:border-fm-divider-contrast"
                  }`}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="flex-1 min-w-0 space-y-4">
                      <ShotHeader duration="4s" shotNumber={index + 1} />
                      {shotDescription && (
                        <div className="space-y-0.5">
                          <p className="text-fm-sm font-medium text-fm-secondary-600 uppercase tracking-wide">
                            Cinematography Description
                          </p>
                          <TextArea
                            value={shotDescription}
                            className="text-xs text-fm-secondary-800 line-clamp-2 leading-relaxed wrap-break-word"
                          />
                        </div>
                      )}
                      {shotSfxList.length > 0 && (
                        <div className="space-y-0.5">
                          <p className="text-fm-sm font-medium text-fm-secondary-600 uppercase tracking-wide">
                            SFX
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {shotSfxList.slice(0, 2).map((sfx, sfxIndex) => (
                              <span
                                key={sfxIndex}
                                className="inline-flex items-center px-2 py-0.5 rounded text-[10px] font-medium bg-fm-primary-100 text-fm-primary-700 border border-fm-primary-300"
                              >
                                {sfx}
                              </span>
                            ))}
                            {shotSfxList.length > 2 && (
                              <span className="text-[10px] text-fm-secondary-600">
                                +{shotSfxList.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    {shot.start_frame_url ? (
                      <div className="relative w-20 h-28 shrink-0 rounded-lg overflow-hidden border border-fm-divider-primary">
                        <Image
                          src={getImageUrl(shot.start_frame_url)}
                          alt={`Shot ${index + 1} preview`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      </div>
                    ) : (
                      <div className="w-20 h-28 shrink-0 rounded-lg bg-fm-surface-tertiary border border-fm-divider-primary flex items-center justify-center">
                        <p className="text-fm-sm text-center px-1">No image</p>
                      </div>
                    )}
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </div>
    </div>
  );
}
