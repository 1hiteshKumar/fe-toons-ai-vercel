"use client";

import { Button } from "@/aural/components/ui/button";
import TextArea from "@/aural/components/ui/textarea";
import { PollingProvider } from "@/lib/hooks/use-polling";
import useUserUploads from "@/lib/hooks/use-user-uploads";
import UserStories from "./user-stories";
import { cn } from "@/aural/lib/utils";

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
  } = useUserUploads();

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

        <TextArea
          id="script-text"
          minHeight={200}
          maxLength={2000}
          placeholder="Once upon a time, in a world where..."
          value={scriptText}
          onChange={(e) => setScriptText(e.target.value)}
        />

        <span className="flex justify-end text-fm-neutral-400 text-fm-sm mt-2">
          {scriptText.length}/2000
        </span>

        <div className="mt-2">
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
            isDisabled={!(scriptText && selectedFile) || loading}
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
