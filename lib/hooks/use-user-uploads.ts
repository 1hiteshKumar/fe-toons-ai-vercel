import { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { validateUploads } from "@/server/mutations/validate-uploads";
import { uploadCSV } from "@/server/mutations/upload-csv";
import usePolling from "./use-polling";
import { API_URLS, PROMPT } from "@/server/constants";
import { toast } from "sonner";
import { addTask } from "@/server/mutations/add-task";
import fetchShotAssets from "@/server/queries/fetch-shot-assets";
import { ShotAssets } from "@/lib/types";

type ValidationResponse = {
  validation_task_id: string;
  status: "SUCCESS" | "FAILED" | string;
  result: {
    success: boolean;
    errors: string[];
    script_file_url: string | null;
    character_description_file_url: string | null;
    characters: unknown[];
  };
  message: string;
};

export type Stories = {
  validation_task_id: string;
  status: "PENDING" | "SUCCESS" | "FAILED";
  scriptText?: string;
  createdAt?: string;
  showName: string;
  finalShowId?: string;
};

export default function useUserUploads() {
  const [scriptText, setScriptText] = useState(PROMPT);
  const [csvUrl, setCSVurl] = useState<string>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [stories, setStories] = useState<Stories[]>([]);
  const [loading, setLoading] = useState(false);
  const [styleId, setStyleId] = useState<number | null>(87);
  const [showName, setShowName] = useState("TDMB");

  const { poll, stopPolling } = usePolling();

  const [activeTasks, setActiveTasks] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("validation_task_ids");
    if (stored) {
      setActiveTasks(JSON.parse(stored));
    }
  }, []);

  useEffect(() => {
    const stored = localStorage.getItem("stories");
    if (stored) {
      try {
        const parsedStories = JSON.parse(stored) as Stories[];
        setStories(parsedStories);
        
        // Fetch shot assets for stories with finalShowId and update status
        const updateStoryStatuses = async () => {
          const updatedStories = await Promise.all(
            parsedStories.map(async (story) => {
              if (story.finalShowId) {
                try {
                  const shotAssets = (await fetchShotAssets(
                    story.finalShowId
                  )) as ShotAssets | null;
                  
                  if (shotAssets?.task?.status) {
                    const taskStatus = shotAssets.task.status;
                    let newStatus: "PENDING" | "SUCCESS" | "FAILED" = "PENDING";
                    
                    if (taskStatus === "COMPLETED") {
                      newStatus = "SUCCESS";
                    } else if (taskStatus === "FAILED") {
                      newStatus = "FAILED";
                    }
                    
                    return {
                      ...story,
                      status: newStatus,
                    };
                  }
                } catch (error) {
                  console.error(
                    `Error fetching shot assets for story ${story.validation_task_id}:`,
                    error
                  );
                }
              }
              return story;
            })
          );
          
          setStories(updatedStories);
        };
        
        updateStoryStatuses();
      } catch (error) {
        console.error("Error parsing stories from localStorage:", error);
      }
    }
  }, []);

  const pollStatus = useCallback(
    async (taskId: string) => {
      if (!taskId) return;

      const pollingKey = `validation_task_${taskId}`;
      poll<ValidationResponse>({
        url: API_URLS.FETCH_VALIDATION_STATUS({ taskId }),
        pollingKey,
        callback: async function (data) {
          if (data?.status === "SUCCESS" || data?.status === "FAILED") {
            console.log(data);
            stopPolling(pollingKey);
            if (data.status === "SUCCESS") toast.success("TASK QUEUED");
            setActiveTasks((prev) => prev.filter((id) => id !== taskId));

            if (!data.result.success) {
              setStories((prev) =>
                prev.map((story) =>
                  story.validation_task_id === taskId
                    ? {
                        ...story,
                        status: "FAILED",
                      }
                    : story
                )
              );
              return;
            }

            if (data.result.success) {
              const finalShowId = await addTask({
                validation_task_id: data.validation_task_id,
                script_text: scriptText,
                showName,
                //@ts-expect-error for now
                styleId,
              });
              setStories((prev) =>
                prev.map((story) =>
                  story.validation_task_id === taskId
                    ? {
                        ...story,
                        finalShowId,
                        status: "PENDING",
                      }
                    : story
                )
              );
            }
          }
        },
      });
    },
    [poll, scriptText, showName, stopPolling, styleId]
  );

  useEffect(() => {
    activeTasks.forEach((taskId) => pollStatus(taskId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem("validation_task_ids", JSON.stringify(activeTasks));
  }, [activeTasks]);

  useEffect(() => {
    localStorage.setItem("stories", JSON.stringify(stories));
  }, [stories]);

  const onDrop = async (acceptedFiles: File[], rejectedFiles: unknown[]) => {
    toast.info("Uploading file, this won't take much time.");
    setLoading(true);
    if (acceptedFiles.length > 0) {
      const file = acceptedFiles[0];
      setSelectedFile(file);
      try {
        const uploadCSVurl = await uploadCSV({ file });
        setCSVurl(uploadCSVurl);
        toast.success("CSV uploaded successfully");
        console.log(uploadCSVurl);
      } catch {
        toast.error(
          "Something went wrong while uploading to S3, please try again."
        );
        handleRemoveFile();
      } finally {
        setLoading(false);
      }
    }
    if (rejectedFiles.length > 0) {
      alert("Please drop a CSV file only");
    }
  };

  const onGenerate = async () => {
    if (!csvUrl || !scriptText) return;

    const validation_task_id = await validateUploads({
      script_text: scriptText,
      character_description_file_url: csvUrl,
      style_id: styleId,
      show_name: showName,
    });

    setActiveTasks((prev) => [...prev, validation_task_id]);
    setStories((prev) => [
      {
        validation_task_id,
        status: "PENDING",
        scriptText: scriptText,
        createdAt: new Date().toISOString(),
        showName,
      },
      ...prev,
    ]);
    pollStatus(validation_task_id);

    // Clear the form after submission
    setScriptText("");
    setSelectedFile(null);
    setCSVurl(undefined);
    setStyleId(null);
    setShowName("");
  };

  const { getRootProps, getInputProps, isDragActive } = useDropzone({
    onDrop,
    accept: {
      "text/csv": [".csv"],
      "application/vnd.ms-excel": [".csv"],
    },
    multiple: false,
  });

  const handleRemoveFile = () => {
    setSelectedFile(null);
  };

  return {
    scriptText,
    setScriptText,
    selectedFile,
    getRootProps,
    getInputProps,
    isDragActive,
    onGenerate,
    handleRemoveFile,
    csvUrl,
    activeTasks,
    stories,
    loading,
    styleId,
    setStyleId,
    showName,
    setShowName,
  };
}
