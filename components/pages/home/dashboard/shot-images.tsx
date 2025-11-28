"use client";

import { GeneratingStatus, ShotAssets } from "@/lib/types";
import Image from "next/image";
import { convertGoogleDriveUrl, getGroupedShots } from "@/lib/helpers";
import Loading from "@/components/loading";
import { useMemo, useState, useRef, useEffect } from "react";
import { Button } from "@/aural/components/ui/button";
import Heading from "@/components/heading";
import { EditBigIcon } from "@/aural/icons/edit-big-icon";
import ShotHeader from "@/components/shot-header";
import ArrowRightIcon from "@/aural/icons/arrow-right-icon";
import { PlayPauseIcon } from "@/aural/icons/play-pause-icon";
import { cn } from "@/aural/lib/utils";

export default function ShotImages({
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
  const [isPlaying, setIsPlaying] = useState(false);
  const audioRef = useRef<HTMLAudioElement>(null);
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

  const getImageUrl = (url: string) => {
    if (!url) return "";
    return convertGoogleDriveUrl(url);
  };

  // Reset audio when shot changes
  useEffect(() => {
    if (audioRef.current) {
      audioRef.current.pause();
      audioRef.current.currentTime = 0;
    }
  }, [selectedShot, effectiveSelectedScene]);

  // Auto-play audio when moving to next shot
  useEffect(() => {
    if (shouldAutoPlayRef.current) {
      const selectedSceneGroup = groupedShots.find(
        (group) => group.scene_beat_id === effectiveSelectedScene
      );
      const shotsInScene = selectedSceneGroup?.shots || [];
      const currentShotData = shotsInScene[selectedShot];

      if (currentShotData?.audio_url && audioRef.current) {
        // Small delay to ensure audio element is ready
        const timer = setTimeout(() => {
          audioRef.current?.play().catch(() => {
            // Ignore autoplay errors
          });
        }, 150);
        return () => clearTimeout(timer);
      }
      shouldAutoPlayRef.current = false;
    }
  }, [selectedShot, effectiveSelectedScene, groupedShots]);

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
    return <Loading text="shot images" />;
  }

  if (!data?.results.length) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-fm-primary text-lg">No shot images found</p>
      </div>
    );
  }

  const selectedSceneGroup = groupedShots.find(
    (group) => group.scene_beat_id === effectiveSelectedScene
  );

  const shotsInScene = selectedSceneGroup?.shots || [];
  const selectedShotData = shotsInScene[selectedShot];
  const selectedShotImageUrl = selectedShotData
    ? getImageUrl(selectedShotData.start_frame_url || "")
    : "";

  const toggleAudio = () => {
    if (!audioRef.current || !selectedShotData?.audio_url) return;

    if (isPlaying) {
      audioRef.current.pause();
      setIsPlaying(false);
    } else {
      audioRef.current.play();
      setIsPlaying(true);
    }
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

  return (
    <div>
      <Heading
        heading="Shot Images"
        subHeading="View and edit your shot images, dialogue, actions, and narration."
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
          <div className="flex flex-col gap-4 max-h-[70vh] w-full overflow-auto min-h-0 py-1">
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

        {/* Main Image Display - Middle Column */}
        <div className="w-84">
          <div className="rounded-lg w-full overflow-hidden h-full flex flex-col">
            {selectedShotData?.audio_url && (
              <audio
                key={`${effectiveSelectedScene}-${selectedShot}`}
                ref={audioRef}
                src={selectedShotData.audio_url}
                onEnded={() => {
                  setIsPlaying(false);
                  moveToNextShot();
                }}
                onPause={() => setIsPlaying(false)}
                onPlay={() => setIsPlaying(true)}
                onLoadStart={() => setIsPlaying(false)}
                className="hidden"
              />
            )}

            <div className="relative w-full">
              <div className="relative bg-fm-surface-secondary rounded-2xl p-2.5 overflow-hidden">
                <div
                  className={cn(
                    "relative aspect-9/16 w-full shrink-0 max-h-[70vh] rounded-xl overflow-hidden",
                    !selectedShotImageUrl &&
                      "bg-fm-surface-tertiary animate-pulse"
                  )}
                >
                  {" "}
                  {selectedShotImageUrl && (
                    <>
                      {" "}
                      <Image
                        src={selectedShotImageUrl}
                        alt={`Shot ${
                          selectedShotData?.panel_number || selectedShot + 1
                        }`}
                        fill
                        className="object-contain rounded-2xl "
                        unoptimized
                      />
                      <Button
                        variant="outline"
                        size="sm"
                        className="absolute top-2 right-10"
                      >
                        <EditBigIcon className="size-5" />
                      </Button>
                      {selectedShotData?.audio_url && (
                        <Button
                          variant="outline"
                          size="sm"
                          className="absolute bottom-2 right-12"
                          onClick={toggleAudio}
                        >
                          <PlayPauseIcon
                            isPlaying={isPlaying}
                            className="size-5"
                          />
                        </Button>
                      )}
                    </>
                  )}
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Shot List - Right Column */}
        <div className="flex flex-col flex-1 min-w-0 max-h-[70vh] space-y-3 shrink-0">
          {/* <h3 className="text-sm font-semibold text-fm-secondary-800 uppercase tracking-wide shrink-0">
            Shots ({shotsInScene.length})
          </h3> */}
          <div
            ref={shotListRef}
            className="flex-1 space-y-2 overflow-y-auto min-h-0 "
          >
            {shotsInScene.map((shot, index) => {
              const isSelected = index === selectedShot;
              const shotStartFrame = shot.panel_data?.start_frame as
                | {
                    narration?: string | null;
                    frame_visual?: string;
                    dialogue?: Record<string, string | null>;
                    thought?: Record<string, string | null>;
                    [key: string]: unknown;
                  }
                | undefined;

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
                  className={cn(
                    "w-full text-left p-5 rounded-xl bg-black shrink-0",
                    {
                      "border border-[#833AFF]": isSelected,
                    }
                  )}
                >
                  <div className="flex items-start gap-3 min-w-0">
                    <div className="flex-1 min-w-0 space-y-4">
                      <ShotHeader
                        duration={
                          shot.panel_prompt_data?.duration
                            ? shot.panel_prompt_data.duration
                            : 4
                        }
                        shotNumber={index + 1}
                      />
                      <div className="flex flex-col gap-2">
                        {shotStartFrame?.frame_visual && (
                          <div className="space-y-0.5 w-full">
                            <p className="text-fm-sm font-medium uppercase text-[#AB79FF] tracking-wider">
                              Description:
                            </p>
                            <p className="font-fm-poppins text-fm-md">
                              {shotStartFrame.frame_visual}
                            </p>
                          </div>
                        )}
                        {shotStartFrame?.narration && (
                          <div className="space-y-0.5 w-full">
                            <p className="text-fm-sm font-medium uppercase text-[#AB79FF] tracking-wider">
                              Narration
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
                                        className="font-fm-poppins italic text-fm-md"
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
                                        className="font-fm-poppins italic text-fm-md"
                                      >
                                        <span>{character}:</span> {text}
                                      </p>
                                    );
                                  }
                                )}
                              </div>
                            </div>
                          )}
                      </div>
                    </div>

                    <div
                      className={cn(
                        "relative w-31 h-54 shrink-0 rounded-lg overflow-hidden border border-fm-divider-primary",
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
