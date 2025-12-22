import { PanelItem, ShotAssets, ShotGrouped } from "./types";

export function convertGoogleDriveUrl(url: string): string {
  if (!url || typeof url !== "string") return url;

  let fileId = "";

  const fileIdMatch = url.match(/\/file\/d\/([a-zA-Z0-9_-]+)/);
  if (fileIdMatch?.[1]) {
    fileId = fileIdMatch[1];
  }

  const openIdMatch = url.match(/[?&]id=([a-zA-Z0-9_-]+)/);
  if (openIdMatch?.[1]) {
    fileId = openIdMatch[1];
  }

  if (!fileId) return url;

  return `https://lh3.googleusercontent.com/d/${fileId}`;
}

export const getGroupedShots = (data: ShotAssets | null): ShotGrouped[] => {
  if (!data) return [];

  const grouped = data.results.reduce(
    (acc: Record<string, PanelItem[]>, shot) => {
      const key = shot.panel_data.scene_beat_id;
      if (!acc[key]) acc[key] = [];
      acc[key].push(shot);
      return acc;
    },
    {}
  );

  return Object.entries(grouped).map(([scene_beat_id, shots]) => ({
    scene_beat_id,
    shots,
  }));
};

/**
 * Checks if shot videos are available and in sequence
 * Sequence means: scene 1 -> shot 1, then shot 2, etc.
 * Returns true only if videos are in proper sequence (no gaps, starting from shot 1)
 * Won't return true if shot 2 is ready but shot 1 is not
 */
export const areShotVideosInSequence = (data: ShotAssets | null): boolean => {
  if (!data || !data.results || data.results.length === 0) {
    return false;
  }

  const groupedShots = getGroupedShots(data);

  // Sort scenes by scene_beat_id to ensure proper order
  const sortedScenes = [...groupedShots].sort((a, b) => {
    const sceneA = parseInt(a.scene_beat_id) || 0;
    const sceneB = parseInt(b.scene_beat_id) || 0;
    return sceneA - sceneB;
  });

  // We must start from scene 1 (first scene)
  // Check if the first scene has videos starting from shot 1
  if (sortedScenes.length === 0) {
    return false;
  }

  const firstScene = sortedScenes[0];
  const firstSceneShots = firstScene.shots;

  // Sort shots by panel_number to ensure proper order
  const sortedFirstSceneShots = [...firstSceneShots].sort(
    (a, b) => a.panel_number - b.panel_number
  );

  if (sortedFirstSceneShots.length === 0) {
    return false; // No shots in first scene
  }

  // Check if we have shot videos in sequence for the first scene
  // We must have shot 1 first, then shot 2, etc. (no gaps)
  let foundFirstVideo = false;
  let lastVideoIndex = -1;

  for (
    let shotIndex = 0;
    shotIndex < sortedFirstSceneShots.length;
    shotIndex++
  ) {
    const shot = sortedFirstSceneShots[shotIndex];
    const hasVideo = !!shot.single_image_video_url;

    if (hasVideo) {
      if (!foundFirstVideo) {
        // This is the first video we found
        // It must be shot 1 (index 0), otherwise sequence is broken
        if (shotIndex !== 0) {
          return false; // Found video but not starting from shot 1
        }
        foundFirstVideo = true;
        lastVideoIndex = shotIndex;
      } else {
        // We've already found videos, check if this is consecutive
        if (shotIndex !== lastVideoIndex + 1) {
          return false; // Gap detected - we have shot N but missing shot N-1
        }
        lastVideoIndex = shotIndex;
      }
    } else {
      // No video for this shot
      // If we've already found videos, this is okay (we just stop here)
      // But if we haven't found the first video yet, continue checking
      if (foundFirstVideo) {
        // We've found videos before, but this one is missing
        // This is acceptable - we just have videos up to this point
        break;
      }
      // If we haven't found any videos yet, continue to next shot
    }
  }

  // Return true only if we found at least one video in the first scene starting from shot 1
  return foundFirstVideo;
};

/**
 * Gets sequential shot video URLs across all scenes for sequential playback
 * Returns an array of video URLs in order: scene 1 → shot 1, shot 2 … → scene 2 → shot 1 …
 *
 * Features:
 * - Plays videos sequentially across all scenes
 * - Skips missing or out-of-order shots but continues with next shot
 * - Skips scenes with no valid shots
 * - Stops returning videos if finalVideoUrl exists or isGenerating is false
 * - Reactive to polling updates (uses latest data object)
 * - Converts URLs using convertGoogleDriveUrl()
 *
 * Returns empty array if:
 * - Final video URL is present
 * - Not generating
 * - No data
 */
export const getSequentialShotVideoUrls = (
  data: ShotAssets | null,
  finalVideoUrl: string | null,
  isGenerating: boolean
): string[] => {
  // Stop returning videos if final video exists or generation is complete
  if (finalVideoUrl || !isGenerating || !data || !data.results) {
    return [];
  }

  // Group shots by scene_beat_id
  const groupedShots = getGroupedShots(data);

  if (groupedShots.length === 0) {
    return [];
  }

  // Sort scenes by scene_beat_id to ensure proper order
  const sortedScenes = [...groupedShots].sort((a, b) => {
    const sceneA = parseInt(a.scene_beat_id) || 0;
    const sceneB = parseInt(b.scene_beat_id) || 0;
    return sceneA - sceneB;
  });

  // Process all scenes sequentially and collect video URLs using flatMap
  return sortedScenes.flatMap((scene) => {
    // Sort shots within each scene by panel_number to ensure proper order
    const sortedShots = [...scene.shots].sort(
      (a, b) => a.panel_number - b.panel_number
    );

    // Collect valid video URLs from this scene, skipping missing ones
    // If a scene has no valid shots, flatMap will return an empty array (scene is skipped)
    return sortedShots
      .filter((shot) => shot.single_image_video_url) // Skip shots without video URLs
      .map((shot) => convertGoogleDriveUrl(shot.single_image_video_url));
  });
};

export function getIdFromGoogleDoc(url: string) {
  if (!url) return "URL NOT FOUND";

  // 1️⃣ Google Docs URL pattern
  if (url.includes("/d/")) {
    const parts = url.split("/d/");
    if (parts.length < 2) {
      throw new Error("Not a valid Google Docs URL");
    }
    const id = parts[1].split("/")[0];
    return id;
  }

  // 2️⃣ Cloudfront or general file URL pattern (take last path segment without extension)
  try {
    const filename = url.substring(url.lastIndexOf("/") + 1); // get last part
    const id = filename.replace(/\.[^/.]+$/, ""); // remove extension if any
    return id;
  } catch {
    throw new Error("Cannot extract ID from URL");
  }
}

/**
 * Escape CSV values (handle commas, quotes, newlines)
 */
function escapeCsvValue(value: string): string {
  if (value === null || value === undefined || value === "") return "null";
  const stringValue = String(value);
  // If value contains comma, quote, or newline, wrap in quotes and escape quotes
  if (stringValue.includes(",") || stringValue.includes('"') || stringValue.includes("\n")) {
    return `"${stringValue.replace(/"/g, '""')}"`;
  }
  return stringValue;
}

/**
 * Generate CSV content for shot videos
 */
export function generateShotVideosCSV(data: ShotAssets): string {
  if (!data || !data.results || !Array.isArray(data.results)) {
    throw new Error("Invalid data format");
  }

  // Sort results by panel_number to ensure proper order
  const sortedResults = [...data.results].sort(
    (a, b) => a.panel_number - b.panel_number
  );

  // CSV Headers
  const headers = [
    "panel_number",
    "panel_data",
    "start frame",
    "end frame",
    "single image video",
    "start end video",
    "panel_prompt_data",
    "audio_url",
  ];

  // Generate CSV rows
  const rows = sortedResults.map((shot) => {
    const panelData = shot.panel_data ? JSON.stringify(shot.panel_data) : "null";
    const panelPromptData = shot.panel_prompt_data ? JSON.stringify(shot.panel_prompt_data) : "null";

    return [
      shot.panel_number?.toString() || "null",
      panelData,
      shot.start_frame_url || "null",
      shot.end_frame_url || "null",
      shot.single_image_video_url || "null",
      shot.start_end_video_url || "null",
      panelPromptData,
      shot.audio_url || "null",
    ];
  });

  // Build CSV content
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map(escapeCsvValue).join(",")),
  ].join("\n");

  return csvContent;
}

/**
 * Generate CSV content for shot images
 */
export function generateShotImagesCSV(data: ShotAssets): string {
  if (!data || !data.results || !Array.isArray(data.results)) {
    throw new Error("Invalid data format");
  }

  // Sort results by panel_number to ensure proper order
  const sortedResults = [...data.results].sort(
    (a, b) => a.panel_number - b.panel_number
  );

  // CSV Headers
  const headers = [
    "panel_number",
    "panel_data",
    "start frame",
    "end frame",
    "audio_url",
  ];

  // Generate CSV rows
  const rows = sortedResults.map((shot) => {
    const panelData = shot.panel_data ? JSON.stringify(shot.panel_data) : "null";

    return [
      shot.panel_number?.toString() || "null",
      panelData,
      shot.start_frame_url || "null",
      shot.end_frame_url || "null",
      shot.audio_url || "null",
    ];
  });

  // Build CSV content
  const csvContent = [
    headers.join(","),
    ...rows.map((row) => row.map(escapeCsvValue).join(",")),
  ].join("\n");

  return csvContent;
}

/**
 * Download CSV file from CSV content string
 */
export function downloadCSV(csvContent: string, filename: string): void {
  const blob = new Blob([csvContent], { type: "text/csv" });
  const url = window.URL.createObjectURL(blob);
  const a = document.createElement("a");
  a.href = url;
  a.download = filename;
  document.body.appendChild(a);
  a.click();
  window.URL.revokeObjectURL(url);
  document.body.removeChild(a);
}
