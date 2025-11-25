export const API_URLS = {
  UPLOAD_CSV: ({
    fileExtension = "csv",
    purpose = "general",
    originalFilename = "example.csv",
  } = {}) =>
    `/api/upload/?file_extension=${fileExtension}&purpose=${purpose}&original_filename=${originalFilename}`,
  VALIDATE_UPLOADS: "/api/workers/orchestrator/validate_files/",
  FETCH_VALIDATION_STATUS: ({ taskId = "test" } = {}) =>
    `/api/workers/orchestrator/validation-status/${taskId}`,
  FETCH_SCENES: ({ taskId = "" } = {}) =>
    `/api/workers/orchestrator/${taskId}/beats/`,
  FETCH_CHARACTERS: ({ taskId = "" } = {}) =>
    `/api/workers/orchestrator/${taskId}/characters/`,
  FETCH_SHOT_ASSETS: ({ taskId = "" } = {}) =>
    `/api/workers/orchestrator/${taskId}/get_results/`,
  ADD_TASK: "/api/workers/orchestrator/",
};

export const TABS = [
  { id: "scenes", label: "Scenes" },
  { id: "characters", label: "Characters" },
  { id: "shot-images", label: "Shot Images" },
  { id: "shot-videos", label: "Shot Videos" },
  { id: "publish", label: "Publish" },
] as const;
