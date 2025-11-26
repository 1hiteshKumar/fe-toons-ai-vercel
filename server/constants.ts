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

export const PROMPT = `Ep 1 - Contract Marriage, Pt. 1
[AMBIENT SFX: Sophisticated party in the other room, laughter, chatter]
[SFX: FOOTSTEPS ECHOING]
[Music Cue: Dramatic tension, building]
"Edgar, please spend the night with my daughter, and you would see she is an excellent choice for your wife," Katrina pushed her daughter, Kate, towards Edgar as he passed by them.
All eyes were on the three of them as Edgar was the main topic for the night.
[VOA: SARCASTIC]
"I wasn't aware your daughter started working in the red light district. I am not looking for a wife there," Edgar stepped to the left to pass the disappointed Katrina and Kate.
[SFX: MURMURS AND GIGGLES FROM THE CROWD]
He had only arrived less than three minutes ago but this was his second encounter with a mother and daughter looking to win over his favor. Ever since it was announced he was looking for a wife this was happening.`;
