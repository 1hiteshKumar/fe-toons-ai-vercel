"use client";

import { useState, useEffect } from "react";
import { CrossCircleIcon } from "@/aural/icons/cross-circle-icon";
import Input from "@/aural/components/ui/input";
import TextArea from "@/aural/components/ui/textarea";
import Image from "next/image";
import { convertGoogleDriveUrl } from "@/lib/helpers";
import { cn } from "@/aural/lib/utils";

type DisplayCharacter = {
  id: number;
  name: string;
  category: string;
  description?: string;
  front_view: string | null;
  back_view: string | null;
  close_up: string | null;
  image: string | null;
};

type EditCharactersModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedCharacter?: DisplayCharacter | null;
  onRegenerateImage?: (selectedCharacter?: DisplayCharacter | null) => void;
  onSave?: (name: string, description: string, selectedCharacter?: DisplayCharacter | null) => void;
};

export default function EditCharactersModal({
  isOpen,
  onClose,
  selectedCharacter,
  onRegenerateImage,
  onSave,
}: EditCharactersModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageLoading, setImageLoading] = useState(true);

  // Reset form when modal opens/closes or when selectedCharacter changes
  useEffect(() => {
    if (isOpen && selectedCharacter) {
      setName(selectedCharacter.name || "");
      setDescription(selectedCharacter.description || "");
      setImageLoading(true);
    }
  }, [isOpen, selectedCharacter]);

  const handleRegenerateImage = () => {
    onRegenerateImage?.(selectedCharacter || null);
  };

  const handleSave = () => {
    if (!name.trim()) {
      return;
    }
    onSave?.(name.trim(), description.trim(), selectedCharacter || null);
    onClose();
  };

  const getImageUrl = (url: string | null) => {
    if (!url) return null;
    return convertGoogleDriveUrl(url);
  };

  // Get the best available image (prefer close_up, then image, then front_view)
  const imageUrl = selectedCharacter
    ? getImageUrl(
        selectedCharacter.close_up ||
          selectedCharacter.image ||
          selectedCharacter.front_view
      )
    : null;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl mx-4 bg-[#141414] rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto"
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
          <h2 className="text-xl font-bold text-white mb-2 font-fm-poppins">
            Character Edit
          </h2>
        </div>

        {/* Content */}
        <div className="flex gap-6 justify-between">
          {/* Left Section - Form */}
          <div className="w-[50%] space-y-6">
            {/* Name Input */}
            <div>
              <label
                htmlFor="edit-character-name"
                className="block text-sm text-[#FFFFFFCC] mb-2 font-fm-poppins"
              >
                Name
              </label>
              <Input
                id="edit-character-name"
                value={name}
                onChange={(e) => setName(e.target.value)}
                placeholder="Edgar"
                decoration="outline"
                fullWidth
                classes={{
                  label: "font-poppins mb-2 text-fm-neutral-1100/80",
                  input: "bg-black text-fm-md rounded-xl border-0",
                }}
              />
            </div>

            {/* Character Description Input */}
            <div>
              <label
                htmlFor="edit-character-description"
                className="block text-sm text-[#FFFFFFCC] mb-2 font-fm-poppins"
              >
                Character Description
              </label>
              <TextArea
                id="edit-character-description"
                value={description}
                onChange={(e) => setDescription(e.target.value)}
                placeholder="From a bird's eye view, the vast stadium crowd is visible, a chaotic sea of faces turning between the VIP box and the arena floor. The collective murmur of thousands of confused spectators creates an uneasy soundscape."
                minHeight={150}
                maxHeight={200}
                classes={{
                  textarea:
                    "bg-black! text-white rounded-lg border-0 placeholder:text-white/70",
                }}
              />
            </div>

            {/* Regenerate Image Button */}
            <button
              onClick={handleRegenerateImage}
              className="w-full bg-[#833AFF] text-white border-none! disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center gap-2 py-3.5 px-3"
            >
              <span className="text-sm font-fm-poppins border-none">
                Regenerate Image
              </span>
            </button>
          </div>

          {/* Right Section - Image Display */}
          <div className="w-[40%]">
            <div
              className={cn(
                "relative  shrink-0 max-h-[70vh] rounded-xl",
                (!imageUrl || imageLoading) &&
                  "bg-fm-surface-tertiary animate-pulse"
              )}
            >
              {imageUrl ? (
              
                  <Image
                    src={imageUrl}
                    alt={selectedCharacter?.name || "Character"}
                    width={400}
                    height={700}
                    className="object-contain rounded-xl max-w-90"
                    unoptimized
                    onLoad={() => setImageLoading(false)}
                    onError={() => setImageLoading(false)}
                  />
                
              
              ) : (
                <div className="w-full h-full flex items-center justify-center">
                  <p className="text-gray-500 text-sm">No image available</p>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

