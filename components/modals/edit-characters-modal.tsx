"use client";

import { useState, useEffect, useRef } from "react";
import { CrossCircleIcon } from "@/aural/icons/cross-circle-icon";
import Input from "@/aural/components/ui/input";
import TextArea from "@/aural/components/ui/textarea";
import Image from "next/image";
import { convertGoogleDriveUrl } from "@/lib/helpers";
import { cn } from "@/aural/lib/utils";
import { PollingResponse } from "./add-characters-modal";
import { baseFetch } from "@/lib/baseFetchUtil";

type DisplayCharacter = {
  id: number;
  name: string;
  category: string;
  description?: string;
  front_view: string | null;
  back_view: string | null;
  close_up: string | null;
  side_view: string | null;
  image: string | null;
};

type EditCharactersModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedCharacter?: DisplayCharacter | null;
  onRegenerateImage?: (
    name: string,
    description: string,
    selectedCharacter?: DisplayCharacter | null,
    pollingResponse?: PollingResponse | null
  ) => void;
  pollingResponse?: PollingResponse | null;
};

export default function EditCharactersModal({
  isOpen,
  onClose,
  selectedCharacter,
  onRegenerateImage,
  pollingResponse,
}: EditCharactersModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [imageLoading, setImageLoading] = useState(true);
  const [isRegenerating, setIsRegenerating] = useState(false);
  const originalValuesRef = useRef<{ name: string; description: string }>({
    name: "",
    description: "",
  });

  // Reset form when modal opens/closes or when selectedCharacter changes
  useEffect(() => {
    if (isOpen && selectedCharacter) {
      const originalName = selectedCharacter.name || "";
      const originalDescription = selectedCharacter.description || "";
      setName(originalName);
      setDescription(originalDescription);
      originalValuesRef.current = {
        name: originalName,
        description: originalDescription,
      };
      setImageLoading(true);
    }
  }, [isOpen, selectedCharacter]);

  // Check if values have changed
  const hasChanges =
    name.trim() !== originalValuesRef.current.name.trim() ||
    description.trim() !== originalValuesRef.current.description.trim();

  const handleRegenerateImage = async () => {
    if (!name.trim() || !pollingResponse || !selectedCharacter) {
      return;
    }

    setIsRegenerating(true);

    try {
      // Find the character in the polling response and update it
      const updatedCharacters = pollingResponse.characters.map((char) => {
        if (char.id === selectedCharacter.id) {
          return {
            ...char,
            name: name.trim(),
            character_description: {
              ...char.character_description,
              description: description.trim(),
            },
          };
        }
        return char;
      });

      const modifiedResponse: PollingResponse = {
        ...pollingResponse,
        characters: updatedCharacters,
      };

      // Make API call to sync-characters
      const taskId = pollingResponse.task_id;
      await baseFetch(
        `/api/workers/character-context/${taskId}/sync-characters/`,
        {
          method: "POST",
          body: JSON.stringify(modifiedResponse),
        },
        "https://api.blaze.pockettoons.com"
      );

      // Make API call to regenerate-images
      await baseFetch(
        `/api/workers/character-context/regenerate-images/`,
        {
          method: "POST",
          body: JSON.stringify({
            task_id: taskId,
            character_ids: [selectedCharacter.id],
          }),
        },
        "https://api.blaze.pockettoons.com"
      );

      // Call the onRegenerateImage callback with modified response
      // The parent component will handle the refetch/polling logic
      onRegenerateImage?.(
        name.trim(),
        description.trim(),
        selectedCharacter || null,
        modifiedResponse
      );
      onClose();
    } catch (err) {
      console.error("Error regenerating character:", err);
      // TODO: Show error toast or message
    } finally {
      setIsRegenerating(false);
    }
  };

  const getImageUrl = (url: string | null) => {
    if (!url) return null;
    return convertGoogleDriveUrl(url);
  };

  // Get the best available image (prefer close_up, then image, then front_view)
  const imageUrl = selectedCharacter
    ? getImageUrl(selectedCharacter.front_view)
    : null;

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-5xl mx-4 bg-[#141414] rounded-xl shadow-lg p-6 px-8 max-h-[90vh] overflow-y-auto"
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
          <div className="w-[55%] space-y-6">
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
              disabled={
                !name.trim() ||
                !pollingResponse ||
                isRegenerating ||
                !hasChanges
              }
            >
              <span className="text-sm font-fm-poppins border-none">
                {isRegenerating ? "Regenerating..." : "Regenerate Image"}
              </span>
            </button>
          </div>

          {/* Right Section - Image Display */}
          <div className="w-[35%]">
            <div
              className={cn(
                "relative  shrink-0 max-h-[70vh] rounded-xl flex justify-end",
                (!imageUrl || imageLoading) &&
                  "bg-fm-surface-tertiary animate-pulse"
              )}
            >
              {imageUrl ? (
                <Image
                  src={imageUrl}
                  alt={selectedCharacter?.name || "Character"}
                  width={310}
                  height={500}
                  className="object-contain rounded-xl max-h-[600px]!"
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
