import { baseFetch } from "@/lib/baseFetchUtil";
import { API_URLS } from "../constants";

export async function uploadImage({ file }: { file: File }) {
  const formData = new FormData();
  formData.append("file", file);

  const res = await baseFetch(API_URLS.UPLOAD_IMAGE, {
    method: "POST",
    body: formData,
    isFormData: true,
  });

  return res.file_url;
}
