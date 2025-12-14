"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/aural/components/ui/button";
import Input from "@/aural/components/ui/input";
import TextArea from "@/aural/components/ui/textarea";
import { CrossCircleIcon } from "@/aural/icons/cross-circle-icon";
import { cn } from "@/aural/lib/utils";
import { PanelItem } from "@/lib/types";
import { convertGoogleDriveUrl } from "@/lib/helpers";
import { editPanel } from "@/server/mutations/edit-panel";
import { Trash } from "@/lib/icons";
import { toast } from "sonner";

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

type CharacterFraming = {
  characterName?: string;
  shotSize?: string;
  shotType?: string;
  [key: string]: unknown;
};

type Pose = {
  characterName?: string;
  poseDescription?: string;
  [key: string]: unknown;
};

type Dialogue = {
  characterName?: string;
  dialogueText?: string;
  [key: string]: unknown;
};

type Emotion = {
  characterName?: string;
  label?: string;
  intensity?: string;
  [key: string]: unknown;
};

type Thought = {
  characterName?: string;
  thoughtText?: string;
  [key: string]: unknown;
};

interface EditImageModalProps {
  isOpen: boolean;
  onClose: () => void;
  shotData: PanelItem | null;
  shotNumber: number;
  onRefetch?: () => void;
  onSave?: (data: {
    panelNumber: number;
    locationTime: string;
    frameDescription: string;
    frameVisual: string;
    cameraAngle: string;
    characterFramings: CharacterFraming[];
    poses: Pose[];
    dialogues: Dialogue[];
    narration: string;
    emotions: Emotion[];
    thoughts: Thought[];
  }) => void;
}

export default function EditImageModal({
  isOpen,
  onClose,
  shotData,
  shotNumber,
  onRefetch,
  onSave,
}: EditImageModalProps) {
  const [panelNumber, setPanelNumber] = useState(shotNumber);
  const [locationTime, setLocationTime] = useState("");
  const [frameDescription, setFrameDescription] = useState("");
  const [frameVisual, setFrameVisual] = useState("");
  const [cameraAngle, setCameraAngle] = useState("");
  const [characterFramings, setCharacterFramings] = useState<
    CharacterFraming[]
  >([]);
  const [poses, setPoses] = useState<Pose[]>([]);
  const [dialogues, setDialogues] = useState<Dialogue[]>([]);
  const [narration, setNarration] = useState("");
  const [emotions, setEmotions] = useState<Emotion[]>([]);
  const [thoughts, setThoughts] = useState<Thought[]>([]);
  const [updatedShotData, setUpdatedShotData] = useState<PanelItem | null>(
    null
  );
  const [initialized, setInitialized] = useState(false);

  // Initialize form data from shotData
  useEffect(() => {
    if (shotData && !initialized) {
      // Set panel number
      // eslint-disable-next-line react-hooks/set-state-in-effect
      setPanelNumber(shotData.panel_number || shotNumber);

      // Set location and time
      const locationTimeValue = shotData.panel_data?.location_time || "";
      setLocationTime(locationTimeValue);

      // Set frame description
      const startFrame = shotData.panel_data?.start_frame as
        | Record<string, unknown>
        | undefined;
      const frameDesc = (startFrame?.frame_description as string) || "";
      setFrameDescription(frameDesc);

      // Set frame visual
      const frameVis = (startFrame?.frame_visual as string) || "";
      setFrameVisual(frameVis);

      // Set camera angle
      const cameraAng = (startFrame?.camera_angle as string) || "";
      setCameraAngle(cameraAng);

      // Set character framings from character_framing object
      const characterFraming =
        (startFrame?.character_framing as Record<
          string,
          { shot_size?: string; shot_type?: string }
        >) || {};
      const framings: CharacterFraming[] = Object.entries(characterFraming).map(
        ([characterName, data]) => ({
          characterName,
          shotSize: data?.shot_size || "",
          shotType: data?.shot_type || "",
        })
      );

      // If no character framings exist, create a default one
      if (framings.length === 0) {
        setCharacterFramings([
          {
            characterName: "",
            shotSize: "",
            shotType: "",
          },
        ]);
      } else {
        setCharacterFramings(framings);
      }

      // Set poses from pose object
      const poseData = (startFrame?.pose as Record<string, string>) || {};
      const poseEntries: Pose[] = Object.entries(poseData).map(
        ([characterName, poseDescription]) => ({
          characterName,
          poseDescription,
        })
      );
      if (poseEntries.length === 0) {
        setPoses([{ characterName: "", poseDescription: "" }]);
      } else {
        setPoses(poseEntries);
      }

      // Set dialogues from dialogue object
      const dialogueData =
        (startFrame?.dialogue as Record<string, string>) || {};
      const dialogueEntries: Dialogue[] = Object.entries(dialogueData).map(
        ([characterName, dialogueText]) => ({
          characterName,
          dialogueText,
        })
      );
      if (dialogueEntries.length === 0) {
        setDialogues([{ characterName: "", dialogueText: "" }]);
      } else {
        setDialogues(dialogueEntries);
      }

      // Set narration
      const narrationValue = (startFrame?.narration as string) || "";
      setNarration(narrationValue);

      // Set emotions from emotion object
      const emotionData =
        (startFrame?.emotion as Record<
          string,
          { label?: string; intensity?: string }
        >) || {};
      const emotionEntries: Emotion[] = Object.entries(emotionData).map(
        ([characterName, data]) => ({
          characterName,
          label: data?.label || "",
          intensity: data?.intensity || "",
        })
      );
      if (emotionEntries.length === 0) {
        setEmotions([{ characterName: "", label: "", intensity: "" }]);
      } else {
        setEmotions(emotionEntries);
      }

      // Set thoughts from thought object
      const thoughtData = (startFrame?.thought as Record<string, string>) || {};
      const thoughtEntries: Thought[] = Object.entries(thoughtData).map(
        ([characterName, thoughtText]) => ({
          characterName,
          thoughtText,
        })
      );
      if (thoughtEntries.length === 0) {
        setThoughts([{ characterName: "", thoughtText: "" }]);
      } else {
        setThoughts(thoughtEntries);
      }
      setInitialized(true);
    }
  }, [shotData, shotNumber, initialized]);

  // Update updatedShotData whenever any form field changes
  useEffect(() => {
    if (shotData) {
      const startFrame = shotData.panel_data?.start_frame as
        | Record<string, unknown>
        | undefined;

      // Convert character framings back to object format
      const characterFramingObj: Record<
        string,
        { shot_size?: string; shot_type?: string }
      > = {};
      characterFramings.forEach((framing) => {
        if (framing.characterName) {
          characterFramingObj[framing.characterName] = {
            shot_size: framing.shotSize,
            shot_type: framing.shotType,
          };
        }
      });

      // Convert poses back to object format
      const poseObj: Record<string, string> = {};
      poses.forEach((pose) => {
        if (pose.characterName && pose.poseDescription) {
          poseObj[pose.characterName] = pose.poseDescription;
        }
      });

      // Convert dialogues back to object format
      const dialogueObj: Record<string, string> = {};
      dialogues.forEach((dialogue) => {
        if (dialogue.characterName && dialogue.dialogueText) {
          dialogueObj[dialogue.characterName] = dialogue.dialogueText;
        }
      });

      // Convert emotions back to object format
      const emotionObj: Record<string, { label?: string; intensity?: string }> =
        {};
      emotions.forEach((emotion) => {
        if (emotion.characterName) {
          emotionObj[emotion.characterName] = {
            label: emotion.label,
            intensity: emotion.intensity,
          };
        }
      });

      // Convert thoughts back to object format
      const thoughtObj: Record<string, string> = {};
      thoughts.forEach((thought) => {
        if (thought.characterName && thought.thoughtText) {
          thoughtObj[thought.characterName] = thought.thoughtText;
        }
      });

      // Create updated start_frame
      const updatedStartFrame = {
        ...startFrame,
        frame_description: frameDescription,
        frame_visual: frameVisual,
        camera_angle: cameraAngle,
        character_framing: characterFramingObj,
        pose: poseObj,
        dialogue: dialogueObj,
        narration: narration || null,
        emotion: emotionObj,
        thought: thoughtObj,
      };

      // Create updated panel_data
      const updatedPanelData = {
        ...shotData.panel_data,
        location_time: locationTime,
        start_frame: updatedStartFrame,
      };

      // Create updated shotData
      const updated: PanelItem = {
        ...shotData,
        panel_number: panelNumber,
        panel_data: updatedPanelData as PanelItem["panel_data"],
      };

      // eslint-disable-next-line react-hooks/set-state-in-effect
      setUpdatedShotData(updated);
    }
  }, [
    shotData,
    panelNumber,
    locationTime,
    frameDescription,
    frameVisual,
    cameraAngle,
    characterFramings,
    poses,
    dialogues,
    narration,
    emotions,
    thoughts,
  ]);

  if (!isOpen || !shotData) return null;

  const imageUrl = shotData.start_frame_url
    ? convertGoogleDriveUrl(shotData.start_frame_url)
    : "";

  const handleAddCharacterFraming = () => {
    setCharacterFramings([
      ...characterFramings,
      {
        characterName: "",
        shotSize: "",
        shotType: "",
      },
    ]);
  };

  const handleRemoveCharacterFraming = (index: number) => {
    setCharacterFramings(characterFramings.filter((_, i) => i !== index));
  };

  const handleCharacterFramingChange = (
    index: number,
    field: "characterName" | "shotSize" | "shotType",
    value: string
  ) => {
    const updatedFramings = [...characterFramings];
    updatedFramings[index] = {
      ...updatedFramings[index],
      [field]: value,
    };
    setCharacterFramings(updatedFramings);
  };

  // Pose handlers
  const handleAddPose = () => {
    setPoses([...poses, { characterName: "", poseDescription: "" }]);
  };

  const handleRemovePose = (index: number) => {
    setPoses(poses.filter((_, i) => i !== index));
  };

  const handlePoseChange = (
    index: number,
    field: "characterName" | "poseDescription",
    value: string
  ) => {
    const updatedPoses = [...poses];
    updatedPoses[index] = {
      ...updatedPoses[index],
      [field]: value,
    };
    setPoses(updatedPoses);
  };

  // Dialogue handlers
  const handleAddDialogue = () => {
    setDialogues([...dialogues, { characterName: "", dialogueText: "" }]);
  };

  const handleRemoveDialogue = (index: number) => {
    setDialogues(dialogues.filter((_, i) => i !== index));
  };

  const handleDialogueChange = (
    index: number,
    field: "characterName" | "dialogueText",
    value: string
  ) => {
    const updatedDialogues = [...dialogues];
    updatedDialogues[index] = {
      ...updatedDialogues[index],
      [field]: value,
    };
    setDialogues(updatedDialogues);
  };

  // Emotion handlers
  const handleAddEmotion = () => {
    setEmotions([...emotions, { characterName: "", label: "", intensity: "" }]);
  };

  const handleRemoveEmotion = (index: number) => {
    setEmotions(emotions.filter((_, i) => i !== index));
  };

  const handleEmotionChange = (
    index: number,
    field: "characterName" | "label" | "intensity",
    value: string
  ) => {
    const updatedEmotions = [...emotions];
    updatedEmotions[index] = {
      ...updatedEmotions[index],
      [field]: value,
    };
    setEmotions(updatedEmotions);
  };

  // Thought handlers
  const handleAddThought = () => {
    setThoughts([...thoughts, { characterName: "", thoughtText: "" }]);
  };

  const handleRemoveThought = (index: number) => {
    setThoughts(thoughts.filter((_, i) => i !== index));
  };

  const handleThoughtChange = (
    index: number,
    field: "characterName" | "thoughtText",
    value: string
  ) => {
    const updatedThoughts = [...thoughts];
    updatedThoughts[index] = {
      ...updatedThoughts[index],
      [field]: value,
    };
    setThoughts(updatedThoughts);
  };

  const handleSave = () => {
    if (onSave && updatedShotData) {
      onSave({
        panelNumber,
        locationTime,
        frameDescription,
        frameVisual,
        cameraAngle,
        characterFramings,
        poses,
        dialogues,
        narration,
        emotions,
        thoughts,
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
        type: "image",
      });
      toast.info("Regenerating image... This will take some time.");
      onRefetch?.();
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
            Edit Image
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
          <div className="flex-1 overflow-y-auto p-6 space-y-6 border-fm-divider-primary bg-[#141414]">
            {/* Panel Number */}
            <div className="space-y-3">
              <label className="text-fm-sm font-medium text-[#FFFFFFCC] font-fm-poppins">
                Panel Number *
              </label>
              <Input
                type="number"
                disabled
                value={panelNumber}
                onChange={(e) => setPanelNumber(Number(e.target.value))}
                decoration="outline"
                className="bg-fm-neutral-0! rounded-lg"
                classes={{
                  input: "bg-fm-neutral-0! text-fm-primary rounded-lg border-0",
                }}
              />
            </div>

            {/* Location and Time */}
            <div className="space-y-3">
              <label className="text-fm-sm font-medium text-[#FFFFFFCC] font-fm-poppins">
                Location and Time *
              </label>
              <Input
                type="text"
                value={locationTime}
                onChange={(e) => setLocationTime(e.target.value)}
                decoration="outline"
                className="bg-fm-neutral-0! rounded-lg"
                classes={{
                  input: "bg-fm-neutral-0! text-fm-primary rounded-lg border-0",
                }}
                placeholder="Enter location and time..."
              />
            </div>

            {/* Frame Description */}
            <div className="space-y-3">
              <h3 className="text-fm-lg font-semibold text-fm-primary font-fm-poppins">
                START FRAME
              </h3>
              <label className="text-fm-sm font-medium text-[#FFFFFFCC] font-fm-poppins">
                Frame Description
              </label>
              <TextArea
                value={frameDescription}
                onChange={(e) => setFrameDescription(e.target.value)}
                decoration="filled"
                autoGrow
                minHeight={100}
                maxHeight={200}
                className="bg-fm-neutral-0! rounded-lg border-0"
                classes={{
                  textarea:
                    "bg-fm-neutral-0! text-fm-primary resize-none rounded-lg border-0",
                }}
                placeholder="Enter frame description..."
              />
            </div>

            {/* Frame Visual */}
            <div className="space-y-3">
              <label className="text-fm-sm font-medium text-[#FFFFFFCC] font-fm-poppins">
                Frame Visual
              </label>
              <TextArea
                value={frameVisual}
                onChange={(e) => setFrameVisual(e.target.value)}
                decoration="filled"
                autoGrow
                minHeight={100}
                maxHeight={200}
                className="bg-fm-neutral-0! rounded-lg border-0"
                classes={{
                  textarea:
                    "bg-fm-neutral-0! text-fm-primary resize-none rounded-lg border-0",
                }}
                placeholder="Enter frame visual description..."
              />
            </div>

            {/* Camera Angle */}
            <div className="space-y-3">
              <label className="text-fm-sm font-medium text-[#FFFFFFCC] font-fm-poppins">
                Camera Angle
              </label>
              <Input
                type="text"
                value={cameraAngle}
                onChange={(e) => setCameraAngle(e.target.value)}
                decoration="outline"
                className="bg-fm-neutral-0! rounded-lg"
                classes={{
                  input: "bg-fm-neutral-0! text-fm-primary rounded-lg border-0",
                }}
              />
            </div>

            {/* CHARACTER FRAMING Section */}
            <div className="space-y-4">
              <h3 className="text-fm-lg font-semibold text-fm-primary font-fm-poppins">
                CHARACTER FRAMING
              </h3>

              {characterFramings.map((framing, index) => (
                <div
                  key={index}
                  className="bg-[#262626] rounded-xl p-4 space-y-4 border border-fm-divider-primary"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-fm-md font-semibold text-fm-primary font-fm-poppins">
                      Character {index + 1}
                    </h4>
                    <button
                      onClick={() => handleRemoveCharacterFraming(index)}
                      className="p-1 hover:bg-fm-surface-secondary rounded transition-colors"
                      aria-label={`Remove character ${index + 1}`}
                    >
                      <Trash />
                    </button>
                  </div>

                  {/* Character Name */}
                  <div className="space-y-3">
                    <label className="text-fm-sm font-medium text-[#FFFFFFCC] font-fm-poppins">
                      Character Name
                    </label>
                    <Input
                      type="text"
                      value={framing.characterName || ""}
                      onChange={(e) =>
                        handleCharacterFramingChange(
                          index,
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
                    />
                  </div>

                  {/* Shot Size */}
                  <div className="space-y-3">
                    <label className="text-fm-sm font-medium text-[#FFFFFFCC] font-fm-poppins">
                      Shot Size
                    </label>
                    <Input
                      type="text"
                      value={framing.shotSize || ""}
                      onChange={(e) =>
                        handleCharacterFramingChange(
                          index,
                          "shotSize",
                          e.target.value
                        )
                      }
                      decoration="outline"
                      className="bg-fm-neutral-0! rounded-lg"
                      classes={{
                        input:
                          "bg-fm-neutral-0! text-fm-primary rounded-lg border-0",
                      }}
                    />
                  </div>

                  {/* Shot Type */}
                  <div className="space-y-3">
                    <label className="text-fm-sm font-medium text-[#FFFFFFCC] font-fm-poppins">
                      Shot Type
                    </label>
                    <Input
                      type="text"
                      value={framing.shotType || ""}
                      onChange={(e) =>
                        handleCharacterFramingChange(
                          index,
                          "shotType",
                          e.target.value
                        )
                      }
                      decoration="outline"
                      className="bg-fm-neutral-0! rounded-lg"
                      classes={{
                        input:
                          "bg-fm-neutral-0! text-fm-primary rounded-lg border-0",
                      }}
                    />
                  </div>
                </div>
              ))}

              <div className="flex justify-center">
                <button
                  onClick={handleAddCharacterFraming}
                  className="flex items-center gap-2 bg-black rounded-lg px-4 py-2 font-fm-poppins text-[#833AFF] uppercase text-sm font-medium hover:opacity-80 transition-opacity"
                >
                  <div className="w-6 h-6 rounded-full bg-[#833AFF] flex items-center justify-center">
                    <PlusIcon className="text-white w-3 h-3" />
                  </div>
                  ADD NEW CHARACTER
                </button>
              </div>
            </div>

            {/* POSE Section */}
            <div className="space-y-4">
              <h3 className="text-fm-lg font-semibold text-fm-primary font-fm-poppins">
                POSE
              </h3>

              {poses.map((pose, index) => (
                <div
                  key={index}
                  className="bg-[#262626] rounded-xl p-4 space-y-4 border border-fm-divider-primary"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-fm-md font-semibold text-fm-primary font-fm-poppins">
                      Pose {index + 1}
                    </h4>
                    <button
                      onClick={() => handleRemovePose(index)}
                      className="p-1 hover:bg-fm-surface-secondary rounded transition-colors"
                      aria-label={`Remove pose ${index + 1}`}
                    >
                      <Trash />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <label className="text-fm-sm font-medium text-[#FFFFFFCC] font-fm-poppins">
                      Character Name
                    </label>
                    <Input
                      type="text"
                      value={pose.characterName || ""}
                      onChange={(e) =>
                        handlePoseChange(index, "characterName", e.target.value)
                      }
                      decoration="outline"
                      className="bg-fm-neutral-0! rounded-lg"
                      classes={{
                        input:
                          "bg-fm-neutral-0! text-fm-primary rounded-lg border-0",
                      }}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-fm-sm font-medium text-[#FFFFFFCC] font-fm-poppins">
                      Pose Description
                    </label>
                    <TextArea
                      value={pose.poseDescription || ""}
                      onChange={(e) =>
                        handlePoseChange(
                          index,
                          "poseDescription",
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
                      placeholder="Enter pose description..."
                    />
                  </div>
                </div>
              ))}

              <div className="flex justify-center">
                <button
                  onClick={handleAddPose}
                  className="flex items-center gap-2 bg-black rounded-lg px-4 py-2 font-fm-poppins text-[#833AFF] uppercase text-sm font-medium hover:opacity-80 transition-opacity"
                >
                  <div className="w-6 h-6 rounded-full bg-[#833AFF] flex items-center justify-center">
                    <PlusIcon className="text-white w-3 h-3" />
                  </div>
                  ADD NEW POSE
                </button>
              </div>
            </div>

            {/* DIALOGUE Section */}
            {/* <div className="space-y-4">
              <h3 className="text-fm-lg font-semibold text-fm-primary font-fm-poppins">
                DIALOGUE
              </h3>

              {dialogues.map((dialogue, index) => (
                <div
                  key={index}
                  className="bg-[#262626] rounded-xl p-4 space-y-4 border border-fm-divider-primary"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-fm-md font-semibold text-fm-primary font-fm-poppins">
                      Dialogue {index + 1}
                    </h4>
                    <button
                      onClick={() => handleRemoveDialogue(index)}
                      className="p-1 hover:bg-fm-surface-secondary rounded transition-colors"
                      aria-label={`Remove dialogue ${index + 1}`}
                    >
                      <Trash />
                    </button>
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
                  onClick={handleAddDialogue}
                  className="flex items-center gap-2 bg-black rounded-lg px-4 py-2 font-fm-poppins text-[#833AFF] uppercase text-sm font-medium hover:opacity-80 transition-opacity"
                >
                  <div className="w-6 h-6 rounded-full bg-[#833AFF] flex items-center justify-center">
                    <PlusIcon className="text-white w-3 h-3" />
                  </div>
                  ADD NEW DIALOGUE
                </button>
              </div>
            </div> */}

            {/* NARRATION Section */}
            {/* <div className="space-y-3">
              <label className="text-fm-sm font-medium text-[#FFFFFFCC] font-fm-poppins">
                Narration
              </label>
              <TextArea
                value={narration}
                onChange={(e) => setNarration(e.target.value)}
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
            </div> */}

            {/* EMOTION Section */}
            <div className="space-y-4">
              <h3 className="text-fm-lg font-semibold text-fm-primary font-fm-poppins">
                EMOTION
              </h3>

              {emotions.map((emotion, index) => (
                <div
                  key={index}
                  className="bg-[#262626] rounded-xl p-4 space-y-4 border border-fm-divider-primary"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-fm-md font-semibold text-fm-primary font-fm-poppins">
                      Emotion {index + 1}
                    </h4>
                    <button
                      onClick={() => handleRemoveEmotion(index)}
                      className="p-1 hover:bg-fm-surface-secondary rounded transition-colors"
                      aria-label={`Remove emotion ${index + 1}`}
                    >
                      <Trash />
                    </button>
                  </div>

                  <div className="space-y-3">
                    <label className="text-fm-sm font-medium text-[#FFFFFFCC] font-fm-poppins">
                      Character Name
                    </label>
                    <Input
                      type="text"
                      value={emotion.characterName || ""}
                      onChange={(e) =>
                        handleEmotionChange(
                          index,
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
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-fm-sm font-medium text-[#FFFFFFCC] font-fm-poppins">
                      Label
                    </label>
                    <Input
                      type="text"
                      value={emotion.label || ""}
                      onChange={(e) =>
                        handleEmotionChange(index, "label", e.target.value)
                      }
                      decoration="outline"
                      className="bg-fm-neutral-0! rounded-lg"
                      classes={{
                        input:
                          "bg-fm-neutral-0! text-fm-primary rounded-lg border-0",
                      }}
                    />
                  </div>

                  <div className="space-y-3">
                    <label className="text-fm-sm font-medium text-[#FFFFFFCC] font-fm-poppins">
                      Intensity
                    </label>
                    <Input
                      type="text"
                      value={emotion.intensity || ""}
                      onChange={(e) =>
                        handleEmotionChange(index, "intensity", e.target.value)
                      }
                      decoration="outline"
                      className="bg-fm-neutral-0! rounded-lg"
                      classes={{
                        input:
                          "bg-fm-neutral-0! text-fm-primary rounded-lg border-0",
                      }}
                    />
                  </div>
                </div>
              ))}

              <div className="flex justify-center">
                <button
                  onClick={handleAddEmotion}
                  className="flex items-center gap-2 bg-black rounded-lg px-4 py-2 font-fm-poppins text-[#833AFF] uppercase text-sm font-medium hover:opacity-80 transition-opacity"
                >
                  <div className="w-6 h-6 rounded-full bg-[#833AFF] flex items-center justify-center">
                    <PlusIcon className="text-white w-3 h-3" />
                  </div>
                  ADD NEW EMOTION
                </button>
              </div>
            </div>

            {/* THOUGHT Section */}
            {/* <div className="space-y-4">
              <h3 className="text-fm-lg font-semibold text-fm-primary font-fm-poppins">
                THOUGHT
              </h3>

              {thoughts.map((thought, index) => (
                <div
                  key={index}
                  className="bg-[#262626] rounded-xl p-4 space-y-4 border border-fm-divider-primary"
                >
                  <div className="flex items-center justify-between">
                    <h4 className="text-fm-md font-semibold text-fm-primary font-fm-poppins">
                      Thought {index + 1}
                    </h4>
                    <button
                      onClick={() => handleRemoveThought(index)}
                      className="p-1 hover:bg-fm-surface-secondary rounded transition-colors"
                      aria-label={`Remove thought ${index + 1}`}
                    >
                      <Trash />
                    </button>
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
                  onClick={handleAddThought}
                  className="flex items-center gap-2 bg-black rounded-lg px-4 py-2 font-fm-poppins text-[#833AFF] uppercase text-sm font-medium hover:opacity-80 transition-opacity"
                >
                  <div className="w-6 h-6 rounded-full bg-[#833AFF] flex items-center justify-center">
                    <PlusIcon className="text-white w-3 h-3" />
                  </div>
                  ADD NEW THOUGHT
                </button>
              </div>
            </div> */}
          </div>

          {/* Right Side - Non-scrollable Image Preview */}
          <div className="w-72 flex flex-col p-6 space-y-4 bg-[#141414] overflow-hidden">
            <div className="relative flex-1 min-h-0 rounded-xl overflow-hidden ">
              {imageUrl ? (
                <>
                  <Image
                    src={imageUrl}
                    alt={`Shot ${shotNumber} preview`}
                    fill
                    className="h-42 w-auto object-contain"
                    unoptimized
                  />
                </>
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-fm-secondary-800">No image available</p>
                </div>
              )}
            </div>

            <Button
              variant="outline"
              noise="none"
              onClick={handleGenerateNewVideo}
              innerClassName={cn(
                "border-none bg-[#833AFF] rounded-lg font-fm-poppins text-fm-lg text-white"
                // disableGenerateAnime && "bg-fm-neutral-100"
              )}
            >
              Generate New Image
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
