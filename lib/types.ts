export type ResultItem = {
  changed_at: string;
  created_at: string;

  end_frame_status: string;
  end_frame_url: string;

  has_end_frame: boolean;
  has_video_data: boolean;

  id: number;
  orchestrator_task_id: number;

  panel_data: {
    action: Record<string, unknown>;
    frame_id: number;
    end_frame: Record<string, unknown>;
    start_frame: Record<string, unknown>;
    location_time: string;
    [key: string]: unknown;
  };

  panel_number: number;
  panel_prompt: string | null;

  single_image_video_url: string;
  start_end_video_url: string;

  start_frame_status: string;
  start_frame_url: string;

  video_status: string;
};

export type Scripts = {
  beats: string;
  prompt_2a: string;
  prompt_3: string;
  prompt_6: string;
};

export type TaskProps = {
  keep_qc: boolean;
  style_id: number;
  show_name: string;
  user_meta: Record<string, unknown>;
};

export type Character = {
  [key: string]: unknown;
};

export type Task = {
  anime_script_writer_task_id: number;
  changed_at: string;
  character_description_file_url: string;
  characters: Character[];
  created_at: string;
  e2e_agent_task_ids: number[];
  id: number;
  output_video_url_single_image: string | null;
  output_video_url_start_end: string;
  props: TaskProps;
  script_file_url: string;
  status: "COMPLETED" | "IN PROGRESS" | "FAILED";
  total_frames: number;
  video_generation_client: string;
  video_pipeline_task_id: number | null;
};

export type PanelData = {
  action: Record<string, unknown>;
  frame_id: number;
  end_frame: Record<string, unknown>;
  start_frame: {
    narration: string;
    frame_description: string;
  };
  location_time: string;
  scene_beat_id: string;
};

export type PanelItem = {
  changed_at: string;
  created_at: string;
  end_frame_status: string;
  end_frame_url: string;
  has_end_frame: boolean;
  has_video_data: boolean;
  id: number;
  orchestrator_task_id: number;
  panel_data: PanelData;
  panel_number: number;
  panel_prompt: string | null;
  single_image_video_url: string;
  start_end_video_url: string;
  start_frame_status: string;
  start_frame_url: string;
  video_status: string;
};

export type ShotAssets = {
  scripts: Scripts;
  task: Task;
  results: PanelItem[];
};

export type ShotGrouped = {
  scene_beat_id: string;
  shots: PanelItem[];
};
