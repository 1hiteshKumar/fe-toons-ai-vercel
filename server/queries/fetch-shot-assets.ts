import { baseFetch } from "@/lib/baseFetchUtil";
import { API_URLS } from "../constants";
import { Story } from "@/lib/hooks/use-user-uploads";
import { getIdFromGoogleDoc } from "@/lib/helpers";
import mammoth from "mammoth";

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
  const url = task.script_file_url;
  let scriptText = "";

  if (url.includes("docs.google.com/document")) {
    // Google Docs
    const docId = getIdFromGoogleDoc(url);
    const scriptTextRes = await fetch(
      `https://docs.google.com/document/d/${docId}/export?format=txt`
    );
    scriptText = await scriptTextRes.text();
  } else if (url.endsWith(".docx")) {
    // Cloudfront DOCX
    const res = await fetch(url);
    const arrayBuffer = await res.arrayBuffer();
    const { value } = await mammoth.extractRawText({ arrayBuffer });
    scriptText = value;
  } else {
    throw new Error("Unsupported script file URL format");
  }

  return {
    finalShowId: task.id,
    status: task.status,
    scriptText,
    showName: task.props.show_name,
    createdAt: task.created_at,
    validation_task_id: "",
  };
};
