import { baseFetch } from "@/lib/baseFetchUtil";
import { API_URLS } from "../constants";

interface UploadCSVParams {
  script_text: string;
  character_description_file_url: string;
}
export interface ValidateUploadsResponse {
  validation_task_id: string;
  message: string;
}

export async function validateUploads({
  script_text,
  character_description_file_url,
}: UploadCSVParams): Promise<string> {
  const res = (await baseFetch(API_URLS.VALIDATE_UPLOADS, {
    method: "POST",
    body: JSON.stringify({
      script_text,
      character_description_file_url,
    }),
  })) as ValidateUploadsResponse;

  return res.validation_task_id;
}
