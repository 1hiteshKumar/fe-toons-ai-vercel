"use client";

import { useState, useEffect } from "react";
import { CrossCircleIcon } from "@/aural/icons/cross-circle-icon";
import Input from "@/aural/components/ui/input";
import TextArea from "@/aural/components/ui/textarea";
import { Button } from "@/aural/components/ui/button";
import { cn } from "@/aural/lib/utils";
import Image from "next/image";

type AddCharactersModalProps = {
  isOpen: boolean;
  onClose: () => void;
  mode?: "add" | "edit";
  initialName?: string;
  initialDescription?: string;
  initialImageUrl?: string | null;
  onSave?: (name: string, description: string) => void;
  onRegenerateImage?: () => void;
};

export default function AddCharactersModal({
  isOpen,
  onClose,
  mode = "add",
  initialName = "",
  initialDescription = "",
  initialImageUrl = null,
  onSave,
  onRegenerateImage,
}: AddCharactersModalProps) {
  const [name, setName] = useState(initialName);
  const [description, setDescription] = useState(initialDescription);
  const [imageUrl, setImageUrl] = useState<string | null>(initialImageUrl);

  // Update state when props change
  useEffect(() => {
    if (isOpen) {
      setName(initialName);
      setDescription(initialDescription);
      setImageUrl(initialImageUrl);
    }
  }, [isOpen, initialName, initialDescription, initialImageUrl]);

  const handleSave = () => {
    if (!name.trim()) {
      return;
    }
    onSave?.(name.trim(), description.trim());
  };

  const handleRegenerateImage = () => {
    onRegenerateImage?.();
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl mx-4 bg-[#141414] rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full bg-[#333333] hover:bg-[#444444] transition-colors"
          aria-label="Close modal"
        >
          <CrossCircleIcon className="size-6 text-white" />
        </button>

        {/* Header */}
        <div className="mb-6">
          <h2 className="text-2xl font-bold text-white mb-2 font-fm-poppins">
            {mode === "add" ? "Add Character" : "Character Edit"}
          </h2>
        </div>

        {/* Content */}
        <div className="flex gap-6">
          {/* Left Section - Form */}
          <div className="flex-1 space-y-6">
            {/* Name Input */}
            <div>
              <label
                htmlFor="character-name"
                className="block text-sm text-[#FFFFFFCC] mb-2 font-fm-poppins"
              >
                Name
              </label>
              <Input
                id="character-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Enter character name"
                fullWidth
                classes={{
                  input:
                    "bg-black text-white rounded-lg border-0 placeholder:text-white/70",
                }}
              />
            </div>

            {/* Character Description Input */}
            <div>
              <label
                htmlFor="character-description"
                className="block text-sm text-[#FFFFFFCC] mb-2 font-fm-poppins"
              >
                Character Description
              </label>
              <TextArea
                id="character-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="Enter character description"
                minHeight={150}
                maxHeight={200}
                classes={{
                  textarea:
                    "bg-black! text-white rounded-lg border-0 placeholder:text-white/70",
                }}
              />
            </div>

            {/* Regenerate Image Button */}
            <Button
              onClick={handleRegenerateImage}
              variant="outline"
              noise="none"
              className="w-full bg-[#833AFF] text-white border-none! disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center gap-2"
              innerClassName="border-none!"
            >
              <span className="text-sm font-fm-poppins border-none">
                Regenerate Image
              </span>
            </Button>
          </div>

          {/* Right Section - Image Display */}
          <div className="flex-1 relative rounded-lg overflow-hidden bg-gray-200 min-h-[400px]">
            {imageUrl ? (
              <Image
                src={imageUrl}
                alt={name || "Character"}
                fill
                className="object-cover"
                sizes="(max-width: 600px) 100vw, 600px"
                unoptimized
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center bg-gray-300">
                <p className="text-gray-500 text-sm">
                  {mode === "add" ? "Character image will appear here" : "No image available"}
                </p>
              </div>
            )}
            {/* Star icon in bottom right corner */}
            {imageUrl && (
              <div className="absolute bottom-2 right-2">
                <svg
                  width="20"
                  height="20"
                  viewBox="0 0 24 24"
                  fill="none"
                  xmlns="http://www.w3.org/2000/svg"
                  className="text-white"
                >
                  <path
                    d="M12 2L15.09 8.26L22 9.27L17 14.14L18.18 21.02L12 17.77L5.82 21.02L7 14.14L2 9.27L8.91 8.26L12 2Z"
                    fill="white"
                    stroke="white"
                    strokeWidth="1"
                  />
                </svg>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
