import { baseFetch } from "@/lib/baseFetchUtil";
import { API_URLS } from "../constants";
import { Story } from "@/lib/hooks/use-user-uploads";
import { getIdFromGoogleDoc } from "@/lib/helpers";

export default async function fetchShotAssets(taskId: string) {
  const res = await baseFetch(
    API_URLS.FETCH_SHOT_ASSETS({
      taskId,
    })
  );
  return res;
}

export const fetchStoryData = async (taskId: string): Promise<Story> => {
  const { task } = await fetchShotAssets(taskId);
  const docId = getIdFromGoogleDoc(task.script_file_url);
  const scriptTextRes = await fetch(
    `https://docs.google.com/document/d/${docId}/export?format=txt`
  );
  const scriptText = await scriptTextRes.text();
  return {
    finalShowId: task.id,
    status: task.status,
    scriptText,
    showName: task.props.show_name,
    createdAt: task.created_at,
    validation_task_id: "",
  };
};
