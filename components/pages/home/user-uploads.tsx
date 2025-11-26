"use client";

import { Button } from "@/aural/components/ui/button";
import TextArea from "@/aural/components/ui/textarea";
import Input from "@/aural/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuRadioGroup,
  DropdownMenuRadioItem,
  DropdownMenuTrigger,
  useOpenState,
} from "@/aural/components/ui/dropdown";
import { PollingProvider } from "@/lib/hooks/use-polling";
import useUserUploads from "@/lib/hooks/use-user-uploads";
import UserStories from "./user-stories";
import { cn } from "@/aural/lib/utils";
import { ChevronRightIcon } from "@/aural/icons/chevron-right-icon";
import Image from "next/image";

const STYLE_OPTIONS = [
  {
    name: "The Duke's Masked Bride - Flux",
    code: 87,
  },
  {
    name: "Rekindled Heartache - Flux",
    code: 116,
  },
];

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
  } = useUserUploads();

  const { open: isStyleDropdownOpen, onOpenChange: setStyleDropdownOpen } =
    useOpenState();

  const selectedStyle = STYLE_OPTIONS.find((style) => style.code === styleId);

  return (
    <div className="w-full min-h-screen pb-8">
      {/* Logo at top center */}
      <div className="flex justify-center items-center py-8 mb-8">
        <Image
          src="/images/toons.png"
          alt="Pocket Toons Logo"
          width={200}
          height={60}
          className="h-auto w-auto max-w-[200px]"
          priority
        />
      </div>

      {/* Main content: Two column layout */}
      <div className="container mx-auto px-4 lg:px-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 lg:gap-12 max-w-7xl mx-auto">
          {/* Left Column: Story Creation Form */}
          <div className="w-full">
            <div className="space-y-6">
              <div>
                <h1 className="text-2xl font-bold mb-3 text-white">
                  Tell your story
                </h1>
                <p className="text-fm-md text-[#FFFFFFCC] leading-relaxed">
                  Share your imagination and watch it transform into an anime.
                  Every great story starts with a single idea!
                </p>
              </div>

              <div className="space-y-2 flex gap-4 items-baseline">
                <div>
                  <Input
                    id="show-name"
                    label="Show Name"
                    placeholder="Enter show name"
                    value={showName}
                    onChange={(e) => setShowName(e.target.value)}
                    decoration="outline"
                    fullWidth
                    className="[&_input]:bg-black [&_input]:border-none [&_input]:rounded-[12px] [&_input]:text-white [&_input]:placeholder:text-fm-neutral-500 [&_input]:focus:outline-none [&_input]:focus:ring-0"
                    classes={{
                      label:
                        "text-[#FFFFFFCC] font-fm-poppins text-sm normal-case mb-1",
                    }}
                  />
                </div>

                <div className="w-full">
                  <label className="text-fm-sm font-fm-medium block mb-1 text-[#FFFFFFCC]">
                    Style
                  </label>
                  <DropdownMenu
                    open={isStyleDropdownOpen}
                    onOpenChange={setStyleDropdownOpen}
                  >
                    <DropdownMenuTrigger asChild>
                      <button
                        type="button"
                        className={cn(
                          "w-full h-12 px-3 py-4 rounded-[12px]",
                          "text-white font-fm-text leading-fm-md text-fm-md",
                          "bg-black border-none",
                          "focus:outline-none focus:ring-0",
                          "transition-all duration-200",
                          "flex items-center justify-between"
                        )}
                      >
                        <span
                          className={cn(
                            !selectedStyle && "text-fm-neutral-500",
                            selectedStyle && "text-white"
                          )}
                        >
                          {selectedStyle?.name || "Select a style"}
                        </span>
                        <ChevronRightIcon
                          className={cn(
                            "size-5 text-white transition-transform border border-white rounded-[100%] ",
                            isStyleDropdownOpen && "rotate-90"
                          )}
                        />
                      </button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent
                      align="start"
                      className="w-(--radix-dropdown-menu-trigger-width) bg-black rounded-[12px] border-none shadow-lg"
                      classes={{
                        root: "bg-black rounded-[12px] border-none",
                        border: "hidden",
                      }}
                    >
                      <DropdownMenuRadioGroup
                        value={styleId?.toString()}
                        onValueChange={(value) => {
                          setStyleId(value ? parseInt(value, 10) : null);
                          setStyleDropdownOpen(false);
                        }}
                      >
                        {STYLE_OPTIONS.map((style) => (
                          <DropdownMenuRadioItem
                            key={style.code}
                            value={style.code.toString()}
                            className="text-white hover:bg-fm-neutral-200/10 focus:bg-fm-neutral-200/10"
                          >
                            {style.name}
                          </DropdownMenuRadioItem>
                        ))}
                      </DropdownMenuRadioGroup>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </div>

              <div>
                <TextArea
                  id="script-text"
                  minHeight={200}
                  maxLength={2000}
                  placeholder="Once upon a time, in a world where..."
                  value={scriptText}
                  onChange={(e) => setScriptText(e.target.value)}
                  decoration="outline"
                  className="[&_textarea]:bg-black [&_textarea]:rounded-[12px]  [&_textarea]:p-4 [&_textarea]:border-none [&_textarea]:text-white [&_textarea]:placeholder:text-fm-neutral-500 "
                />
              </div>

              {/* <span className="flex justify-end text-fm-neutral-400 text-fm-sm">
                {scriptText.length}/2000
              </span> */}

              <div>
                <span className="text-fm-md font-fm-medium block mb-2 text-[#FFFFFFCC]">
                  Character Description
                </span>
                <div
                  {...getRootProps()}
                  className={cn(
                    "border border-dashed rounded-lg p-8 text-center cursor-pointer transition-all bg-black!",
                    "border-fm-neutral-500 bg-transparent",
                    isDragActive && "border-fm-neutral-400 bg-black",
                    selectedFile && "border-fm-primary bg-black",
                    loading && "cursor-wait pointer-events-none opacity-50"
                  )}
                >
                  <input {...getInputProps()} />

                  {selectedFile ? (
                    <div className="space-y-4">
                      <p className="text-sm text-white">{selectedFile.name}</p>
                      <Button
                        variant="text"
                        size="sm"
                        onClick={(e) => {
                          e.stopPropagation();
                          handleRemoveFile();
                        }}
                      >
                        Remove file
                      </Button>
                    </div>
                  ) : (
                    <div className="space-y-2">
                      <p className="text-fm-md text-white">
                        Drag and drop your character description sheet here or
                        click to select
                      </p>
                      <p className="text-fm-sm text-[#FFFFFFCC]">
                        Only .csv files are supported
                      </p>
                    </div>
                  )}
                </div>
              </div>

              <div className="flex justify-center pt-2">
                <Button
                  isDisabled={
                    !(scriptText && selectedFile && showName && styleId) ||
                    loading
                  }
                  onClick={onGenerate}
                  className="min-w-44"
                  variant="outline"
                  noise="none"
                  innerClassName="border-none bg-[#833AFF] rounded-lg font-fm-poppins text-fm-lg text-white"
                >
                  Generate Anime
                </Button>
              </div>
            </div>
          </div>

          {/* Right Column: Character Illustration + Stories */}
          <div className="w-full flex flex-col gap-8">
            {/* Character Illustration */}
            <div className="w-full flex justify-center items-center lg:justify-end">
              <div className="relative w-full max-w-md lg:max-w-lg">
                <Image
                  src="/images/characters.webp"
                  alt="Anime Characters"
                  width={500}
                  height={600}
                  className="w-full h-auto object-contain"
                  priority
                />
              </div>
            </div>

            {/* Your Stories Section */}
            <div className="w-full">
              <UserStories stories={stories} />
            </div>
          </div>
        </div>
      </div>
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
