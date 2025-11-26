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

interface Character {
  name: string;
  front_view: string;
  back_view: string;
}

export default function Characters({ onNext }: { onNext?: () => void }) {
  const [characters, setCharacters] = useState<Character[]>([]);
  const [selectedCharacter, setSelectedCharacter] = useState<Character | null>(
    null
  );
  const [selectedView, setSelectedView] = useState<"front" | "back">("front");
  const [loading, setLoading] = useState(true);
  const params = useParams() as { id: string };

  useEffect(() => {
    const getCharacters = async () => {
      setLoading(true);
      try {
        const res = await fetchCharacters(params.id);
        const chars = res.characters || [];
        setCharacters(chars);
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
    setSelectedView("front");
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
        heading="Character Editor"
        rightElement={
          onNext && (
            <Button
              onClick={onNext}
              variant="outline"
              rightIcon={<ArrowRightIcon className="text-white" />}
              noise="none"
              className="font-fm-poppins"
            >
              Continue
            </Button>
          )
        }
      />

      <div className="flex gap-6">
        {/* Left Sidebar - Character Thumbnails */}
        <div className="w-72 shrink-0 bg-fm-surface-secondary border-r border-fm-divider-primary p-4 ">
          <h2 className="text-lg font-bold text-fm-primary mb-4 sticky top-0 bg-fm-surface-secondary pb-2">
            Characters
          </h2>
          <div className="space-y-3 h-[calc(100vh-200px)] overflow-y-auto">
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
                  <div className="aspect-square relative bg-fm-surface-tertiary flex">
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
                  <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                  <div className="absolute bottom-0 left-0 right-0 p-2">
                    <p
                      className={cn(
                        "font-semibold text-white drop-shadow-lg transition-opacity duration-200"
                      )}
                    >
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
        <div className="flex-1 flex flex-col bg-fm-surface-secondary rounded-lg border border-fm-divider-primary overflow-hidden">
          {selectedCharacter ? (
            <>
              {/* Character Header */}
              <div className="p-6 border-b border-fm-divider-primary bg-fm-surface-primary">
                <p className="text-3xl font-bold text-fm-primary mb-2">
                  {selectedCharacter.name}
                </p>
                <div className="flex gap-2 mt-4">
                  <Button
                    onClick={() => setSelectedView("front")}
                    variant={"outline"}
                    noise="none"
                    innerClassName={cn("", {
                      "bg-[#833AFF] border-none": selectedView === "front",
                    })}
                  >
                    Front View
                  </Button>
                  <Button
                    variant={"outline"}
                    onClick={() => setSelectedView("back")}
                    noise="none"
                    innerClassName={cn("", {
                      "bg-[#833AFF] border-none": selectedView === "back",
                    })}
                  >
                    Back View
                  </Button>
                </div>
              </div>

              {/* Main Image Display */}
              <div className="flex-1 flex items-center justify-center p-8 relative overflow-hidden">
                <div className="relative w-full h-full max-w-4xl max-h-[600px] rounded-xl overflow-hidden shadow-2xl border-2">
                  <Image
                    src={getImageUrl(
                      selectedView === "front"
                        ? selectedCharacter.front_view
                        : selectedCharacter.back_view
                    )}
                    alt={`${selectedCharacter.name} - ${selectedView} view`}
                    fill
                    className="object-contain"
                    sizes="(max-width: 1024px) 100vw, 1024px"
                    priority
                    unoptimized
                  />
                </div>

                {/* Decorative background elements */}
                <div className="absolute inset-0 opacity-5 pointer-events-none">
                  <div className="absolute top-0 left-0 size-96 bg-fm-primary-500 rounded-full blur-3xl" />
                  <div className="absolute bottom-0 right-0 size-96 bg-fm-primary-400 rounded-full blur-3xl" />
                </div>
              </div>

              {/* Image Navigation Dots */}
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
              </div>
            </>
          ) : (
            <div className="flex items-center justify-center h-full">
              <p className="text-lg">Select a character to view</p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
