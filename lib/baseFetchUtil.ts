const BASE_URL: string = process.env.NEXT_PUBLIC_BACKEND_URL!;

const COMMON_HEADERS: Record<string, string> = {
  Authorization:
    "pfm_hDX9AdJTwCMiKNogocNn2D6axYJtDVZ3qcbrS37wPlkWBS59ZKVBkGc4YT4f",
};
interface FetchOptions extends RequestInit {
  headers?: Record<string, string>;
  isFormData?: boolean;
}

interface ErrorResponse {
  status: number;
  data: unknown;
}

export async function baseFetch(
  endpoint: string,
  options: FetchOptions = {},
  baseUrl?: string
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
): Promise<any> {
  if (!baseUrl && !BASE_URL) throw new Error("BASE_URL NOT FOUND");

  const url = `${baseUrl || BASE_URL}${endpoint}`;

  const {
    headers = {},
    method = "GET",
    body,
    isFormData = false,
    ...rest
  } = options;

  const defaultHeaders: Record<string, string> = isFormData
    ? {}
    : { "Content-Type": "application/json", ...headers };

  const finalHeaders = {
    ...COMMON_HEADERS,
    ...defaultHeaders,
    ...headers,
  };

  const fetchOptions: FetchOptions = {
    method,
    headers: finalHeaders,
    body,
    ...rest,
  };

  try {
    const response = await fetch(url, fetchOptions);

    const contentType = response.headers.get("content-type") || "";
    const data = contentType.includes("application/json")
      ? await response.json()
      : await response.text();

    if (!response.ok) {
      throw { status: response.status, data } as ErrorResponse;
    }

    return data;
  } catch (err) {
    console.error("API Error:", err);
    throw err;
  }
}
