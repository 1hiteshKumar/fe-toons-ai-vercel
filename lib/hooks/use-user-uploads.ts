import { useEffect, useState, useCallback } from "react";
import { useDropzone } from "react-dropzone";
import { validateUploads } from "@/server/mutations/validate-uploads";
import { uploadCSV } from "@/server/mutations/upload-csv";
import usePolling from "./use-polling";
import { API_URLS } from "@/server/constants";
import { toast } from "sonner";
import { addTask } from "@/server/mutations/add-task";

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
};

export default function useUserUploads() {
  const [scriptText, setScriptText] = useState("");
  const [csvUrl, setCSVurl] = useState<string>();
  const [selectedFile, setSelectedFile] = useState<File | null>(null);
  const [stories, setStories] = useState<Stories[]>([]);
  const [loading, setLoading] = useState(false);

  const { poll, stopPolling } = usePolling();

  const [activeTasks, setActiveTasks] = useState<string[]>([]);

  useEffect(() => {
    const stored = localStorage.getItem("validation_task_ids");
    if (stored) {
      setActiveTasks(JSON.parse(stored));
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
            console.log("here..");
            stopPolling(pollingKey);
            toast(data.message);
            setActiveTasks((prev) => prev.filter((id) => id !== taskId));
            setStories((prev) =>
              prev.map((story) =>
                story.validation_task_id === taskId
                  ? {
                      ...story,
                      status: data.result.success ? "SUCCESS" : "FAILED",
                    }
                  : story
              )
            );

            if (data.result.success) {
              const studioId = await addTask({
                validation_task_id: data.validation_task_id,
                script_text: scriptText,
              });
              console.log("studioId: ",studioId)
            }
          }
        },
      });
    },
    [poll, scriptText, stopPolling]
  );

  useEffect(() => {
    activeTasks.forEach((taskId) => pollStatus(taskId));
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  useEffect(() => {
    localStorage.setItem("validation_task_ids", JSON.stringify(activeTasks));
  }, [activeTasks]);

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
    });

    setActiveTasks((prev) => [...prev, validation_task_id]);
    setStories((prev) => [
      ...prev,
      {
        validation_task_id,
        status: "PENDING",
        scriptText: scriptText,
        createdAt: new Date().toISOString(),
      },
    ]);
    pollStatus(validation_task_id);

    // Clear the form after submission
    setScriptText("");
    setSelectedFile(null);
    setCSVurl(undefined);
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
  };
}
