import fetchCharacters from "@/server/queries/fetch-characters";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import Image from "next/image";
import { Button } from "@/aural/components/ui/button";
import { cn } from "@/aural/lib/utils";
import { convertGoogleDriveUrl } from "@/lib/helpers";
import Loading from "@/components/loading";
import Heading from "@/components/heading";
import ArrowRightIcon from "@/aural/icons/arrow-right-icon";
import { Pencil, PlusIcon, Trash } from "@/lib/icons";
import AddCharactersModal from "@/components/modals/add-characters-modal";

interface Character {
  name: string;
  front_view: string;
  back_view: string;
  close_up?: string;
}

export default function Characters({
  onNext,
  setCharacterToAvatarMapping,
}: {
  onNext?: () => void;
  setCharacterToAvatarMapping: (val: Record<string, string>) => void;
}) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );

  const [loading, setLoading] = useState(true);
  const [isAddCharacterModalOpen, setIsAddCharacterModalOpen] = useState(false);
  const [editingCharacter, setEditingCharacter] = useState<Character | null>(
    null
  );
  const params = useParams() as { id: string };

  useEffect(() => {
    const getCharacters = async () => {
      setLoading(true);
      try {
        const res = await fetchCharacters(params.id);
        const chars = res.characters || [];
        setCharacters(chars);
        const avatarMapping = {};
        //@ts-expect-error for now
        chars.forEach((c) => (avatarMapping[c.name] = c.close_up));

        setCharacterToAvatarMapping(avatarMapping);

        if (chars.length > 0) {
          setSelectedCharacter((prev) => prev || chars[0]);
        }
      } finally {
        setLoading(false);
      }
    };
    getCharacters();
  }, [params.id]);

  const handleCharacterSelect = (character: Character) => {
    setSelectedCharacter(character);
  };

  const getImageUrl = (url: string) => convertGoogleDriveUrl(url);

  if (loading) {
    return <Loading text="characters" />;
  }

  if (characters.length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-fm-primary text-lg">No characters found</p>
      </div>
    );
  }

  return (
    <div>
      <Heading
        subHeading="Select and customize your character."
        heading="Characters"
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

      <div className="flex gap-6 h-[calc(100vh-240px)]">
        {/* Left Sidebar - Character Thumbnails */}
        <div className="w-72 shrink-0 bg-fm-surface-secondary border-r border-fm-divider-primary p-4 flex flex-col h-full">
          <div className="flex items-center justify-between mb-4 shrink-0">
            <h2 className="text-lg font-bold text-fm-primary">Characters</h2>
            <button
             
              className="text-[#AB79FF] font-bold transition-colors font-fm-poppins text-fm-lg flex items-center gap-1"
            >
              <PlusIcon />
              ADD
            </button>
          </div>
          <div className="space-y-3 flex-1 overflow-y-auto min-h-0">
            {characters.map((character, index) => {
              const isSelected = selectedCharacter?.name === character.name;
              return (
                <button
                  key={index}
                  onClick={() => handleCharacterSelect(character)}
                  className={cn(
                    "w-full group relative overflow-hidden rounded-lg border-2 transition-all duration-200",
                    isSelected
                      ? "border-fm-primary shadow-lg shadow-fm-primary-500/20"
                      : "border-fm-divider-primary hover:border-fm-pr"
                  )}
                >
                  <div className="aspect-square relative bg-fm-surface-tertiary">
                    {character.close_up ? (
                      <Image
                        src={getImageUrl(character.close_up)}
                        alt={`${character.name} - close up`}
                        fill
                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                        sizes="(max-width: 128px) 100vw, 128px"
                        unoptimized
                      />
                    ) : (
                      <div className="flex h-full">
                        <div className="relative w-1/2 h-full">
                          <Image
                            src={getImageUrl(character.front_view)}
                            alt={`${character.name} - front view`}
                            fill
                            className="object-cover transition-transform duration-200 group-hover:scale-105"
                            sizes="(max-width: 128px) 100vw, 128px"
                            unoptimized
                          />
                        </div>
                        <div className="w-px bg-fm-divider-primary" />
                        <div className="relative w-1/2 h-full">
                          <Image
                            src={getImageUrl(character.back_view)}
                            alt={`${character.name} - back view`}
                            fill
                            className="object-cover transition-transform duration-200 group-hover:scale-105"
                            sizes="(max-width: 128px) 100vw, 128px"
                            unoptimized
                          />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <p className="inline-block z-10 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-xs font-semibold text-white">
                      {character.name}
                    </p>
                  </div>
                  {isSelected && (
                    <div className="absolute top-2 right-2 w-3 h-3 bg-fm-primary-500 rounded-full border-2 border-white shadow-lg" />
                  )}
                </button>
              );
            })}
          </div>
        </div>

        {/* Right Side - Main Character View */}
        <div className="flex-1 flex flex-col bg-black rounded-lg border border-none overflow-hidden h-full">
          {selectedCharacter ? (
            <>
              {/* Main Image Display - All 3 views at once */}
              <div className="flex-1 flex flex-col p-6 relative overflow-hidden min-h-0">
                {/* Character Name at top left */}
               
                <div className="flex items-center justify-between mb-4">
                  <p className="text-2xl font-bold text-white font-fm-poppins">
                    {selectedCharacter.name}
                  </p>
                  <div className="flex items-center gap-3">
                    <button
                      onClick={() => {
                        // TODO: Implement delete functionality
                      }}
                      className="p-2 rounded-lg hover:bg-[#333333] transition-colors"
                      aria-label="Delete character"
                    >
                      <Trash />
                    </button>
                    <button
                  
                      onClick={() => {
                        setEditingCharacter(null);
                        setIsAddCharacterModalOpen(true);
                      }}
                      className="p-2 rounded-lg hover:bg-[#333333] transition-colors"
                      aria-label="Edit character"
                    >
                      <Pencil />
                    </button>
                  </div>
                </div>

                <div className="flex-1 w-full flex gap-4 items-center justify-center min-h-0">
                  {/* Close Up View */}
                  {selectedCharacter.close_up ? (
                    <div className="flex-1 h-full max-h-full relative rounded-lg overflow-hidden bg-gray-200">
                      <div className="absolute top-2 left-2 z-10 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-xs font-semibold text-white">
                        Close Up
                      </div>
                      <Image
                        src={getImageUrl(selectedCharacter.close_up)}
                        alt={`${selectedCharacter.name} - close up`}
                        fill
                        className="object-cover"
                        sizes="(max-width: 400px) 100vw, 400px"
                        priority
                        unoptimized
                      />
                    </div>
                  ) : (
                    <div className="flex-1 h-full max-h-full relative rounded-lg overflow-hidden bg-gray-200">
                      <div className="absolute top-2 left-2 z-10 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-xs font-semibold text-white">
                        Close Up
                      </div>
                      <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                        <p className="text-gray-500 text-sm">
                          No close up available
                        </p>
                      </div>
                    </div>
                  )}

                  {/* Front View */}
                  <div className="flex-1 h-full max-h-full relative rounded-lg overflow-hidden bg-gray-200">
                    <div className="absolute top-2 left-2 z-10 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-xs font-semibold text-white">
                      Front
                    </div>
                    <Image
                      src={getImageUrl(selectedCharacter.front_view)}
                      alt={`${selectedCharacter.name} - front view`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 400px) 100vw, 400px"
                      unoptimized
                    />
                  </div>

                  {/* Back View */}
                  <div className="flex-1 h-full max-h-full relative rounded-lg overflow-hidden bg-gray-200">
                    <div className="absolute top-2 left-2 z-10 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-xs font-semibold text-white">
                      Back
                    </div>
                    <Image
                      src={getImageUrl(selectedCharacter.back_view)}
                      alt={`${selectedCharacter.name} - back view`}
                      fill
                      className="object-cover"
                      sizes="(max-width: 400px) 100vw, 400px"
                      unoptimized
                    />
                  </div>
                </div>
              </div>

              {/* Image Navigation Dots
              <div className="p-4 border-t border-fm-divider-primary bg-fm-surface-primary flex items-center justify-center gap-2">
                {characters.map((char, index) => {
                  const isActive = char.name === selectedCharacter.name;
                  return (
                    <button
                      key={index}
                      onClick={() => handleCharacterSelect(char)}
                      className={cn(
                        "size-2 rounded-full transition-all duration-200",
                        isActive
                          ? "w-8 bg-[#833AFF]"
                          : "bg-fm-divider-primary hover:bg-[#833AFF]"
                      )}
                      aria-label={`View ${char.name}`}
                    />
                  );
                })}
              </div> */}
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-lg">Select a character to view</p>
            </div>
          )}
        </div>
      </div>

      {/* Add Character Modal */}
      <AddCharactersModal
        isOpen={isAddCharacterModalOpen}
        onClose={() => {
          setIsAddCharacterModalOpen(false);
          setEditingCharacter(null);
        }}
        mode={editingCharacter ? "edit" : "add"}
        initialName={editingCharacter?.name || ""}
        initialDescription="" // TODO: Add description field to Character interface if available
        initialImageUrl={
          editingCharacter
            ? editingCharacter.close_up
              ? getImageUrl(editingCharacter.close_up)
              : editingCharacter.front_view
              ? getImageUrl(editingCharacter.front_view)
              : null
            : null
        }
        onSave={(name, description) => {
          // TODO: Implement save functionality
          console.log("Save character:", {
            name,
            description,
            character: editingCharacter,
            mode: editingCharacter ? "edit" : "add",
          });
          setIsAddCharacterModalOpen(false);
          setEditingCharacter(null);
        }}
        onRegenerateImage={() => {
          // TODO: Implement regenerate image functionality
          console.log("Regenerate image", { character: editingCharacter });
        }}
      />
    </div>
  );
}
