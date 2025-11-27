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

  const grouped = data.results.reduce((acc: Record<string, PanelItem[]>, shot) => {
    const key = shot.panel_data.scene_beat_id;
    if (!acc[key]) acc[key] = [];
    acc[key].push(shot);
    return acc;
  }, {});

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
  const sortedFirstSceneShots = [...firstSceneShots].sort((a, b) => a.panel_number - b.panel_number);
  
  if (sortedFirstSceneShots.length === 0) {
    return false; // No shots in first scene
  }
  
  // Check if we have shot videos in sequence for the first scene
  // We must have shot 1 first, then shot 2, etc. (no gaps)
  let foundFirstVideo = false;
  let lastVideoIndex = -1;
  
  for (let shotIndex = 0; shotIndex < sortedFirstSceneShots.length; shotIndex++) {
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
 * Gets sequential shot video URLs from the first scene
 * Returns an array of video URLs in sequence (starting from shot 1, no gaps)
 * Returns empty array if:
 * - Final video URL is present
 * - Not generating
 * - No data
 * - Videos are not in sequence
 */
export const getSequentialShotVideoUrls = (
  data: ShotAssets | null,
  finalVideoUrl: string | null,
  isGenerating: boolean
): string[] => {
  // Don't return sequential videos if final video is available or not generating
  if (finalVideoUrl || !isGenerating || !data) {
    return [];
  }

  // Check if shot videos are available and in sequence
  if (!areShotVideosInSequence(data)) {
    return [];
  }

  const groupedShots = getGroupedShots(data);

  // Sort scenes by scene_beat_id to ensure proper order
  const sortedScenes = [...groupedShots].sort((a, b) => {
    const sceneA = parseInt(a.scene_beat_id) || 0;
    const sceneB = parseInt(b.scene_beat_id) || 0;
    return sceneA - sceneB;
  });

  if (sortedScenes.length === 0) {
    return [];
  }

  // Get videos from the first scene in sequence
  const firstScene = sortedScenes[0];
  const firstSceneShots = firstScene.shots;

  // Sort shots by panel_number to ensure proper order
  const sortedShots = [...firstSceneShots].sort(
    (a, b) => a.panel_number - b.panel_number
  );

  // Get all videos in sequence (starting from shot 1, no gaps)
  const videos: string[] = [];
  for (const shot of sortedShots) {
    if (shot.single_image_video_url) {
      videos.push(convertGoogleDriveUrl(shot.single_image_video_url));
    } else {
      // If we hit a gap, stop here
      break;
    }
  }

  return videos;
};
