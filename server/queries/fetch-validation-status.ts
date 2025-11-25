import { baseFetch } from "@/lib/baseFetchUtil";
import { API_URLS } from "../constants";

export default async function fetchValidationStatus(taskId: string) {
  if (!taskId) throw new Error("TASK_ID NOT FOUND");

  const res = await baseFetch(
    API_URLS.FETCH_VALIDATION_STATUS({
      taskId,
    })
  );

  return res;
}
