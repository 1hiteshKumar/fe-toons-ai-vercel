import { baseFetch } from "@/lib/baseFetchUtil";
import { API_URLS } from "../constants";

export async function addTask({
  script_text,
  validation_task_id,
  showName,
  styleId,
}: {
  script_text: string;
  validation_task_id: string;
  showName: string;
  styleId: number;
}) {
  const res = (await baseFetch(API_URLS.ADD_TASK, {
    method: "POST",
    body: JSON.stringify({
      script_text,
      validation_task_id,
      video_generation_client: "seedance",
      props: {
        show_name: showName,
        style_id: styleId,
        episode_number: 1,
        dimensions: "576x1024",
        aspect_ratio: "9:16",
        keep_qc: false,
        is_e2e_style: true,
      },
    }),
  })) as { id: string };

  return res.id;
}
