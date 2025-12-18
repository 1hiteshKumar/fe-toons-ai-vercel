"use client";

import { GeneratingStatus, ShotAssets } from "@/lib/types";
import { convertGoogleDriveUrl, getGroupedShots } from "@/lib/helpers";
import Loading from "@/components/loading";
import { useMemo, useState, useRef, useEffect } from "react";
import { Button } from "@/aural/components/ui/button";
import Heading from "@/components/heading";
import { EditBigIcon } from "@/aural/icons/edit-big-icon";
import ShotHeader from "@/components/shot-header";
import Image from "next/image";
import ArrowRightIcon from "@/aural/icons/arrow-right-icon";
import { cn } from "@/aural/lib/utils";
import EditVideoModal from "./edit-video-modal";
import { editPanel } from "@/server/mutations/edit-panel";

export default function ShotVideos({
  data,
  onNext,
  generatingStatus,
  onRefetch,
}: {
  data: ShotAssets | null;
  onNext?: () => void;
  generatingStatus: GeneratingStatus;
  onRefetch?: () => void;
}) {
  const groupedShots = useMemo(() => getGroupedShots(data), [data]);

  const initialScene = useMemo(
    () => (groupedShots.length > 0 ? groupedShots[0].scene_beat_id : ""),
    [groupedShots]
  );

  const [selectedScene, setSelectedScene] = useState<string>(initialScene);
  const [selectedShot, setSelectedShot] = useState(0);
  const [isEditModalOpen, setIsEditModalOpen] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);
  const shouldAutoPlayRef = useRef(false);
  const isManuallyPausedRef = useRef(false);
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

  // Auto-play video when moving to next shot (only if not manually paused)
  useEffect(() => {
    if (shouldAutoPlayRef.current && videoRef.current && data && !isManuallyPausedRef.current) {
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
          // Only play if not manually paused
          if (videoRef.current && !isManuallyPausedRef.current) {
            videoRef.current.play().catch(() => {
              // Ignore autoplay errors
            });
          }
        }, 150);
        return () => clearTimeout(timer);
      }
    }
    shouldAutoPlayRef.current = false;
  }, [selectedShot, effectiveSelectedScene, groupedShots, data]);

  // Pause video when edit modal opens
  useEffect(() => {
    if (isEditModalOpen && videoRef.current) {
      videoRef.current.pause();
      isManuallyPausedRef.current = true;
    }
  }, [isEditModalOpen]);

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
                (shot) => shot.video_status === "completed"
              ).length;

              return (
                <button
                  key={scene_beat_id}
                  onClick={() => {
                    setSelectedScene(scene_beat_id);
                    setSelectedShot(0);
                    // Reset manual pause when user selects a different scene
                    isManuallyPausedRef.current = false;
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
        <div className="w-84">
          <div className="relative w-full">
            <div
              className={cn(
                "relative bg-fm-surface-secondary rounded-2xl p-2.5 overflow-hidden mx-auto",
                selectedShotVideoUrl && "w-max max-w-82"
              )}
            >
              <div
                className={cn(
                  "relative aspect-9/16 w-full shrink-0 max-h-[70vh] rounded-xl overflow-hidden",
                  !selectedShotVideoUrl &&
                    "bg-fm-surface-tertiary animate-pulse"
                )}
              >
                {selectedShotVideoUrl && (
                  <>
                    <video
                      ref={videoRef}
                      src={selectedShotVideoUrl}
                      controls
                      className="h-full object-contain rounded-2xl"
                      onEnded={() => {
                        moveToNextShot();
                      }}
                      onPause={(e) => {
                        // Track when user manually pauses (not when video ends)
                        const video = e.currentTarget;
                        if (!video.ended) {
                          isManuallyPausedRef.current = true;
                        }
                      }}
                      onPlay={() => {
                        // Reset manual pause flag when user plays
                        isManuallyPausedRef.current = false;
                      }}
                    />
                    <Button
                      variant="outline"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => {
                        setIsEditModalOpen(true);
                        // Pause video when opening modal
                        videoRef.current?.pause();
                        isManuallyPausedRef.current = true;
                      }}
                    >
                      <EditBigIcon className="size-5" />
                    </Button>
                  </>
                )}
              </div>
            </div>
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

              // Get audio data from panel_prompt_data.cuts
              type CutAudio = {
                narration?: string | null;
                dialogue?: Record<string, string | null>;
                thought?: Record<string, string | null>;
              };

              type Cut = {
                audio?: CutAudio;
                action?: string;
                cinematography?: string;
                [key: string]: unknown;
              };

              const cuts = (
                Array.isArray(shot.panel_prompt_data?.cuts)
                  ? shot.panel_prompt_data?.cuts
                  : []
              ) as Cut[];

              // Combine audio data from all cuts
              type CombinedAudio = {
                narrations: string[];
                dialogue: Record<string, string[]>;
                thought: Record<string, string[]>;
                actions: string[];
                cinematography: string[];
              };

              const combinedAudio = cuts.reduce<CombinedAudio>(
                (acc, cut) => {
                  const audio = cut?.audio;
                  if (audio) {
                    // Combine narrations (array of strings)
                    if (
                      audio.narration &&
                      typeof audio.narration === "string" &&
                      audio.narration.trim()
                    ) {
                      acc.narrations.push(audio.narration);
                    }
                    // Collect all dialogues for each character (array per character)
                    if (
                      audio.dialogue &&
                      typeof audio.dialogue === "object" &&
                      audio.dialogue !== null
                    ) {
                      Object.entries(audio.dialogue).forEach(
                        ([character, text]) => {
                          if (text && typeof text === "string" && text.trim()) {
                            if (!acc.dialogue[character]) {
                              acc.dialogue[character] = [];
                            }
                            acc.dialogue[character].push(text);
                          }
                        }
                      );
                    }
                    // Collect all thoughts for each character (array per character)
                    if (
                      audio.thought &&
                      typeof audio.thought === "object" &&
                      audio.thought !== null
                    ) {
                      Object.entries(audio.thought).forEach(
                        ([character, text]) => {
                          if (text && typeof text === "string" && text.trim()) {
                            if (!acc.thought[character]) {
                              acc.thought[character] = [];
                            }
                            acc.thought[character].push(text);
                          }
                        }
                      );
                    }
                  }
                  // Collect actions from cuts
                  if (
                    cut.action &&
                    typeof cut.action === "string" &&
                    cut.action.trim()
                  ) {
                    acc.actions.push(cut.action);
                  }
                  // Collect cinematography from cuts
                  if (
                    cut.cinematography &&
                    typeof cut.cinematography === "string" &&
                    cut.cinematography.trim()
                  ) {
                    acc.cinematography.push(cut.cinematography);
                  }
                  return acc;
                },
                {
                  narrations: [] as string[],
                  dialogue: {} as Record<string, string[]>,
                  thought: {} as Record<string, string[]>,
                  actions: [] as string[],
                  cinematography: [] as string[],
                }
              );

              // Use actions from cuts, fallback to frame_description if no actions
              const shotDescription =
                combinedAudio.actions.length > 0
                  ? combinedAudio.actions.join(" ")
                  : shot.panel_data?.start_frame?.frame_description || "";

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
                  onClick={() => {
                    setSelectedShot(index);
                    // Reset manual pause when user selects a different shot
                    isManuallyPausedRef.current = false;
                  }}
                  className={cn(
                    "w-full text-left p-5 rounded-xl bg-black  shrink-0",
                    {
                      "border border-[#833AFF]": isSelected,
                    }
                  )}
                >
                  <div className="flex items-start gap-3 w-full">
                    <div className="flex-1 min-w-0 space-y-4">
                      <ShotHeader
                        hasUrl={!!selectedShotVideoUrl}
                        duration={
                          selectedShotData?.panel_prompt_data?.duration || 5
                        }
                        onDeleteClick={async () => {
                          await editPanel({
                            mode: "delete",
                            orchestrator_task_id:
                              selectedShotData.orchestrator_task_id,
                            orchestrator_result_task_id: selectedShotData.id,
                          });
                          onRefetch?.();
                        }}
                        shotNumber={index + 1}
                        onEditClick={() => {
                          setSelectedShot(index);
                          setIsEditModalOpen(true);
                          // Pause video when opening modal
                          videoRef.current?.pause();
                          isManuallyPausedRef.current = true;
                        }}
                      />
                      {combinedAudio.actions.length > 0 ? (
                        <div className="space-y-0.5">
                          <p className="text-fm-sm font-medium uppercase text-[#AB79FF] tracking-wider">
                            Description:
                          </p>
                          <div className="space-y-1">
                            {combinedAudio.actions.map((action, idx) => (
                              <p
                                key={idx}
                                className="font-fm-poppins text-fm-md"
                              >
                                {action}
                              </p>
                            ))}
                          </div>
                        </div>
                      ) : shotDescription ? (
                        <div className="space-y-0.5">
                          <p className="text-fm-sm font-medium uppercase text-[#AB79FF] tracking-wider">
                            Description:
                          </p>
                          <p className="font-fm-poppins text-fm-md">
                            {shotDescription}
                          </p>
                        </div>
                      ) : null}
                      {combinedAudio.cinematography.length > 0 && (
                        <div className="space-y-0.5">
                          <p className="text-fm-sm font-medium uppercase text-[#AB79FF] tracking-wider">
                            Cinematography:
                          </p>
                          <div className="space-y-1">
                            {combinedAudio.cinematography.map(
                              (cinematography, idx) => (
                                <p
                                  key={idx}
                                  className="font-fm-poppins text-fm-md"
                                >
                                  {cinematography}
                                </p>
                              )
                            )}
                          </div>
                        </div>
                      )}

                      {combinedAudio.narrations.length > 0 && (
                        <div className="space-y-0.5 w-full">
                          <p className="text-fm-sm font-medium uppercase text-[#AB79FF] tracking-wider">
                            Narration:
                          </p>
                          <div className="space-y-1">
                            {combinedAudio.narrations.map((narration, idx) => (
                              <p
                                key={idx}
                                className="font-fm-poppins italic text-fm-md"
                              >
                                {narration}
                              </p>
                            ))}
                          </div>
                        </div>
                      )}
                      {Object.values(combinedAudio.dialogue).some(
                        (dialogues) => dialogues && dialogues.length > 0
                      ) && (
                        <div className="space-y-2 w-full">
                          <p className="text-fm-sm font-medium uppercase text-[#AB79FF] tracking-wider">
                            Dialogue:
                          </p>
                          <div className="space-y-2">
                            {Object.entries(combinedAudio.dialogue).map(
                              ([character, dialogues]) => {
                                if (!dialogues || dialogues.length === 0)
                                  return null;
                                return (
                                  <div key={character} className="space-y-1">
                                    {dialogues.map((dialogue, idx) => (
                                      <p
                                        key={`${character}-${idx}`}
                                        className="font-fm-poppins italic text-fm-md"
                                      >
                                        <span>{character}:</span> {dialogue}
                                      </p>
                                    ))}
                                  </div>
                                );
                              }
                            )}
                          </div>
                        </div>
                      )}
                      {Object.values(combinedAudio.thought).some(
                        (thoughts) => thoughts && thoughts.length > 0
                      ) && (
                        <div className="space-y-2 w-full">
                          <p className="text-fm-sm font-medium uppercase text-[#AB79FF] tracking-wider">
                            Thought:
                          </p>
                          <div className="space-y-2">
                            {Object.entries(combinedAudio.thought).map(
                              ([character, thoughts]) => {
                                if (!thoughts || thoughts.length === 0)
                                  return null;
                                return (
                                  <div key={character} className="space-y-1">
                                    {thoughts.map((thought, idx) => (
                                      <p
                                        key={`${character}-${idx}`}
                                        className="font-fm-poppins italic text-fm-md"
                                      >
                                        <span>{character}:</span> {thought}
                                      </p>
                                    ))}
                                  </div>
                                );
                              }
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

      {/* Edit Video Modal */}
      {isEditModalOpen && (
        <EditVideoModal
          isOpen={isEditModalOpen}
          onClose={() => setIsEditModalOpen(false)}
          shotData={selectedShotData}
          shotNumber={selectedShot + 1}
          onRefetch={onRefetch}
          onSave={(data) => {
            // TODO: Handle save if needed
            console.log("Save video data:", data);
          }}
        />
      )}
    </div>
  );
}
