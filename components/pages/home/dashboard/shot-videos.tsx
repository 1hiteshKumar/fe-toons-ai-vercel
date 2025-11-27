"use client";

import { GeneratingStatus, ShotAssets } from "@/lib/types";
import { convertGoogleDriveUrl, getGroupedShots } from "@/lib/helpers";
import Loading from "@/components/loading";
import { useMemo, useState, useRef, useEffect } from "react";
import { Button } from "@/aural/components/ui/button";
import TextArea from "@/aural/components/ui/textarea";
import Heading from "@/components/heading";
import { EditBigIcon } from "@/aural/icons/edit-big-icon";
import ShotHeader from "@/components/shot-header";
import Image from "next/image";
import ArrowRightIcon from "@/aural/icons/arrow-right-icon";
import { cn } from "@/aural/lib/utils";

interface StartFrame {
  sfx?: string[];
  narration?: string | null;
  frame_visual?: string;
  dialogue?: Record<string, string | null>;
  thought?: Record<string, string | null>;
  [key: string]: unknown;
}

interface EndFrame {
  sfx?: string[];

  [key: string]: unknown;
}

export default function ShotVideos({
  data,
  onNext,
  generatingStatus,
}: {
  data: ShotAssets | null;
  onNext?: () => void;
  generatingStatus: GeneratingStatus;
}) {
  const groupedShots = useMemo(() => getGroupedShots(data), [data]);

  const initialScene = useMemo(
    () => (groupedShots.length > 0 ? groupedShots[0].scene_beat_id : ""),
    [groupedShots]
  );

  const [selectedScene, setSelectedScene] = useState<string>(initialScene);
  const [selectedShot, setSelectedShot] = useState(0);
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldAutoPlayRef = useRef(false);
  const shotListRef = useRef<HTMLDivElement>(null);
  const shotRefs = useRef<Map<number, HTMLDivElement>>(new Map());

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

  const moveToNextShot = () => {
    const selectedSceneGroup = groupedShots.find(
      (group) => group.scene_beat_id === effectiveSelectedScene
    );
    const shotsInScene = selectedSceneGroup?.shots || [];

    // Set flag to auto-play next shot
    shouldAutoPlayRef.current = true;

    // Check if there's a next shot in the current scene
    if (selectedShot < shotsInScene.length - 1) {
      setSelectedShot(selectedShot + 1);
    } else {
      // Move to the next scene
      const currentSceneIndex = groupedShots.findIndex(
        (group) => group.scene_beat_id === effectiveSelectedScene
      );
      if (currentSceneIndex < groupedShots.length - 1) {
        const nextScene = groupedShots[currentSceneIndex + 1];
        setSelectedScene(nextScene.scene_beat_id);
        setSelectedShot(0);
      }
    }
  };

  // Auto-play video when moving to next shot
  useEffect(() => {
    if (shouldAutoPlayRef.current && videoRef.current && data) {
      const selectedSceneGroup = groupedShots.find(
        (group) => group.scene_beat_id === effectiveSelectedScene
      );
      const shotsInScene = selectedSceneGroup?.shots || [];
      const currentShotData = shotsInScene[selectedShot];
      const videoUrl = currentShotData
        ? getVideoUrl(currentShotData.single_image_video_url || "")
        : "";

      if (videoUrl) {
        // Small delay to ensure video element is ready
        const timer = setTimeout(() => {
          videoRef.current?.play().catch(() => {
            // Ignore autoplay errors
          });
        }, 150);
        return () => clearTimeout(timer);
      }
    }
    shouldAutoPlayRef.current = false;
  }, [selectedShot, effectiveSelectedScene, groupedShots, data]);

  // Scroll selected shot into view
  useEffect(() => {
    const shotElement = shotRefs.current.get(selectedShot);
    if (shotElement) {
      shotElement.scrollIntoView({
        behavior: "smooth",
        block: "nearest",
      });
    }
  }, [selectedShot, effectiveSelectedScene]);

  if (
    !data?.results.length &&
    (generatingStatus === "IN_PROGRESS" || generatingStatus === "PENDING")
  ) {
    return <Loading text="shot videos" />;
  }

  if (!data?.results.length) {
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
      <div className="flex gap-6 w-full min-h-0 h-full">
        {/* Scene Selection - Left Column */}
        <div className="flex flex-col gap-3 shrink-0">
          {/* <h3 className="text-sm font-semibold text-fm-secondary-800 uppercase tracking-wide shrink-0">
            Scenes
          </h3> */}
          <div className="flex flex-col gap-4 w-full max-h-[70vh] overflow-y-auto min-h-0 py-1">
            {groupedShots.map(({ scene_beat_id, shots }) => {
              const total = shots.length;
              const completed = shots.filter(
                (shot) => shot.start_frame_url
              ).length;

              return (
                <button
                  key={scene_beat_id}
                  onClick={() => {
                    setSelectedScene(scene_beat_id);
                    setSelectedShot(0);
                  }}
                  className={cn(
                    "bg-black w-full p-4 flex items-center gap-2 rounded-xl text-nowrap font-fm-poppins text-fm-lg font-bold cursor-pointer ",
                    {
                      "bg-[#833AFF]": effectiveSelectedScene === scene_beat_id,
                    }
                  )}
                >
                  <span> Scene {scene_beat_id} </span>
                  <span
                    className={cn("bg-[#2A2A2A] rounded-[100px] p-2 ", {
                      "bg-[#4207A5]": effectiveSelectedScene === scene_beat_id,
                    })}
                  >
                    ({completed}/{total})
                  </span>
                </button>
              );
            })}
          </div>
        </div>

        {/* Main Video Display - Middle Column */}
        <div className="w-92">
          <div
            className={cn(
              "relative aspect-9/16 w-full shrink-0 max-h-[70vh] rounded-lg overflow-hidden",
              !selectedShotVideoUrl && "bg-fm-surface-tertiary animate-pulse"
            )}
          >
            {selectedShotVideoUrl && (
              <>
                <video
                  ref={videoRef}
                  src={selectedShotVideoUrl}
                  controls
                  className="h-full object-cover w-full"
                  onEnded={() => {
                    moveToNextShot();
                  }}
                />
                <Button
                  variant="outline"
                  size="sm"
                  className="absolute top-2 right-6"
                  disabled
                >
                  <EditBigIcon className="size-5" />
                  Edit Video
                </Button>
              </>
            )}
          </div>
        </div>

        {/* Shot List - Right Column */}
        <div className="flex flex-col flex-1 min-w-0 space-y-3 max-h-[70vh]">
          {/* <h3 className="text-sm font-semibold text-fm-secondary-800 uppercase tracking-wide shrink-0">
            Videos ({shotsInScene.length})
          </h3> */}
          <div
            ref={shotListRef}
            className="flex-1 space-y-2 overflow-y-auto min-h-0"
          >
            {shotsInScene.map((shot, index) => {
              const isSelected = index === selectedShot;
              const shotStartFrame = shot.panel_data?.start_frame as
                | StartFrame
                | undefined;
              const shotEndFrame = shot.panel_data?.end_frame as
                | EndFrame
                | undefined;
              const shotSfxList = getCombinedSfx(shotStartFrame, shotEndFrame);
              const shotDescription =
                shot.panel_data?.start_frame?.frame_description || "";

              return (
                <div
                  key={shot.id}
                  ref={(el) => {
                    if (el) {
                      shotRefs.current.set(index, el);
                    } else {
                      shotRefs.current.delete(index);
                    }
                  }}
                  role="button"
                  tabIndex={0}
                  aria-pressed={isSelected}
                  aria-label={`Select shot ${index + 1}`}
                  onClick={() => setSelectedShot(index)}
                  className={`w-full text-left p-5 rounded-xl bg-black transition-all duration-200 shrink-0 `}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="flex-1 min-w-0 space-y-4">
                      <ShotHeader
                        type="Video"
                        duration={
                          selectedShotData.panel_prompt_data?.duration || 5
                        }
                        shotNumber={index + 1}
                      />
                      {shotDescription && (
                        <div className="space-y-0.5">
                          <p className="text-fm-sm font-medium uppercase text-[#AB79FF] tracking-wider">
                            Description:
                          </p>
                          <p className="font-fm-poppins text-fm-md">
                            {shotDescription}
                          </p>
                        </div>
                      )}

                      {shotStartFrame?.narration && (
                        <div className="space-y-0.5 w-full">
                          <p className="text-fm-sm font-medium uppercase text-[#AB79FF] tracking-wider">
                            Narration:
                          </p>

                          <p className="font-fm-poppins text-fm-md">
                            {shotStartFrame.narration}
                          </p>
                        </div>
                      )}
                      {shotStartFrame?.dialogue &&
                        Object.values(shotStartFrame.dialogue).some(
                          (value) => value !== null && value !== ""
                        ) && (
                          <div className="space-y-1.5 w-full">
                            <p className="text-fm-sm font-medium uppercase text-[#AB79FF] tracking-wider">
                              Dialogue:
                            </p>
                            <div className="space-y-2">
                              {Object.entries(shotStartFrame.dialogue).map(
                                ([character, text]) => {
                                  if (!text) return null;
                                  return (
                                    <p
                                      key={character}
                                      className="font-fm-poppins text-fm-md"
                                    >
                                      <span>{character}:</span> {text}
                                    </p>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        )}
                      {shotStartFrame?.thought &&
                        Object.values(shotStartFrame.thought).some(
                          (value) => value !== null && value !== ""
                        ) && (
                          <div className="space-y-2 w-full">
                            <p className="text-fm-sm font-medium uppercase text-[#AB79FF] tracking-wider">
                              Thought:
                            </p>
                            <div className="space-y-2">
                              {Object.entries(shotStartFrame.thought).map(
                                ([character, text]) => {
                                  if (!text) return null;
                                  return (
                                    <p
                                      key={character}
                                      className="font-fm-poppins text-fm-md"
                                    >
                                      <span>{character}:</span> {text}
                                    </p>
                                  );
                                }
                              )}
                            </div>
                          </div>
                        )}
                      {shotSfxList.length > 0 && (
                        <div className="space-y-0.5">
                          <p className="text-fm-sm font-medium uppercase text-[#AB79FF] tracking-wider">
                            SFX:
                          </p>
                          <div className="flex flex-wrap gap-1">
                            {shotSfxList.slice(0, 2).map((sfx, sfxIndex) => (
                              <span
                                key={sfxIndex}
                                className="inline-flex items-center px-2 py-1 rounded text-fm-xs font-medium bg-[#1F1F1F] text-fm-primary "
                              >
                                {sfx}
                              </span>
                            ))}
                            {shotSfxList.length > 2 && (
                              <span className="text-fm-xs text-fm-secondary-600">
                                +{shotSfxList.length - 2}
                              </span>
                            )}
                          </div>
                        </div>
                      )}
                    </div>
                    <div
                      className={cn(
                        "relative  w-31 h-54 shrink-0 rounded-lg overflow-hidden border border-fm-divider-primary",
                        !shot.start_frame_url &&
                          "animate-pulse bg-fm-surface-tertiary"
                      )}
                    >
                      {shot.start_frame_url && (
                        <Image
                          src={getImageUrl(shot.start_frame_url)}
                          alt={`Shot ${index + 1} preview`}
                          fill
                          className="object-cover"
                          unoptimized
                        />
                      )}
                    </div>
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
