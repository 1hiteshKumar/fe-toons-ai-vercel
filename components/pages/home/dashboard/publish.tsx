"use client";

import { ShotAssets } from "@/lib/types";
import { Button } from "@/aural/components/ui/button";
import { useState } from "react";
import Loading from "@/components/loading";
import { DownloadIcon } from "@/aural/icons/download-icon";
import { CopyIcon } from "@/aural/icons/copy-icon";
import { AiAvatarIcon } from "@/aural/icons/ai-avatar-icon";

export default function Publish({ data }: { data: ShotAssets | null }) {
  const [copied, setCopied] = useState(false);

  if (!data) {
    return <Loading text="publish page" />;
  }

  const videoUrl = data?.task?.output_video_url_single_image || null;
  const showName = data?.task?.props?.show_name || "Your Story";
  const hasVideo = !!videoUrl;

  const handleDownload = () => {
    if (!videoUrl) return;

    const link = document.createElement("a");
    link.href = videoUrl;

    link.download = "video.mp4";

    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  const handleCopyLink = async () => {
    if (!videoUrl) return;
    if (typeof window !== "undefined") {
      try {
        await navigator.clipboard.writeText(videoUrl);
        setCopied(true);
        setTimeout(() => setCopied(false), 2000);
      } catch (err) {
        console.error("Failed to copy link:", err);
      }
    }
  };

  return (
    <div className="flex flex-col items-center justify-center min-h-[calc(100vh-200px)] ">
      <div className="max-w-5xl w-full space-y-12">
        {/* Header Section */}
        <div className="text-center space-y-4 animate-fadeIn">
          <div className="flex items-center justify-center gap-4 mb-2">
            <div className="relative">
              <div className="absolute inset-0 bg-fm-primary-500/20 blur-2xl rounded-full" />
              <div className="relative">
                <AiAvatarIcon />
              </div>
            </div>
            <h1 className="text-4xl md:text-6xl font-bold bg-linear-to-r from-fm-primary-500 to-fm-secondary-500 bg-clip-text text-transparent">
              Your Story is {!videoUrl && "Almost"} Complete!
            </h1>
          </div>
          <p className="text-xl md:text-2xl text-fm-secondary-700 font-light">
            &quot;{showName}&quot; is {!videoUrl && "getting"} ready to share
            with the world
          </p>
        </div>

        {/* Video Container */}
        <div
          className="flex justify-center animate-fadeIn"
          style={{ animationDelay: "0.1s" }}
        >
          {videoUrl ? (
            <div className="relative w-full max-w-xl group">
              <div className="absolute -inset-1 bg-linear-to-r from-fm-primary-500/50 via-fm-secondary-500/50 to-fm-primary-500/50 rounded-2xl blur-lg opacity-75 group-hover:opacity-100 transition-opacity duration-300" />
              <div className="relative bg-fm-surface-secondary rounded-2xl p-2 overflow-hidden">
                <video
                  src={videoUrl}
                  className="w-full h-auto max-h-[420px] rounded-xl shadow-2xl"
                  controls
                  muted
                  playsInline
                />
              </div>
            </div>
          ) : (
            <div className="relative">
              <div className="absolute inset-0 bg-fm-primary-500/20 blur-3xl rounded-full" />
              <div className="relative w-40 h-40 bg-linear-to-br from-fm-primary-500 to-fm-primary-700 rounded-full flex items-center justify-center shadow-2xl border-4 border-fm-primary-300">
                <span className="text-7xl font-bold text-white">!</span>
              </div>
            </div>
          )}
        </div>

        {/* Status Message */}
        {!hasVideo && (
          <div
            className="text-center space-y-2 animate-fadeIn"
            style={{ animationDelay: "0.2s" }}
          >
            <h2 className="text-2xl md:text-3xl font-semibold text-fm-primary-500">
              Video Not Available
            </h2>
            <p className="text-fm-neutral-300 text-sm max-w-xl mx-auto">
              The final video is still being processed or is not available.
            </p>
          </div>
        )}

        {/* Action Buttons */}
        <div
          className="flex flex-col sm:flex-row gap-4 justify-center items-center animate-fadeIn"
          style={{ animationDelay: "0.3s" }}
        >
          <Button
            onClick={handleDownload}
            variant="primary"
            isDisabled={!hasVideo}
            className="min-w-[200px]"
          >
            <DownloadIcon className="size-5" />
            Download Video
          </Button>

          <Button
            onClick={handleCopyLink}
            variant="secondary"
            className="min-w-[200px]"
            isDisabled={!hasVideo}
          >
            <CopyIcon className="size-5" />
            {copied ? "Link Copied!" : "Copy Share Link"}
          </Button>
        </div>
      </div>
    </div>
  );
}
