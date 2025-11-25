import { baseFetch } from "@/lib/baseFetchUtil";
import { API_URLS } from "../constants";

export default async function fetchScenes(taskId: string) {
  const res = await baseFetch(
    API_URLS.FETCH_SCENES({
      taskId,
    })
  );

  return res;
}
