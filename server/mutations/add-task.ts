import { baseFetch } from "@/lib/baseFetchUtil";
import { API_URLS } from "../constants";

export async function addTask({
  script_text,
  validation_task_id,
}: {
  script_text: string;
  validation_task_id: string;
}) {
  const res = (await baseFetch(API_URLS.ADD_TASK, {
    method: "POST",
    body: JSON.stringify({
      script_text,
      validation_task_id,
    }),
  })) as { id: string };

  return res.id;
}
