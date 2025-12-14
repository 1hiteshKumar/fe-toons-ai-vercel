import { useState } from "react";
import { baseFetch } from "@/lib/baseFetchUtil";

type GetCharacterSheetParams = {
  taskId: number;
  generateType?: "characters" | "creatures";
};

type GetCharacterSheetResponse = {
  spreadsheet_url: string;
  spreadsheet_id: string;
  task_id: number;
  generate_type: string;
  character_count: number;
  message: string;
};

export default function useGetCharacterSheet() {
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<Error | null>(null);

  const getCharacterSheet = async ({ taskId, generateType = "characters" }: GetCharacterSheetParams) => {
    setLoading(true);
    setError(null);

    try {
      const response = await baseFetch(
        "/api/workers/character-context/get-character-sheet/",
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            task_id: taskId,
            generate_type: generateType,
          }),
        },
        "https://api.blaze.pockettoons.com"
      ) as GetCharacterSheetResponse;

      return response;
    } catch (err) {
      console.error("Error getting character sheet:", err);
      const errorMessage = err instanceof Error ? err : new Error("Failed to get character sheet");
      setError(errorMessage);
      throw errorMessage;
    } finally {
      setLoading(false);
    }
  };

  return {
    getCharacterSheet,
    loading,
    error,
  };
}

