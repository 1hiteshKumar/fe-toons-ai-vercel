"use client";

import { useState, useEffect } from "react";
import Image from "next/image";
import { Button } from "@/aural/components/ui/button";
import Input from "@/aural/components/ui/input";
import TextArea from "@/aural/components/ui/textarea";
import { TrashIcon } from "@/aural/icons/trash-icon";
import { EditBigIcon } from "@/aural/icons/edit-big-icon";
import { CrossCircleIcon } from "@/aural/icons/cross-circle-icon";
import { cn } from "@/aural/lib/utils";
import { PanelItem } from "@/lib/types";
import { convertGoogleDriveUrl } from "@/lib/helpers";

type Cut = {
  cinematography?: string;
  subject?: string;
  action?: string;
  [key: string]: unknown;
};

interface EditImageModalProps {
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

export default function EditImageModal({
  isOpen,
  onClose,
  shotData,
  shotNumber,
  onSave,
}: EditImageModalProps) {
  const [videoNumber, setVideoNumber] = useState(shotNumber);
  const [videoDuration, setVideoDuration] = useState(5);
  const [cuts, setCuts] = useState<Cut[]>([]);

  // Initialize form data from shotData
  useEffect(() => {
    if (shotData) {
      setVideoNumber(shotNumber);

      // Get duration from panel_prompt_data
      const duration = shotData.panel_prompt_data?.duration || 5;
      setVideoDuration(duration);

      // Get cuts from panel_prompt_data
      const existingCuts = Array.isArray(shotData.panel_prompt_data?.cuts)
        ? (shotData.panel_prompt_data.cuts as Cut[])
        : [];

      // If no cuts exist, create a default one
      if (existingCuts.length === 0) {
        setCuts([
          {
            cinematography: "",
            subject: "",
            action: "",
          },
        ]);
      } else {
        // Map existing cuts to our format
        setCuts(
          existingCuts.map((cut) => ({
            cinematography: cut.cinematography || "",
            subject: cut.subject || "",
            action: cut.action || "",
          }))
        );
      }
    }
  }, [shotData, shotNumber]);

  if (!isOpen || !shotData) return null;

  const imageUrl = shotData.start_frame_url
    ? convertGoogleDriveUrl(shotData.start_frame_url)
    : "";

  const handleAddCut = () => {
    setCuts([
      ...cuts,
      {
        cinematography: "",
        subject: "",
        action: "",
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

  const handleGenerateNewVideo = () => {
    // TODO: Implement generate new video functionality
    console.log("Generate new video", { videoNumber, videoDuration, cuts });
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
        <div className="flex items-center justify-between p-6 border-b border-fm-divider-primary bg-[#141414]">
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
          <div className="flex-1 overflow-y-auto p-6 space-y-6 border-r border-fm-divider-primary bg-[#141414]">
            {/* Video Number */}
            <div className="space-y-3">
              <label className="text-fm-sm font-medium text-[#FFFFFFCC] font-fm-poppins">
                Video Number<span className="text-red-500">*</span>
              </label>
              <Input
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
                Video Duration<span className="text-red-500">*</span>
              </label>
              <Input
                type="number"
                value={videoDuration}
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
              <div className="flex items-center justify-between">
                <h3 className="text-fm-lg font-semibold text-fm-primary font-fm-poppins">
                  CUTS
                </h3>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={handleAddCut}
                  className="font-fm-poppins"
                >
                  Add Cut
                </Button>
              </div>

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
                      <TrashIcon className="size-4 text-fm-primary" />
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
                </div>
              ))}
            </div>
          </div>

          {/* Right Side - Non-scrollable Image Preview */}
          <div className="w-96 flex flex-col p-6 space-y-4 bg-[#141414] overflow-hidden">
            <div className="relative flex-1 min-h-0 rounded-xl overflow-hidden bg-fm-surface-tertiary border border-fm-divider-primary">
              {imageUrl ? (
                <>
                  <Image
                    src={imageUrl}
                    alt={`Shot ${shotNumber} preview`}
                    fill
                    className="object-contain"
                    unoptimized
                  />
                  {/* <Button
                    variant="outline"
                    size="sm"
                    className="absolute top-4 right-4 font-fm-poppins"
                    onClick={() => {
                      // TODO: Implement edit image functionality
                      console.log("Edit image clicked");
                    }}
                  >
                    <EditBigIcon className="size-5 mr-2" />
                    Edit Image
                  </Button> */}
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
              Generate New Video
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
