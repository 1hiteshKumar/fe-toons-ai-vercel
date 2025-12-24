import { baseFetch } from "@/lib/baseFetchUtil";
import { API_URLS } from "../constants";

interface UploadCSVParams {
  script_text: string;
  character_description_file_url: string;
  style_id?: number | null;
  show_name?: string;
  script_file_url?: string;
}
export interface ValidateUploadsResponse {
  validation_task_id: string;
  message: string;
}

export async function validateUploads({
  script_text,
  character_description_file_url,
  style_id,
  show_name,
}: UploadCSVParams): Promise<string> {
  const res = (await baseFetch(API_URLS.VALIDATE_UPLOADS, {
    method: "POST",
    body: JSON.stringify({
      script_text,
      character_description_file_url,
      ...(style_id && { style_id }),
      ...(show_name && { show_name }),
    }),
  })) as ValidateUploadsResponse;

  return res.validation_task_id;
}
