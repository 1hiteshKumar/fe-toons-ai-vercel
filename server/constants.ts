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
  { id: "story", label: "Story" },
  { id: "scenes", label: "Scenes" },
  { id: "characters", label: "Characters" },
  { id: "shot-images", label: "Shot Images" },
  { id: "editor", label: "Editor" },
  { id: "shot-videos", label: "Shot Videos" },
  { id: "publish", label: "Publish" },
] as const;

export const PROMPT = `Ep 2 - Contract Marriage, Pt. 2

[SFX: OUTSIDE, NIGHT TIME. THE RUSTLE OF THE WIND THROUGH THE TREES. CRICKETS CHIRPING]
[Music Cue: Tense]
"Did your father set this up?" It was the only plausible scenario for Edgar.
[VOA: CONFIDENT, TO THE POINT]
"My father has no idea that I am out here speaking to you, Duke Edgar. I have told you the party is on the inside. No one was supposed to see me passing by. My father won't be pleased to see you here with me," Alessandra replied with the honest truth.
Not many people could say they often saw the baron's daughter since Desmond kept his daughter out of sight. Alessandra wasn't of any use to him, thanks to the mask she wore and the rumors surrounding her.
"Everything I say right now has nothing to do with my father. I leave it up to you to believe me. I am not interested in marrying anyone for love. I only wish to leave this place and never look back."
[VOA: DETERMINED]
"What is it? Your father has plans to marry you off to a man far older than you, or is he just shipping you off somewhere you do not wish to go? Has to be something drastic for you to ask a man you don't know to marry you," Edgar pressed his cigar against the stone wall to end it.
[SFX: SIZZLE]
"It is suffocating to be here. I am forgotten by my own father. I do not care for your looks Duke Edgar, nor your money or anything else others might want. Frankly, I only see you as an escape," she explained her reasoning for choosing him.
Their meeting was completely unexpected on her side, but Alessandra didn't want to leave without proposing what she had in mind.
.....
"I've heard my family speak of how the king wishes for you to get married. For a man who does not wish to have any romantic relationships with anyone, I might be a good choice. I will live quietly like a ghost, taking care of what you want of me, and I shall never love you."`;
