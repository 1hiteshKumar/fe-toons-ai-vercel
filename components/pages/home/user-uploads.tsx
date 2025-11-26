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
    <div className="w-full">
      <div className="mx-auto max-w-4xl shadow-fm-button-shadow-secondary rounded-fm-3xl border p-10 bg-fm-secondary-50 shadow-xl">
        <h1 className="text-center text-fm-4xl font-fm-extrabold mb-4">
          Tell Your Story
        </h1>
        <p className="text-center max-w-xl mx-auto mb-10">
          Share your imagination and watch it transform into an animated
          masterpiece. Every great story starts with a single idea.
        </p>

        <div className="space-y-4 flex items-center gap-4">
          <Input
            id="show-name"
            label="Show Name"
            placeholder="Enter show name"
            value={showName}
            onChange={(e) => setShowName(e.target.value)}
            decoration="outline"
            fullWidth
          />

          <div className="w-full mb-4.5">
            <label className="text-fm-sm font-fm-medium block">Style</label>
            <DropdownMenu
              open={isStyleDropdownOpen}
              onOpenChange={setStyleDropdownOpen}
            >
              <DropdownMenuTrigger asChild>
                <button
                  type="button"
                  className={cn(
                    "w-full h-12 px-3 py-4 rounded-fm-s border",
                    "text-fm-primary font-fm-text leading-fm-md text-fm-md",
                    "border-fm-divider-primary focus:border-fm-divider-contrast",
                    "focus:outline-none transition-all duration-200",
                    "flex items-center justify-between",
                    "hover:border-fm-divider-contrast"
                  )}
                >
                  <span className={cn(!selectedStyle && "text-fm-placeholder")}>
                    {selectedStyle?.name || "Select a style"}
                  </span>
                  <ChevronRightIcon
                    className={cn(
                      "size-4 text-fm-icon-active transition-transform",
                      isStyleDropdownOpen && "rotate-90"
                    )}
                  />
                </button>
              </DropdownMenuTrigger>
              <DropdownMenuContent
                align="start"
                className="w-(--radix-dropdown-menu-trigger-width)"
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
                    >
                      {style.name}
                    </DropdownMenuRadioItem>
                  ))}
                </DropdownMenuRadioGroup>
              </DropdownMenuContent>
            </DropdownMenu>
          </div>
        </div>

        <TextArea
          id="script-text"
          label="Enter story"
          minHeight={200}
          maxLength={2000}
          placeholder="Once upon a time, in a world where..."
          value={scriptText}
          onChange={(e) => setScriptText(e.target.value)}
          className="mt-4"
        />

        <span className="flex justify-end text-fm-neutral-400 text-fm-sm mt-2">
          {scriptText.length}/2000
        </span>

        <div>
          <span className="text-xs font-fm-brand " >Character Description</span>
          <div
            {...getRootProps()}
            className={cn(
              "border-2 border-dashed rounded-fm-lg p-8 text-center cursor-pointer transition-all",
              isDragActive ? "border-fm-neutral-800" : "border-fm-neutral-500",
              selectedFile && "border-fm-primary bg-fm-neutral-100",
              loading && "cursor-wait pointer-events-none"
            )}
          >
            <input {...getInputProps()} />

            {selectedFile ? (
              <div className="space-y-2">
                <p className="text-sm">{selectedFile.name}</p>
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
                <p className="text-fm-base text-fm-neutral-600">
                  Drag and drop a CSV file here, or click to select
                </p>
                <p className="text-fm-sm text-fm-neutral-400">
                  Only CSV files are accepted
                </p>
              </div>
            )}
          </div>
        </div>

        <div className="flex justify-end mt-4">
          <Button
            isDisabled={
              !(scriptText && selectedFile && showName && styleId) || loading
            }
            onClick={onGenerate}
          >
            Generate
          </Button>
        </div>

        <p className="text-center text-fm-neutral-400 text-fm-sm">
          Your story will be transformed into an animated experience
        </p>
      </div>
      <UserStories stories={stories} />
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
