"use client";

import { useState, useEffect } from "react";
import { CrossCircleIcon } from "@/aural/icons/cross-circle-icon";
import Input from "@/aural/components/ui/input";
import TextArea from "@/aural/components/ui/textarea";
import { baseFetch } from "@/lib/baseFetchUtil";

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

type CharacterOrCreature = {
  id?: number;
  name: string;
  category: string;
  character_description?: {
    aliases?: string[];
    references?: string;
    description?: string;
    [key: string]: unknown;
  };
  image?: string | null;
  close_up?: string | null;
  back_view?: string | null;
  side_view?: string | null;
  image_group_id?: string | null;
  status?: string;
  voice_id?: string | null;
  reference_images?: Record<string, unknown>;
  created_at?: string;
  changed_at?: string;
  [key: string]: unknown;
};

type PollingResponse = {
  characters: CharacterOrCreature[];
  creatures: CharacterOrCreature[];
  backgrounds: Array<unknown>;
  props: Array<unknown>;
  task_id: number;
  task_status: string;
  error?: string;
};

type AddCharactersModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedCharacter?: DisplayCharacter | null;
  pollingResponse?: PollingResponse | null;
  onGenerate?: (name: string, description: string, selectedCharacter?: DisplayCharacter | null, pollingResponse?: PollingResponse | null) => void;
};

export default function AddCharactersModal({
  isOpen,
  onClose,
  selectedCharacter,
  pollingResponse,
  onGenerate,
}: AddCharactersModalProps) {
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");
  const [isGenerating, setIsGenerating] = useState(false);

  // Reset form when modal opens/closes or when selectedCharacter changes
  useEffect(() => {
    if (isOpen) {
      if (selectedCharacter) {
        setName("");
        setDescription("");
      } else {
        setName("");
        setDescription("");
      }
    }
  }, [isOpen, selectedCharacter]);

  const handleGenerate = async () => {
    if (!name.trim() || !pollingResponse) {
      return;
    }

    setIsGenerating(true);

    try {
      // Create modified polling response with new character added
      const newCharacter: CharacterOrCreature = {
        name: name.trim(),
        category: "human",
        character_description: {
          aliases: [],
          references: "low",
          description: description.trim(),
        },
        image: null,
      };

      const modifiedResponse: PollingResponse = {
        ...pollingResponse,
        characters: [...pollingResponse.characters, newCharacter],
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

      // Call the onGenerate callback with modified response
      // The parent component will handle the refetch/polling logic
      onGenerate?.(name.trim(), description.trim(), selectedCharacter || null, modifiedResponse);
      onClose();
    } catch (err) {
      console.error("Error generating character:", err);
      // TODO: Show error toast or message
    } finally {
      setIsGenerating(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl mx-4 bg-[#141414] rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto"
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
            Create Character
          </h2>
        </div>

        {/* Form */}
        <div className="space-y-6">
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
              htmlFor="character-description"
              className="block text-sm text-[#FFFFFFCC] mb-2 font-fm-poppins"
            >
              Character Description
            </label>
            <TextArea
              id="character-description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter your new character description here..."
              minHeight={150}
              maxHeight={200}
              classes={{
                textarea:
                  "bg-black! text-white rounded-lg border-0 placeholder:text-white/70",
              }}
            />
          </div>

          {/* Generate Character Button */}
          <button
            onClick={handleGenerate}
            className="w-full bg-[#833AFF] text-white border-none! disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center gap-2 py-3.5 px-3"
            disabled={!name.trim() || !pollingResponse || isGenerating}
          >
            <span className="text-sm font-fm-poppins border-none">
              {isGenerating ? "Generating..." : "Generate Character"}
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}

