"use client";

import { useState, useCallback, useEffect } from "react";
import { useDropzone } from "react-dropzone";
import { Button } from "@/aural/components/ui/button";
import Input from "@/aural/components/ui/input";
import TextArea from "@/aural/components/ui/textarea";
import { cn } from "@/aural/lib/utils";
import { CrossCircleIcon } from "@/aural/icons/cross-circle-icon";
import { toast } from "sonner";

type CreateArtStyleModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedStyleName?: string;
  onSuccess?: (createdStyleId: number) => void;
  userId?: number;
  accessToken?: string;
};

export default function CreateArtStyleModal({
  isOpen,
  onClose,
  selectedStyleName = "",
  onSuccess,
  userId = 7,
  accessToken = "c7eb5f9a-e958-4a47-85fe-0b2674a946eb",
}: CreateArtStyleModalProps) {
  const [styleName, setStyleName] = useState(selectedStyleName);
  const [styleDescription, setStyleDescription] = useState("");
  const [uploadedFiles, setUploadedFiles] = useState<File[]>([]);
  const [isSubmitting, setIsSubmitting] = useState(false);

  // Update style name when selectedStyleName changes
  useEffect(() => {
    if (selectedStyleName) {
      setStyleName(selectedStyleName);
    }
  }, [selectedStyleName]);

  const onDrop = useCallback(
    (acceptedFiles: File[], rejectedFiles: unknown[]) => {
      // Filter only PNG files
      const pngFiles = acceptedFiles.filter(
        (file) =>
          file.type === "image/png" || file.name.toLowerCase().endsWith(".png")
      );

      // Check file size (1.5MB = 1572864 bytes)
      const validFiles: File[] = [];
      const invalidFiles: string[] = [];

      pngFiles.forEach((file) => {
        if (file.size <= 1572864) {
          validFiles.push(file);
        } else {
          invalidFiles.push(file.name);
        }
      });

      // Check total count (max 9 files)
      const currentCount = uploadedFiles.length;
      const remainingSlots = 9 - currentCount;
      const filesToAdd = validFiles.slice(0, remainingSlots);

      if (filesToAdd.length < validFiles.length) {
        toast.error(
          `Only ${remainingSlots} more file(s) can be uploaded. Maximum 9 files allowed.`
        );
      }

      if (invalidFiles.length > 0) {
        toast.error(
          `The following files exceed 1.5MB limit: ${invalidFiles.join(", ")}`
        );
      }

      if (rejectedFiles.length > 0) {
        toast.error("Only .png files are accepted");
      }

      setUploadedFiles((prev) => [...prev, ...filesToAdd]);
    },
    [uploadedFiles]
  );

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "image/png": [".png"],
    },
    multiple: true,
    maxFiles: 9,
  });

  const handleRemoveFile = (index: number) => {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index));
  };

  const handleSubmit = async () => {
    if (!styleName.trim()) {
      toast.error("Please enter a style name");
      return;
    }

    if (!styleDescription.trim()) {
      toast.error("Please enter a style description");
      return;
    }

    if (uploadedFiles.length === 0) {
      toast.error("Please upload at least one reference image");
      return;
    }

    setIsSubmitting(true);
    try {
      // Create FormData
      const formData = new FormData();
      formData.append("name", styleName.trim());
      formData.append("prompt", styleDescription.trim());
      formData.append("is_public", "true");

      // Add background (first file)
      if (uploadedFiles.length > 0) {
        formData.append("background", uploadedFiles[0]);
      }

      // Add all files as characters
      uploadedFiles.forEach((file) => {
        formData.append("characters", file);
      });

      // Make API call
      const response = await fetch(
        "https://api.blaze.pockettoons.com/api/styles/e2e-styles/",
        {
          method: "POST",
          headers: {
            "access-token": accessToken,
            uid: userId.toString(),
          },
          body: formData,
        }
      );

      if (!response.ok) {
        const errorData = await response.json().catch(() => ({}));
        throw new Error(errorData.message || "Failed to create art style");
      }

      const result = await response.json();
      const createdStyleId = result?.id || result?.data?.id;

      toast.success("Your art style has been created");

      // Reset form
      setStyleName("");
      setStyleDescription("");
      setUploadedFiles([]);

      // Close modal
      onClose();

      // Call success callback with created style ID
      if (onSuccess && createdStyleId) {
        onSuccess(createdStyleId);
      }
    } catch (error) {
      toast.error("Failed to create art style. Please try again.");
      console.error("Error creating art style:", error);
    } finally {
      setIsSubmitting(false);
    }
  };

  // Reset form when modal closes
  useEffect(() => {
    if (!isOpen) {
      setStyleName(selectedStyleName || "");
      setStyleDescription("");
      setUploadedFiles([]);
    }
  }, [isOpen, selectedStyleName]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-2xl mx-4 bg-[#1A1A1A] rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto"
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
          <h2 className="text-2xl font-bold text-white mb-2">
            Create your art style
          </h2>
          <p className="text-[#E0E0E0] text-sm">
            Create a style that reflects your imagination
          </p>
        </div>

        {/* Form */}
        <div className="space-y-6">
          {/* Style Name */}
          <div>
            <label
              htmlFor="style-name"
              className="block text-sm font-medium text-white mb-2"
            >
              Style Name
            </label>
            <Input
              id="style-name"
              value={styleName}
              onChange={(e) => setStyleName(e.target.value)}
              placeholder="Enter style name"
              decoration="outline"
              fullWidth
              classes={{
                input:
                  "bg-black text-white rounded-lg border-0 placeholder:text-white/70",
              }}
            />
          </div>

          {/* Style Description */}
          <div>
            <label
              htmlFor="style-description"
              className="block text-sm font-medium text-white mb-2"
            >
              Style Description
            </label>
            <TextArea
              id="style-description"
              value={styleDescription}
              onChange={(e) => setStyleDescription(e.target.value)}
              placeholder="Enter style description"
              minHeight={100}
              autoGrow
              classes={{
                textarea:
                  "bg-black text-white rounded-lg border-0 placeholder:text-white/70",
              }}
            />
          </div>

          {/* Upload Reference Images */}
          <div>
            <label className="block text-sm font-medium text-white mb-2">
              Upload Reference Images
            </label>
            <div
              {...getRootProps()}
              className={cn(
                "border border-dotted rounded-lg p-8 text-center cursor-pointer transition-all",
                isDragActive
                  ? "border-[#9B59B6] bg-black/50"
                  : "border-[#A0A0A0] bg-black hover:border-[#B0B0B0]"
              )}
            >
              <input {...getInputProps()} />
              <div className="space-y-2">
                <p className="text-[#A0A0A0] font-medium">
                  Drag and drop reference style images or click to upload
                </p>
                <p className="text-xs text-[#C0C0C0]">
                  Upto 9 images. 1.5mb per file. Only .png files accepted
                </p>
              </div>
            </div>

            {/* Uploaded Files Preview */}
            {uploadedFiles.length > 0 && (
              <div className="mt-4 grid grid-cols-3 gap-4">
                {uploadedFiles.map((file, index) => (
                  <div
                    key={index}
                    className="relative group rounded-lg overflow-hidden border border-[#333333]"
                  >
                    <img
                      src={URL.createObjectURL(file)}
                      alt={`Preview ${index + 1}`}
                      className="w-full h-32 object-cover"
                    />
                    <button
                      onClick={() => handleRemoveFile(index)}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity"
                      aria-label="Remove file"
                    >
                      <CrossCircleIcon className="size-4" />
                    </button>
                    <p className="text-xs text-[#A0A0A0] p-2 truncate bg-black">
                      {file.name}
                    </p>
                  </div>
                ))}
              </div>
            )}
          </div>

          {/* Submit Button */}
          <div className="flex justify-center pt-4">
            <Button
              onClick={handleSubmit}
              disabled={isSubmitting}
              variant="outline"
              noise="none"
              className="w-full bg-[#9B59B6] text-white border-none hover:bg-[#8E44AD] disabled:opacity-50 disabled:cursor-not-allowed rounded-lg flex items-center justify-center gap-2"
            >
              {isSubmitting && (
                <svg
                  className="animate-spin h-5 w-5 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
              )}
              {isSubmitting ? "Creating..." : "Create Style"}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
