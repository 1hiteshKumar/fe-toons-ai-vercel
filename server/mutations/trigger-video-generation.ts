import { baseFetch } from "@/lib/baseFetchUtil";
import { API_URLS } from "../constants";

export async function triggerVideoGeneration({ taskId }: { taskId: number }) {
  const res = await baseFetch(API_URLS.TRIGGER_VIDEO_GENERATION, {
    method: "POST",
    body: JSON.stringify({
      task_id: taskId,
    }),
  });

  return res;
}
