"use client";

import { ShotAssets } from "@/lib/types";
import Image from "next/image";
import { convertGoogleDriveUrl, getGroupedShots } from "@/lib/helpers";
import Loading from "@/components/loading";
import { useMemo, useState, useRef, useEffect } from "react";
import { Button } from "@/aural/components/ui/button";
import TextArea from "@/aural/components/ui/textarea";
import Heading from "@/components/heading";
import { EditBigIcon } from "@/aural/icons/edit-big-icon";
import ShotHeader from "@/components/shot-header";
import { Tag } from "@/aural/components/ui/tag";
import ArrowRightIcon from "@/aural/icons/arrow-right-icon";
import { PlayPauseIcon } from "@/aural/icons/play-pause-icon";
import { cn } from "@/aural/lib/utils";

export default function ShotImages({
  data,
  onNext,
}: {
  data: ShotAssets | null;
  onNext?: () => void;
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

  if (!data) {
    return <Loading text="shot images" />;
  }

  if (!data.results || data.results.length === 0) {
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
              leftIcon={<ArrowRightIcon className="text-white" />}
              innerClassName="bg-linear-to-r from-purple-900 via-purple-700 to-pink-600 text-white border-none"
              noise="none"
            >
              Continue to Next Step
            </Button>
          )
        }
      />
      <div className="flex gap-6 w-full min-h-0 h-full">
        {/* Scene Selection - Left Column */}
        <div className="flex flex-col gap-3 shrink-0">
          <h3 className="text-sm font-semibold text-fm-secondary-800 uppercase tracking-wide shrink-0">
            Scenes
          </h3>
          <div className="flex flex-col gap-2 max-h-[65vh] w-32 overflow-auto min-h-0 py-1">
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
                  className="w-full"
                >
                  Scene {scene_beat_id} ({completed}/{total})
                </Button>
              );
            })}
          </div>
        </div>

        {/* Main Image Display - Middle Column */}
        <div className="w-84">
          <div className="rounded-xl  overflow-hidden h-full flex flex-col">
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

            <div
              className={cn(
                "relative aspect-9/16 w-full shrink-0 max-h-[60vh] mt-7 rounded-lg overflow-hidden",
                !selectedShotImageUrl && "bg-fm-surface-tertiary animate-pulse"
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
                    className="object-contain"
                    unoptimized
                  />
                  <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-2 right-14"
                  >
                    <EditBigIcon className="size-5" />
                    Edit Image
                  </Button>
                  {selectedShotData?.audio_url && (
                    <Button
                      variant="secondary"
                      size="sm"
                      className="absolute bottom-2 right-12"
                      onClick={toggleAudio}
                    >
                      <PlayPauseIcon isPlaying={isPlaying} className="size-5" />
                    </Button>
                  )}
                </>
              )}
            </div>
          </div>
        </div>

        {/* Shot List - Right Column */}
        <div className="flex flex-col flex-1 min-w-0 max-h-[75vh] space-y-3 shrink-0">
          <h3 className="text-sm font-semibold text-fm-secondary-800 uppercase tracking-wide shrink-0">
            Shots ({shotsInScene.length})
          </h3>
          <div
            ref={shotListRef}
            className="flex-1 space-y-2 overflow-y-auto min-h-0"
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
                  className={`w-full text-left p-3 rounded-lg border transition-all duration-200 shrink-0 ${
                    isSelected
                      ? "border-fm-secondary-800  shadow-sm"
                      : "border-fm-divider-primary bg-fm-surface-secondary hover:border-fm-divider-contrast"
                  }`}
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
                      <div className="flex gap-2">
                        {shotStartFrame?.frame_visual && (
                          <div className="space-y-0.5 w-full">
                            <p className="text-fm-sm font-medium text-fm-secondary-600 uppercase tracking-wide">
                              Shot Description
                            </p>
                            <TextArea
                              value={shotStartFrame.frame_visual}
                              className="text-xs text-fm-secondary-800 line-clamp-2 leading-relaxed wrap-break-word"
                            />
                          </div>
                        )}
                        {shotStartFrame?.narration && (
                          <div className="space-y-0.5 w-full">
                            <p className="text-fm-sm font-medium text-fm-secondary-600 uppercase tracking-wide">
                              Narration
                            </p>
                            <TextArea
                              value={shotStartFrame.narration}
                              className="text-xs text-fm-secondary-800 line-clamp-2 leading-relaxed wrap-break-word rounded-md"
                            />
                          </div>
                        )}
                        {shotStartFrame?.dialogue &&
                          Object.values(shotStartFrame.dialogue).some(
                            (value) => value !== null && value !== ""
                          ) && (
                            <div className="space-y-1.5 w-full">
                              <p className="text-fm-sm font-medium text-fm-secondary-600 uppercase tracking-wide">
                                Dialogue
                              </p>
                              <div className="space-y-2">
                                {Object.entries(shotStartFrame.dialogue).map(
                                  ([character, text]) => {
                                    if (!text) return null;
                                    return (
                                      <div
                                        key={character}
                                        className="rounded-xs border border-fm-divider-primary bg-fm-surface-secondary py-2 px-4 space-y-1.5"
                                      >
                                        <Tag
                                          variant="system"
                                          color="neutral"
                                          emphasis="secondary"
                                          size="xs"
                                          className="bg-fm-surface-tertiary rounded-md"
                                        >
                                          {character}
                                        </Tag>
                                        <p className="text-xs text-fm-secondary-800 italic leading-relaxed wrap-break-word">
                                          {text}
                                        </p>
                                      </div>
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
                              <p className="text-fm-sm font-medium text-fm-secondary-600 uppercase tracking-wide">
                                Thought
                              </p>
                              <div className="space-y-2">
                                {Object.entries(shotStartFrame.thought).map(
                                  ([character, text]) => {
                                    if (!text) return null;
                                    return (
                                      <div
                                        key={character}
                                        className="rounded-xs border border-fm-divider-primary bg-fm-surface-secondary py-2 px-4 space-y-1.5"
                                      >
                                        <Tag
                                          variant="system"
                                          color="neutral"
                                          emphasis="secondary"
                                          size="xs"
                                          className="bg-fm-surface-tertiary rounded-md"
                                        >
                                          {character}
                                        </Tag>
                                        <p className="text-xs text-fm-secondary-800 italic leading-relaxed wrap-break-word">
                                          {text}
                                        </p>
                                      </div>
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
                        "relative w-20 h-28 shrink-0 rounded-lg overflow-hidden border border-fm-divider-primary",
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
