import { baseFetch } from "@/lib/baseFetchUtil";
import { API_URLS } from "../constants";

export default async function fetchShotAssets(taskId: string) {
  const res = await baseFetch(
    API_URLS.FETCH_SHOT_ASSETS({
      taskId,
    })
  );
  return res;
}
