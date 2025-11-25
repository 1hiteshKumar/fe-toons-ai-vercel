import { baseFetch } from "@/lib/baseFetchUtil";
import { API_URLS } from "../constants";

interface UploadCSVParams {
  file: File;
  fileExtension?: string;
  purpose?: string;
  originalFilename?: string;
}

export async function uploadCSV({
  file,
  fileExtension = "csv",
  purpose = "general",
  originalFilename,
}: UploadCSVParams): Promise<string> {
  const filename = originalFilename || file.name;

  const presignedData = await baseFetch(
    API_URLS.UPLOAD_CSV({
      fileExtension,
      purpose,
      originalFilename: filename,
    }),
    {
      method: "POST",
    }
  );

  try {
    const formData = new FormData();

    Object.keys(presignedData.fields).forEach(key => {
      formData.append(key, presignedData.fields[key]);
    });


    formData.append('file', file);

    console.log("Uploading to S3...");
    const response = await fetch(presignedData.url, {
      method: 'POST',
      body: formData,
    });

    if (response.ok) {
      console.log("Upload Successful!");
      return presignedData.s3_unique_url;
    } else {
      const errorText = await response.text();
      throw new Error(`S3 Upload failed: ${response.status} - ${errorText}`);
    }

  } catch (error) {
    console.error("Upload Error:", error);
    throw error;
  }

}
