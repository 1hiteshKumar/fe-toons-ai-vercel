import { baseFetch } from "@/lib/baseFetchUtil";
import { API_URLS } from "../constants";

export default async function fetchCharacters(taskId: string) {
  const res = await baseFetch(
    API_URLS.FETCH_CHARACTERS({
      taskId,
    })
  );
  return res;
}
