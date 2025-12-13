"use client";

import { useState, useEffect } from "react";
import { Button } from "@/aural/components/ui/button";
import Input from "@/aural/components/ui/input";
import TextArea from "@/aural/components/ui/textarea";
import { CrossCircleIcon } from "@/aural/icons/cross-circle-icon";
import { cn } from "@/aural/lib/utils";
import { PanelItem } from "@/lib/types";
import { editPanel } from "@/server/mutations/edit-panel";
import { convertGoogleDriveUrl } from "@/lib/helpers";
import { Trash } from "@/lib/icons";

const PlusIcon = ({ className }: { className?: string }) => (
  <svg
    width="16"
    height="16"
    viewBox="0 0 16 16"
    fill="none"
    xmlns="http://www.w3.org/2000/svg"
    className={className}
  >
    <path
      d="M8 3V13M3 8H13"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
    />
  </svg>
);

type Thought = {
  characterName?: string;
  thoughtText?: string;
};

type Dialogue = {
  characterName?: string;
  dialogueText?: string;
};

type CutAudio = {
  thoughts?: Thought[];
  dialogues?: Dialogue[];
  narration?: string;
};

type Cut = {
  cinematography?: string;
  subject?: string;
  action?: string;
  audio?: CutAudio;
};

interface EditVideoModalProps {
  isOpen: boolean;
  onClose: () => void;
  shotData: PanelItem | null;
  shotNumber: number;
  onSave?: (data: {
    videoNumber: number;
    videoDuration: number;
    cuts: Cut[];
  }) => void;
}

export default function EditVideoModal({
  isOpen,
  onClose,
  shotData,
  shotNumber,
  onSave,
}: EditVideoModalProps) {
  const [videoNumber, setVideoNumber] = useState(shotNumber);
  const [videoDuration, setVideoDuration] = useState(5);
  const [cuts, setCuts] = useState<Cut[]>([]);
  const [updatedShotData, setUpdatedShotData] = useState<PanelItem | null>(
    null
  );
  const [initialized, setInitialized] = useState(false);

  // Initialize form data from shotData
  useEffect(() => {
    if (shotData && !initialized) {
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setVideoNumber(shotNumber);

      // Get duration from panel_prompt_data
      const duration = shotData.panel_prompt_data?.duration || 5;
      setVideoDuration(duration);

      // Get cuts from panel_prompt_data
      const existingCuts = Array.isArray(shotData.panel_prompt_data?.cuts)
        ? (shotData.panel_prompt_data?.cuts as Cut[]) || []
        : [];

      // If no cuts exist, create a default one
      if (existingCuts.length === 0) {
        setCuts([
          {
            cinematography: "",
            subject: "",
            action: "",
            audio: {
              thoughts: [{ characterName: "", thoughtText: "" }],
              dialogues: [{ characterName: "", dialogueText: "" }],
              narration: "",
            },
          },
        ]);
      } else {
        // Map existing cuts to our format
        setCuts(
          existingCuts.map((cut) => {
            // Convert thought object to array (handle both old and new formats)
            const audioData = (cut.audio || {}) as {
              thought?: Record<string, string>;
              thoughts?: Thought[] | Record<string, string>;
              dialogue?: Record<string, string>;
              dialogues?: Dialogue[] | Record<string, string>;
              narration?: string;
            };
            
            let thoughts: Thought[] = [];
            if (Array.isArray(audioData.thoughts)) {
              // New format: already an array
              thoughts = audioData.thoughts.map((t) => ({
                characterName: t.characterName || "",
                thoughtText: t.thoughtText || "",
              }));
            } else {
              // Old format: object with character names as keys
              const thoughtObj = (audioData.thought || audioData.thoughts || {}) as Record<string, string>;
              thoughts = Object.entries(thoughtObj).map(
                ([characterName, thoughtText]) => ({
                  characterName,
                  thoughtText: thoughtText as string,
                })
              );
            }
            if (thoughts.length === 0) {
              thoughts.push({ characterName: "", thoughtText: "" });
            }

            // Convert dialogue object to array (handle both old and new formats)
            let dialogues: Dialogue[] = [];
            if (Array.isArray(audioData.dialogues)) {
              // New format: already an array
              dialogues = audioData.dialogues.map((d) => ({
                characterName: d.characterName || "",
                dialogueText: d.dialogueText || "",
              }));
            } else {
              // Old format: object with character names as keys
              const dialogueObj = (audioData.dialogue || audioData.dialogues || {}) as Record<string, string>;
              dialogues = Object.entries(dialogueObj).map(
                ([characterName, dialogueText]) => ({
                  characterName,
                  dialogueText: dialogueText as string,
                })
              );
            }
            if (dialogues.length === 0) {
              dialogues.push({ characterName: "", dialogueText: "" });
            }

            return {
              cinematography: cut.cinematography || "",
              subject: cut.subject || "",
              action: cut.action || "",
              audio: {
                thoughts,
                dialogues,
                narration: audioData.narration || "",
              },
            };
          })
        );
      }
      setInitialized(true);
    }
  }, [shotData, shotNumber, initialized]);

  // Update updatedShotData whenever any form field changes
  useEffect(() => {
    if (shotData) {
      // Create updated panel_prompt_data
      const updatedPanelPromptData = {
        ...(shotData.panel_prompt_data || {}),
        duration: videoDuration,
        cuts: cuts.map((cut) => {
          // Convert thoughts array back to object
          const thoughtObj: Record<string, string> = {};
          cut.audio?.thoughts?.forEach((thought) => {
            if (thought.characterName && thought.thoughtText) {
              thoughtObj[thought.characterName] = thought.thoughtText;
            }
          });

          // Convert dialogues array back to object
          const dialogueObj: Record<string, string> = {};
          cut.audio?.dialogues?.forEach((dialogue) => {
            if (dialogue.characterName && dialogue.dialogueText) {
              dialogueObj[dialogue.characterName] = dialogue.dialogueText;
            }
          });

          return {
            cinematography: cut.cinematography || "",
            subject: cut.subject || "",
            action: cut.action || "",
            audio: {
              thought: thoughtObj,
              dialogue: dialogueObj,
              narration: cut.audio?.narration || "",
            },
          };
        }),
      };

      // Create updated shotData
      const updated: PanelItem = {
        ...shotData,
        panel_prompt_data: updatedPanelPromptData,
      };

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUpdatedShotData(updated);
    }
  }, [shotData, videoNumber, videoDuration, cuts]);

  if (!isOpen || !shotData) return null;

  const videoUrl = shotData.single_image_video_url
    ? convertGoogleDriveUrl(shotData.single_image_video_url)
    : "";

  const handleAddCut = () => {
    setCuts([
      ...cuts,
      {
        cinematography: "",
        subject: "",
        action: "",
        audio: {
          thoughts: [{ characterName: "", thoughtText: "" }],
          dialogues: [{ characterName: "", dialogueText: "" }],
          narration: "",
        },
      },
    ]);
  };

  const handleRemoveCut = (index: number) => {
    setCuts(cuts.filter((_, i) => i !== index));
  };

  const handleCutChange = (
    index: number,
    field: "cinematography" | "subject" | "action",
    value: string
  ) => {
    const updatedCuts = [...cuts];
    updatedCuts[index] = {
      ...updatedCuts[index],
      [field]: value,
    };
    setCuts(updatedCuts);
  };

  const handleThoughtChange = (
    cutIndex: number,
    thoughtIndex: number,
    field: "characterName" | "thoughtText",
    value: string
  ) => {
    const updatedCuts = [...cuts];
    const cut = updatedCuts[cutIndex];
    const thoughts = [...(cut.audio?.thoughts || [])];
    thoughts[thoughtIndex] = {
      ...thoughts[thoughtIndex],
      [field]: value,
    };
    updatedCuts[cutIndex] = {
      ...cut,
      audio: {
        ...cut.audio,
        thoughts,
      },
    };
    setCuts(updatedCuts);
  };

  const handleDialogueChange = (
    cutIndex: number,
    dialogueIndex: number,
    field: "characterName" | "dialogueText",
    value: string
  ) => {
    const updatedCuts = [...cuts];
    const cut = updatedCuts[cutIndex];
    const dialogues = [...(cut.audio?.dialogues || [])];
    dialogues[dialogueIndex] = {
      ...dialogues[dialogueIndex],
      [field]: value,
    };
    updatedCuts[cutIndex] = {
      ...cut,
      audio: {
        ...cut.audio,
        dialogues,
      },
    };
    setCuts(updatedCuts);
  };

  const handleAddThought = (cutIndex: number) => {
    const updatedCuts = [...cuts];
    const cut = updatedCuts[cutIndex];
    const thoughts = [...(cut.audio?.thoughts || [])];
    thoughts.push({ characterName: "", thoughtText: "" });
    updatedCuts[cutIndex] = {
      ...cut,
      audio: {
        ...cut.audio,
        thoughts,
      },
    };
    setCuts(updatedCuts);
  };

  const handleRemoveThought = (cutIndex: number, thoughtIndex: number) => {
    const updatedCuts = [...cuts];
    const cut = updatedCuts[cutIndex];
    const thoughts = [...(cut.audio?.thoughts || [])];
    thoughts.splice(thoughtIndex, 1);
    // Ensure at least one empty thought remains
    if (thoughts.length === 0) {
      thoughts.push({ characterName: "", thoughtText: "" });
    }
    updatedCuts[cutIndex] = {
      ...cut,
      audio: {
        ...cut.audio,
        thoughts,
      },
    };
    setCuts(updatedCuts);
  };

  const handleAddDialogue = (cutIndex: number) => {
    const updatedCuts = [...cuts];
    const cut = updatedCuts[cutIndex];
    const dialogues = [...(cut.audio?.dialogues || [])];
    dialogues.push({ characterName: "", dialogueText: "" });
    updatedCuts[cutIndex] = {
      ...cut,
      audio: {
        ...cut.audio,
        dialogues,
      },
    };
    setCuts(updatedCuts);
  };

  const handleRemoveDialogue = (cutIndex: number, dialogueIndex: number) => {
    const updatedCuts = [...cuts];
    const cut = updatedCuts[cutIndex];
    const dialogues = [...(cut.audio?.dialogues || [])];
    dialogues.splice(dialogueIndex, 1);
    // Ensure at least one empty dialogue remains
    if (dialogues.length === 0) {
      dialogues.push({ characterName: "", dialogueText: "" });
    }
    updatedCuts[cutIndex] = {
      ...cut,
      audio: {
        ...cut.audio,
        dialogues,
      },
    };
    setCuts(updatedCuts);
  };

  const handleNarrationChange = (cutIndex: number, value: string) => {
    const updatedCuts = [...cuts];
    const cut = updatedCuts[cutIndex];
    updatedCuts[cutIndex] = {
      ...cut,
      audio: {
        ...cut.audio,
        narration: value,
      },
    };
    setCuts(updatedCuts);
  };

  const handleSave = () => {
    if (onSave) {
      onSave({
        videoNumber,
        videoDuration,
        cuts,
      });
    }
    onClose();
  };

  const handleGenerateNewVideo = async () => {
    if (updatedShotData) {
      await editPanel({
        orchestrator_result_task_id: updatedShotData.id,
        orchestrator_task_id: updatedShotData.orchestrator_task_id,
        panel_data: updatedShotData.panel_data,
        type: "video",
      });
      onClose();
    }
  };

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center"
      onClick={(e) => {
        if (e.target === e.currentTarget) {
          onClose();
        }
      }}
    >
      {/* Backdrop */}
      <div className="absolute inset-0 bg-black/60 backdrop-blur-sm" />

      {/* Modal */}
      <div className="relative z-10 w-full max-w-5xl mx-4 bg-[#141414] rounded-2xl overflow-hidden border border-fm-divider-primary">
        {/* Header */}
        <div className="flex items-center justify-between p-6 py-4 border-b border-fm-divider-primary bg-[#141414]">
          <h2 className="text-2xl font-bold text-fm-primary font-fm-poppins">
            Edit Video and Audio
          </h2>
          <button
            onClick={onClose}
            className="p-2 hover:bg-fm-surface-tertiary rounded-lg transition-colors"
            aria-label="Close modal"
          >
            <CrossCircleIcon className="size-5 text-fm-primary" />
          </button>
        </div>

        {/* Content */}
        <div className="flex h-[calc(100vh-200px)] max-h-[800px]">
          {/* Left Side - Scrollable Form */}
          <div className="flex-1 overflow-y-auto p-6 space-y-6 border-r border-fm-divider-primary bg-[#141414]">
            {/* Video Number */}
            <div className="space-y-3">
              <label className="text-fm-sm font-medium text-[#FFFFFFCC] font-fm-poppins">
                Video Number *
              </label>
              <Input
                disabled
                type="number"
                value={videoNumber}
                onChange={(e) => setVideoNumber(Number(e.target.value))}
                decoration="outline"
                className="bg-fm-neutral-0! rounded-lg"
                classes={{
                  input: "bg-fm-neutral-0! text-fm-primary rounded-lg border-0",
                }}
              />
            </div>

            {/* Video Duration */}
            <div className="space-y-3">
              <label className="text-fm-sm font-medium text-[#FFFFFFCC] font-fm-poppins">
                Video Duration *
              </label>
              <Input
                disabled
                value={videoDuration + " s"}
                onChange={(e) => setVideoDuration(Number(e.target.value))}
                decoration="outline"
                className="bg-fm-neutral-0! rounded-lg"
                classes={{
                  input: "bg-fm-neutral-0! text-fm-primary rounded-lg border-0",
                }}
              />
            </div>

            {/* CUTS Section */}
            <div className="space-y-4">
              <h3 className="text-fm-lg font-semibold text-fm-primary font-fm-poppins">
                CUTS
              </h3>

              {cuts.map((cut, index) => (
                <div
                  key={index}
                  className="bg-[#262626] rounded-xl p-4 space-y-4 border border-fm-divider-primary"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-fm-md font-semibold text-fm-primary font-fm-poppins">
                      CUT - {index + 1}
                    </h4>
                    <button
                      onClick={() => handleRemoveCut(index)}
                      className="p-1 hover:bg-fm-surface-secondary rounded transition-colors"
                      aria-label={`Remove cut ${index + 1}`}
                    >
                      <Trash />
                    </button>
                  </div>

                  {/* Cinematography */}
                  <div className="space-y-3">
                    <label className="text-fm-sm font-medium text-[#FFFFFFCC] font-fm-poppins">
                      Cinematography
                    </label>
                    <TextArea
                      value={cut.cinematography || ""}
                      onChange={(e) =>
                        handleCutChange(index, "cinematography", e.target.value)
                      }
                      decoration="filled"
                      autoGrow
                      minHeight={100}
                      maxHeight={200}
                      className="bg-fm-neutral-0! rounded-lg border-0"
                      classes={{
                        textarea:
                          "bg-fm-neutral-0! text-fm-primary resize-none rounded-lg border-0",
                      }}
                      placeholder="Enter cinematography description..."
                    />
                  </div>

                  {/* Subject */}
                  <div className="space-y-3">
                    <label className="text-fm-sm font-medium text-[#FFFFFFCC] font-fm-poppins">
                      Subject
                    </label>
                    <TextArea
                      value={cut.subject || ""}
                      onChange={(e) =>
                        handleCutChange(index, "subject", e.target.value)
                      }
                      decoration="filled"
                      autoGrow
                      minHeight={100}
                      maxHeight={200}
                      className="bg-fm-neutral-0! rounded-lg border-0"
                      classes={{
                        textarea:
                          "bg-fm-neutral-0! text-fm-primary resize-none rounded-lg border-0",
                      }}
                      placeholder="Enter subject description..."
                    />
                  </div>

                  {/* Action */}
                  <div className="space-y-3">
                    <label className="text-fm-sm font-medium text-[#FFFFFFCC] font-fm-poppins">
                      Action
                    </label>
                    <TextArea
                      value={cut.action || ""}
                      onChange={(e) =>
                        handleCutChange(index, "action", e.target.value)
                      }
                      decoration="filled"
                      autoGrow
                      minHeight={100}
                      maxHeight={200}
                      className="bg-fm-neutral-0! rounded-lg border-0"
                      classes={{
                        textarea:
                          "bg-fm-neutral-0! text-fm-primary resize-none rounded-lg border-0",
                      }}
                      placeholder="Enter action description..."
                    />
                  </div>

                  {/* THOUGHT */}
                  <div className="space-y-4">
                    <h3 className="text-fm-lg font-semibold text-fm-primary font-fm-poppins">
                      THOUGHT
                    </h3>

                    {(cut.audio?.thoughts || []).map((thought, thoughtIndex) => (
                      <div
                        key={thoughtIndex}
                        className="bg-[#1a1a1a] rounded-xl p-4 space-y-4 border border-fm-divider-primary"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-fm-md font-semibold text-fm-primary font-fm-poppins">
                            Thought {thoughtIndex + 1}
                          </h4>
                          {/* <button
                            onClick={() => handleRemoveThought(index, thoughtIndex)}
                            className="p-1 hover:bg-fm-surface-secondary rounded transition-colors"
                            aria-label={`Remove thought ${thoughtIndex + 1}`}
                          >
                            <Trash />
                          </button> */}
                        </div>

                        <div className="space-y-3">
                          <label className="text-fm-sm font-medium text-[#FFFFFFCC] font-fm-poppins">
                            Character Name
                          </label>
                          <Input
                            type="text"
                            value={thought.characterName || ""}
                            onChange={(e) =>
                              handleThoughtChange(
                                index,
                                thoughtIndex,
                                "characterName",
                                e.target.value
                              )
                            }
                            decoration="outline"
                            className="bg-fm-neutral-0! rounded-lg"
                            classes={{
                              input:
                                "bg-fm-neutral-0! text-fm-primary rounded-lg border-0",
                            }}
                            placeholder="Character Name"
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="text-fm-sm font-medium text-[#FFFFFFCC] font-fm-poppins">
                            Thought Text
                          </label>
                          <TextArea
                            value={thought.thoughtText || ""}
                            onChange={(e) =>
                              handleThoughtChange(
                                index,
                                thoughtIndex,
                                "thoughtText",
                                e.target.value
                              )
                            }
                            decoration="filled"
                            autoGrow
                            minHeight={100}
                            maxHeight={200}
                            className="bg-fm-neutral-0! rounded-lg border-0"
                            classes={{
                              textarea:
                                "bg-fm-neutral-0! text-fm-primary resize-none rounded-lg border-0",
                            }}
                            placeholder="Enter thought text..."
                          />
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-center">
                      <button
                        onClick={() => handleAddThought(index)}
                        className="flex items-center gap-2 bg-black rounded-lg px-4 py-2 font-fm-poppins text-[#833AFF] uppercase text-sm font-medium hover:opacity-80 transition-opacity"
                      >
                        <div className="w-6 h-6 rounded-full bg-[#833AFF] flex items-center justify-center">
                          <PlusIcon className="text-white w-3 h-3" />
                        </div>
                        ADD NEW THOUGHT
                      </button>
                    </div>
                  </div>

                  {/* DIALOGUE */}
                  <div className="space-y-4">
                    <h3 className="text-fm-lg font-semibold text-fm-primary font-fm-poppins">
                      DIALOGUE
                    </h3>

                    {(cut.audio?.dialogues || []).map((dialogue, dialogueIndex) => (
                      <div
                        key={dialogueIndex}
                        className="bg-[#1a1a1a] rounded-xl p-4 space-y-4 border border-fm-divider-primary"
                      >
                        <div className="flex items-center justify-between">
                          <h4 className="text-fm-md font-semibold text-fm-primary font-fm-poppins">
                            Dialogue {dialogueIndex + 1}
                          </h4>
                          {/* <button
                            onClick={() => handleRemoveDialogue(index, dialogueIndex)}
                            className="p-1 hover:bg-fm-surface-secondary rounded transition-colors"
                            aria-label={`Remove dialogue ${dialogueIndex + 1}`}
                          >
                            <Trash />
                          </button> */}
                        </div>

                        <div className="space-y-3">
                          <label className="text-fm-sm font-medium text-[#FFFFFFCC] font-fm-poppins">
                            Character Name
                          </label>
                          <Input
                            type="text"
                            value={dialogue.characterName || ""}
                            onChange={(e) =>
                              handleDialogueChange(
                                index,
                                dialogueIndex,
                                "characterName",
                                e.target.value
                              )
                            }
                            decoration="outline"
                            className="bg-fm-neutral-0! rounded-lg"
                            classes={{
                              input:
                                "bg-fm-neutral-0! text-fm-primary rounded-lg border-0",
                            }}
                            placeholder="Character Name"
                          />
                        </div>

                        <div className="space-y-3">
                          <label className="text-fm-sm font-medium text-[#FFFFFFCC] font-fm-poppins">
                            Dialogue Text
                          </label>
                          <TextArea
                            value={dialogue.dialogueText || ""}
                            onChange={(e) =>
                              handleDialogueChange(
                                index,
                                dialogueIndex,
                                "dialogueText",
                                e.target.value
                              )
                            }
                            decoration="filled"
                            autoGrow
                            minHeight={100}
                            maxHeight={200}
                            className="bg-fm-neutral-0! rounded-lg border-0"
                            classes={{
                              textarea:
                                "bg-fm-neutral-0! text-fm-primary resize-none rounded-lg border-0",
                            }}
                            placeholder="Enter dialogue text..."
                          />
                        </div>
                      </div>
                    ))}

                    <div className="flex justify-center">
                      <button
                        onClick={() => handleAddDialogue(index)}
                        className="flex items-center gap-2 bg-black rounded-lg px-4 py-2 font-fm-poppins text-[#833AFF] uppercase text-sm font-medium hover:opacity-80 transition-opacity"
                      >
                        <div className="w-6 h-6 rounded-full bg-[#833AFF] flex items-center justify-center">
                          <PlusIcon className="text-white w-3 h-3" />
                        </div>
                        ADD NEW DIALOGUE
                      </button>
                    </div>
                  </div>

                  {/* NARRATION */}
                  <div className="space-y-3">
                    <label className="text-fm-sm font-medium text-[#FFFFFFCC] font-fm-poppins">
                      NARRATION
                    </label>
                    <TextArea
                      value={cut.audio?.narration || ""}
                      onChange={(e) => handleNarrationChange(index, e.target.value)}
                      decoration="filled"
                      autoGrow
                      minHeight={100}
                      maxHeight={200}
                      className="bg-fm-neutral-0! rounded-lg border-0"
                      classes={{
                        textarea:
                          "bg-fm-neutral-0! text-fm-primary resize-none rounded-lg border-0",
                      }}
                      placeholder="Enter narration..."
                    />
                  </div>
                </div>
              ))}

              <div className="flex justify-center">
                <button
                  onClick={handleAddCut}
                  className="flex items-center gap-2 bg-black rounded-lg px-4 py-2 font-fm-poppins text-[#833AFF] uppercase text-sm font-medium hover:opacity-80 transition-opacity"
                >
                  <div className="w-6 h-6 rounded-full bg-[#833AFF] flex items-center justify-center">
                    <PlusIcon className="text-white w-3 h-3" />
                  </div>
                  ADD NEW CUT
                </button>
              </div>
            </div>
          </div>

          {/* Right Side - Non-scrollable Preview */}
          <div className="w-96 flex flex-col p-6 space-y-4 bg-[#141414] overflow-hidden">
            <div className="relative flex-1 min-h-0 rounded-xl overflow-hidden bg-fm-surface-tertiary border border-fm-divider-primary">
              {videoUrl ? (
                <video
                  src={videoUrl}
                  controls
                  className="w-full h-full object-contain rounded-xl"
                />
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-fm-secondary-800">No video available</p>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              noise="none"
              onClick={handleGenerateNewVideo}
              className="w-full font-fm-poppins rounded-lg"
              innerClassName={cn(
                "border-none bg-[#833AFF] rounded-lg font-fm-poppins text-fm-lg text-white"
              )}
            >
              Generate New Video
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
