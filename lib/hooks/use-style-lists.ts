import { useState, useEffect } from "react";
import { baseFetch } from "@/lib/baseFetchUtil";

export type StyleOption = {
  id: number;
  name: string;
  prompt: string;
  is_public: boolean;
  image_count: number;
  thumbnail: string;
  created_at: string;
  changed_at: string;
};

const HARDCODED_STYLES: StyleOption[] = [
  {
    id: 87,
    name: "The Duke's Masked Bride - Flux",
    prompt: "",
    is_public: true,
    image_count: 0,
    thumbnail: "",
    created_at: "",
    changed_at: "",
  },
  {
    id: 116,
    name: "Rekindled Heartache - Flux",
    prompt: "",
    is_public: true,
    image_count: 0,
    thumbnail: "",
    created_at: "",
    changed_at: "",
  },
];

type UseStyleListsParams = {
  userId?: number;
  accessToken?: string;
  enabled?: boolean;
};

export default function useStyleLists({
  userId = 7,
  accessToken = "c7eb5f9a-e958-4a47-85fe-0b2674a946eb",
  enabled = true,
}: UseStyleListsParams = {}) {
  const [data, setData] = useState<StyleOption[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const fetchStyleLists = async () => {
    if (!userId) {
      return;
    }

    setLoading(true);
    setError(null);

    try {
      const response = await baseFetch(
        "/api/styles/e2e-styles/",
        {
          method: "GET",
          headers: {
            uid: userId.toString(),
            "access-token": accessToken || "",
          },
        },
        "https://api.blaze.pockettoons.com"
      );

      // The API response has a results array
      if (response?.results && Array.isArray(response.results)) {
        // Append hardcoded styles to the fetched results
        setData([...response.results]);
      } else {
        // If no results, still include hardcoded styles
        setData(HARDCODED_STYLES);
      }
    } catch (err) {
      console.error("Error fetching style lists:", err);
      setError(err instanceof Error ? err : new Error("Failed to fetch style lists"));
      setData([]);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    if (enabled && userId) {
      fetchStyleLists();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [userId, accessToken, enabled]);

  return {
    data,
    loading,
    error,
    refetch: fetchStyleLists,
  };
}
