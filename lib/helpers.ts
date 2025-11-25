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
