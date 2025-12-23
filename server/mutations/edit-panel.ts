import { baseFetch } from "@/lib/baseFetchUtil";
import { API_URLS } from "../constants";

interface EditPanelParams {
  mode?: "edit" | "delete";
  orchestrator_task_id: number;
  orchestrator_result_task_id: number;
  panel_data?: unknown;
  type?: "image" | "video";
  user_start_frame_url?:string
}

export async function editPanel({
  mode = "edit" ,
  orchestrator_task_id,
  orchestrator_result_task_id,
  panel_data,
  type,
  user_start_frame_url
}: EditPanelParams): Promise<string> {
  const editTypeBody =
    type === "image"
      ? {
          generate_start_frame: true,
          generate_video: false,
        }
      : {
          generate_start_frame: false,
          generate_video: true,
        };

  const res = await baseFetch(API_URLS.EDIT_PANEL, {
    method: "POST",
    body: JSON.stringify({
      mode,
      orchestrator_task_id,
      orchestrator_result_task_id,
      panel_data,
      user_start_frame_url,
      ...editTypeBody,
    }),
  });

  return res;
}
