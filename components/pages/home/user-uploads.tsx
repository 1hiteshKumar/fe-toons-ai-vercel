"use client";

import { Button } from "@/aural/components/ui/button";
import TextArea from "@/aural/components/ui/textarea";
import Input from "@/aural/components/ui/input";
import { PollingProvider } from "@/lib/hooks/use-polling";
import useUserUploads from "@/lib/hooks/use-user-uploads";
import useStyleLists from "@/lib/hooks/use-style-lists";
import UserStories from "./user-stories";
import CreateArtStyleModal from "./create-art-style-modal";
import CreateCharacterDescriptionModal from "./create-character-description-modal";
import { cn } from "@/aural/lib/utils";
import Image from "next/image";
import { useState, useRef, useEffect } from "react";
import ChevronRightIcon from "@/aural/icons/chevron-right-icon";
import { PlusIcon } from "@/lib/icons";

function UserUploadsContent() {
  const {
    scriptText,
    setScriptText,
    selectedFile,
    getRootProps,
    getInputProps,
    isDragActive,
    onGenerate,
    handleRemoveFile,
    stories,
    loading,
    styleId,
    setStyleId,
    showName,
    setShowName,
    setCharacterSheetUrl,
  } = useUserUploads();

  const {
    data: styleOptions,
    loading: stylesLoading,
    refetch: refetchStyles,
  } = useStyleLists({
    userId: 7,
    accessToken: "c7eb5f9a-e958-4a47-85fe-0b2674a946eb",
    enabled: true,
  });

  const [isStyleDropdownOpen, setStyleDropdownOpen] = useState(false);
  const [highlightedIndex, setHighlightedIndex] = useState(0);
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);
  const [isCreateCharacterModalOpen, setIsCreateCharacterModalOpen] =
    useState(false);
  const [pendingStyleId, setPendingStyleId] = useState<number | null>(null);
  const [shouldSelectFirstAfterRefetch, setShouldSelectFirstAfterRefetch] = useState(false);
  const dropdownRef = useRef<HTMLDivElement>(null);
  const triggerRef = useRef<HTMLButtonElement>(null);
  const optionRefs = useRef<(HTMLButtonElement | null)[]>([]);

  const selectedStyle = styleOptions.find((style) => style.id === styleId);

  // Common function to handle refetch and select first style
  const handleRefetchAndSelectFirst = async () => {
    await refetchStyles();
    setShouldSelectFirstAfterRefetch(true);
  };

  // Set the styleId when the pending style appears in the options after refetch
  useEffect(() => {
    if (pendingStyleId && styleOptions.length > 0) {
      const styleExists = styleOptions.some((style) => style.id === pendingStyleId);
      if (styleExists) {
        setStyleId(pendingStyleId);
        setShouldSelectFirstAfterRefetch(false);
        // setPendingStyleId(null);
      }
    }
  }, [styleOptions, pendingStyleId, setStyleId]);

  // Select the 0th index element after refetch
  useEffect(() => {
    if (shouldSelectFirstAfterRefetch && styleOptions.length > 0) {
      // Only select first if there's no pending style ID
      if (!pendingStyleId) {
        setStyleId(styleOptions[0].id);
        setShouldSelectFirstAfterRefetch(false);
      }
    }
  }, [styleOptions, shouldSelectFirstAfterRefetch, pendingStyleId, setStyleId]);

  // Handle keyboard navigation
  useEffect(() => {
    const handleKeyDown = (event: KeyboardEvent) => {
      if (!isStyleDropdownOpen) {
        // Open dropdown on ArrowDown or Enter when closed
        if (event.key === "ArrowDown" || event.key === "Enter") {
          event.preventDefault();
          setStyleDropdownOpen(true);
          // Set initial highlight to selected item or first item
          const currentIndex = styleOptions.findIndex(
            (style) => style.id === styleId
          );
          setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
        }
        return;
      }

      switch (event.key) {
        case "ArrowDown":
          event.preventDefault();
          setHighlightedIndex((prev) =>
            prev < styleOptions.length - 1 ? prev + 1 : 0
          );
          break;
        case "ArrowUp":
          event.preventDefault();
          setHighlightedIndex((prev) =>
            prev > 0 ? prev - 1 : styleOptions.length - 1
          );
          break;
        case "Enter":
          event.preventDefault();
          if (highlightedIndex >= 0 && highlightedIndex < styleOptions.length) {
            const selectedOption = styleOptions[highlightedIndex];
            setStyleId(selectedOption.id);
            setStyleDropdownOpen(false);
            setHighlightedIndex(-1);
          }
          break;
        case "Escape":
          event.preventDefault();
          setStyleDropdownOpen(false);
          setHighlightedIndex(-1);
          triggerRef.current?.focus();
          break;
      }
    };

    const triggerElement = triggerRef.current;
    if (triggerElement) {
      triggerElement.addEventListener("keydown", handleKeyDown);
    }

    return () => {
      if (triggerElement) {
        triggerElement.removeEventListener("keydown", handleKeyDown);
      }
    };
  }, [
    isStyleDropdownOpen,
    highlightedIndex,
    styleId,
    setStyleId,
    styleOptions,
  ]);

  // Scroll highlighted option into view
  useEffect(() => {
    if (
      isStyleDropdownOpen &&
      highlightedIndex >= 0 &&
      optionRefs.current[highlightedIndex]
    ) {
      optionRefs.current[highlightedIndex]?.scrollIntoView({
        block: "nearest",
        behavior: "smooth",
      });
    }
  }, [highlightedIndex, isStyleDropdownOpen]);

  // Handle click outside to close dropdown
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (
        dropdownRef.current &&
        triggerRef.current &&
        !dropdownRef.current.contains(event.target as Node) &&
        !triggerRef.current.contains(event.target as Node)
      ) {
        setStyleDropdownOpen(false);
        setHighlightedIndex(-1);
      }
    };

    if (isStyleDropdownOpen) {
      document.addEventListener("mousedown", handleClickOutside);
    }

    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, [isStyleDropdownOpen]);

  const disableGenerateAnime =
    !(scriptText && selectedFile && showName && styleId) || loading;

  // console.log({styleOptions})
  // console.log(styleOptions[highlightedIndex])
  return (
    <div className="w-full space-y-6 p-5 mx-auto">
      <nav className="flex items-center justify-center">
        <Image
          src="/images/toons.png"
          alt="PocketToons Logo"
          width={120}
          height={40}
          className="h-10 w-auto"
          priority
        />
      </nav>
      <div className="flex">
        <section className="flex-1 space-y-5">
          <div>
            <p className="font-bold text-2xl">Tell your story</p>
            <p className="max-w-lg text-fm-neutral-1100/80 text-fm-md mt-4">
              Share your imagination and watch it transform into an anime. Every
              great story starts with a single idea!
            </p>
          </div>
          <div className="mt-6 space-y-2">
            <div className="space-y-4 flex items-center gap-4">
              <Input
                id="show-name"
                label="Show Name"
                placeholder="Enter show name"
                value={showName}
                onChange={(e) => setShowName(e.target.value)}
                decoration="outline"
                fullWidth
                classes={{
                  label: "font-poppins mb-2 text-fm-neutral-1100/80",
                  input: "bg-black text-fm-md rounded-xl border-0",
                }}
              />

              <div className="w-full mb-4.5 relative">
                <div className="flex items-center justify-between mb-2">
                  <p className="font-fm-poppins text-fm-sm text-white">
                    Art Style
                  </p>
                  <button
                    type="button"
                    onClick={() => setIsCreateModalOpen(true)}
                    className="flex items-center gap-1.5 text-[#AB79FF]  transition-colors font-fm-poppins text-fm-md"
                  >
                    <PlusIcon />
                    Create Art Style
                  </button>
                </div>

                {/* dropdown */}
                <button
                  ref={triggerRef}
                  type="button"
                  onClick={() => {
                    const willOpen = !isStyleDropdownOpen;
                    setStyleDropdownOpen(willOpen);
                    if (willOpen) {
                      // Set initial highlight to selected item or first item
                      const currentIndex = styleOptions.findIndex(
                        (style) => style.id === styleId
                      );
                      setHighlightedIndex(currentIndex >= 0 ? currentIndex : 0);
                    }
                  }}
                  className={cn(
                    "w-full h-12 px-3 py-4 rounded-xl",
                    "text-white font-fm-text leading-fm-md text-fm-md",
                    "bg-black",
                    "focus:outline-none transition-all duration-200",
                    "flex items-center justify-between"
                  )}
                >
                  <span
                    className={cn(
                      !selectedStyle && "text-fm-placeholder",
                      selectedStyle && "text-white"
                    )}
                  >
                    {selectedStyle?.name || "Select a style"}
                  </span>

                  <ChevronRightIcon
                    className={cn(
                      "size-5 text-fm-icon-active transition-transform border rounded-full",
                      isStyleDropdownOpen ? "-rotate-90" : "rotate-90"
                    )}
                  />
                </button>
                {isStyleDropdownOpen && (
                  <div
                    ref={dropdownRef}
                    className="absolute z-50 w-full mt-1 bg-black border border-fm-divider-primary rounded-xl shadow-lg max-h-[240px] overflow-y-auto"
                  >
                    {stylesLoading ? (
                      <div className="w-full px-3 py-3 text-center text-white text-fm-md">
                        Loading styles...
                      </div>
                    ) : styleOptions.length === 0 ? (
                      <div className="w-full px-3 py-3 text-center text-white text-fm-md">
                        No styles available
                      </div>
                    ) : (
                      styleOptions.map((style, index) => (
                        <button
                          key={style.id}
                          ref={(el) => {
                            optionRefs.current[index] = el;
                          }}
                          type="button"
                          onClick={() => {
                            setStyleId(style.id);
                            setStyleDropdownOpen(false);
                            setHighlightedIndex(-1);
                          }}
                          onMouseEnter={() => setHighlightedIndex(index)}
                          className={cn(
                            "w-full px-3 py-3 text-left text-white text-fm-md",
                            "hover:bg-[#141414] transition-colors",
                            "first:rounded-t-xl last:rounded-b-xl",
                            highlightedIndex === index && "bg-[#141414]",
                            styleId === style.id && "bg-[#141414]"
                          )}
                        >
                          {style.name}
                        </button>
                      ))
                    )}
                  </div>
                )}
              </div>
            </div>
            <div className="bg-fm-neutral-0! font-fm-poppins p-4! rounded-xl">
              <TextArea
                id="script-text"
                showCharCount
                minHeight={196}
                maxHeight={196}
                maxLength={10000}
                placeholder="Once upon a time, in a world where..."
                value={scriptText}
                autoGrow
                onChange={(e) => setScriptText(e.target.value)}
                classes={{
                  textarea: "border-0 bg-fm-neutral-0! p-0! font-fm-poppins",
                  charCount: "font-fm-poppins text-fm-primary/50",
                }}
              />
            </div>

            <div className="mt-3">
              <div className="flex items-center justify-between mb-2">
                <p className="text-fm-md font-fm-poppins text-fm-neutral-1100/80">
                  Character Description
                </p>
                <button
                  type="button"
                  onClick={() => setIsCreateCharacterModalOpen(true)}
                  className="flex items-center gap-1.5 text-[#AB79FF] transition-colors font-fm-poppins text-fm-md"
                >
                  <PlusIcon />
                  Create Character Description Sheet
                </button>
              </div>
              <div
                {...getRootProps()}
                className={cn(
                  "border-2 border-dashed bg-fm-neutral-0 rounded-fm-xl px-8 py-2 text-center cursor-pointer transition-all",
                  isDragActive
                    ? "border-fm-neutral-800"
                    : "border-fm-neutral-500",
                  selectedFile && "border-fm-primary bg-fm-neutral-0",
                  loading && "cursor-wait pointer-events-none"
                )}
              >
                <input {...getInputProps()} />

                {selectedFile ? (
                  <div className="space-y-7 py-3">
                    <p className="text-sm">{selectedFile.name}</p>
                    <Button
                      variant="outline"
                      size="sm"
                      noise="none"
                      onClick={(e) => {
                        e.stopPropagation();
                        handleRemoveFile();
                      }}
                    >
                      Remove file
                    </Button>
                  </div>
                ) : (
                  <div className="space-y-4 p-4">
                    <p className="text-fm-base max-w-sm mx-auto">
                      Drag and drop your character description sheet here or
                      click to select
                    </p>
                    <p className="text-fm-sm text-fm-neutral-1100/80">
                      Only .CSV files are accepted
                    </p>
                  </div>
                )}
              </div>
            </div>
          </div>
          <div className="flex justify-center mt-4">
            <Button
              isDisabled={disableGenerateAnime}
              variant="outline"
              noise="none"
              className="font-fm-poppins rounded-sm"
              onClick={onGenerate}
              innerClassName={cn(
                "border-none bg-[#833AFF] rounded-lg font-fm-poppins text-fm-lg text-white",
                disableGenerateAnime && "bg-fm-neutral-100"
              )}
            >
              <span className="border-none">Generate Anime</span>
            </Button>
          </div>
        </section>
        <section className="flex-1 mt-8 pl-14">
          <Image
            src="/images/home-banner.webp"
            alt="Home banner"
            height={420}
            width={470}
          />
          <UserStories stories={stories} />
        </section>
      </div>
      <CreateArtStyleModal
        isOpen={isCreateModalOpen}
        onClose={async () => {
          setIsCreateModalOpen(false);
          await handleRefetchAndSelectFirst();
        }}
        selectedStyleName={selectedStyle?.name || ""}
        selectedStylePrompt={selectedStyle?.prompt || ""}
        onSuccess={async (createdStyleId: number) => {
          // Set pending style ID first
          setPendingStyleId(createdStyleId);
          // Refetch styles and select first (if pending style doesn't exist)
          await handleRefetchAndSelectFirst();
          // The useEffect will handle setting the styleId when the style appears in options
        }}
        userId={7}
        accessToken="c7eb5f9a-e958-4a47-85fe-0b2674a946eb"
      />
      <CreateCharacterDescriptionModal
        isOpen={isCreateCharacterModalOpen}
        onClose={() => setIsCreateCharacterModalOpen(false)}
        selectedStyle={selectedStyle || null}
        onSheetCreated={(spreadsheetUrl, taskId) => {
          setCharacterSheetUrl(spreadsheetUrl, taskId);
          setIsCreateCharacterModalOpen(false);
        }}
      />
    </div>
  );
}

export default function UserUploads() {
  return (
    <PollingProvider>
      <UserUploadsContent />
    </PollingProvider>
  );
}
