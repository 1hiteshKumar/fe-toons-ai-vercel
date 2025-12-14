"use client";

import { useState, useEffect, useRef, useMemo } from "react";
import { CrossCircleIcon } from "@/aural/icons/cross-circle-icon";
import { baseFetch } from "@/lib/baseFetchUtil";
import usePolling from "@/lib/hooks/use-polling";
import useGetCharacterSheet from "@/lib/hooks/use-get-character-sheet";
import Loading from "@/components/loading";
import Image from "next/image";
import { cn } from "@/aural/lib/utils";
import { convertGoogleDriveUrl } from "@/lib/helpers";
import { toast } from "sonner";
import { Pencil, PlusIcon, Trash } from "@/lib/icons";

type StyleOption = {
  id: number;
  name: string;
  prompt: string;
  [key: string]: unknown;
};

type ExtractTaskResponse = {
  task_id: number;
  status: string;
  message: string;
};

type CharacterOrCreature = {
  id: number;
  name: string;
  category: string;
  image: string | null;
  close_up?: string | null;
  back_view?: string | null;
  character_description?: {
    description?: string;
    [key: string]: unknown;
  };
  [key: string]: unknown;
};

type DisplayCharacter = {
  id: number;
  name: string;
  category: string;
  description?: string;
  front_view: string | null;
  back_view: string | null;
  close_up: string | null;
  image: string | null;
};

type PollingResponse = {
  characters: CharacterOrCreature[];
  creatures: CharacterOrCreature[];
  backgrounds: unknown[];
  props: unknown[];
  task_id: number;
  task_status: string;
  error?: string;
};

type GenerateImagesItem = {
  id: number;
  name: string;
  category: string;
  image: string | null;
  close_up: string | null;
  back_view: string | null;
  [key: string]: unknown;
};

type GenerateImagesResponse = {
  task_id: number;
  status: string;
  generate_type: string;
  items_count: number;
  items: GenerateImagesItem[];
  message?: string;
};

type CreateCharacterDescriptionModalProps = {
  isOpen: boolean;
  onClose: () => void;
  selectedStyle?: StyleOption | null;
  onSheetCreated?: (spreadsheetUrl: string, taskId: number) => void;
};

export default function CreateCharacterDescriptionModal({
  isOpen,
  onClose,
  selectedStyle,
  onSheetCreated,
}: CreateCharacterDescriptionModalProps) {
  const [isLoading, setIsLoading] = useState(false);
  const [isPolling, setIsPolling] = useState(false);
  const [isPollingHuman, setIsPollingHuman] = useState(false);
  const [isPollingCreature, setIsPollingCreature] = useState(false);
  const [isPollingHumanAltViews, setIsPollingHumanAltViews] = useState(false);
  const [isPollingCreatureAltViews, setIsPollingCreatureAltViews] =
    useState(false);
  const [taskId, setTaskId] = useState<number | null>(null);
  const [taskStatus, setTaskStatus] = useState<string>("");
  const [humanStatus, setHumanStatus] = useState<string>("");
  const [creatureStatus, setCreatureStatus] = useState<string>("");
  const [humanAltViewsStatus, setHumanAltViewsStatus] = useState<string>("");
  const [creatureAltViewsStatus, setCreatureAltViewsStatus] =
    useState<string>("");
  const [pollingResponse, setPollingResponse] =
    useState<PollingResponse | null>(null);
  const [humanResponse, setHumanResponse] =
    useState<GenerateImagesResponse | null>(null);
  const [creatureResponse, setCreatureResponse] =
    useState<GenerateImagesResponse | null>(null);
  const [humanAltViewsResponse, setHumanAltViewsResponse] =
    useState<GenerateImagesResponse | null>(null);
  const [creatureAltViewsResponse, setCreatureAltViewsResponse] =
    useState<GenerateImagesResponse | null>(null);
  const [error, setError] = useState<Error | null>(null);
  const [selectedCharacter, setSelectedCharacter] =
    useState<DisplayCharacter | null>(null);
  const pollingStartTimeRef = useRef<number | null>(null);
  const humanPollingStartTimeRef = useRef<number | null>(null);
  const creaturePollingStartTimeRef = useRef<number | null>(null);
  const humanAltViewsPollingStartTimeRef = useRef<number | null>(null);
  const creatureAltViewsPollingStartTimeRef = useRef<number | null>(null);
  const humanPollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const creaturePollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const humanAltViewsPollingIntervalRef = useRef<NodeJS.Timeout | null>(null);
  const creatureAltViewsPollingIntervalRef = useRef<NodeJS.Timeout | null>(
    null
  );
  const { poll, stopPolling } = usePolling();
  const {
    getCharacterSheet,
    loading: isGettingSheet,
    error: sheetError,
  } = useGetCharacterSheet();

  // Track current taskId for cleanup
  const currentTaskIdRef = useRef<number | null>(null);
  const currentTaskIdForAltViewsRef = useRef<number | null>(null);
  const humanImagesDoneRef = useRef<boolean>(false);
  const creatureImagesDoneRef = useRef<boolean>(false);
  const altViewsStartedRef = useRef<boolean>(false);
  const startGenerateAltViewsRef = useRef<((taskId: number) => void) | null>(
    null
  );
  const hasInitializedCharacterRef = useRef<boolean>(false);

  // Combine all data sources into display characters
  const displayCharacters = useMemo(() => {
    if (!pollingResponse) return [];

    const characters: DisplayCharacter[] = [];
    const allItems = new Map<string, GenerateImagesItem>();

    // Collect items from human and creature responses
    if (humanResponse?.items) {
      humanResponse.items.forEach((item) => {
        allItems.set(item.name, { ...item });
      });
    }
    if (creatureResponse?.items) {
      creatureResponse.items.forEach((item) => {
        const existing = allItems.get(item.name);
        if (existing) {
          allItems.set(item.name, { ...existing, ...item });
        } else {
          allItems.set(item.name, { ...item });
        }
      });
    }

    // Collect alt views
    if (humanAltViewsResponse?.items) {
      humanAltViewsResponse.items.forEach((item) => {
        const existing = allItems.get(item.name);
        if (existing) {
          allItems.set(item.name, {
            ...existing,
            close_up: item.close_up || existing.close_up,
            back_view: item.back_view || existing.back_view,
          });
        }
      });
    }
    if (creatureAltViewsResponse?.items) {
      creatureAltViewsResponse.items.forEach((item) => {
        const existing = allItems.get(item.name);
        if (existing) {
          allItems.set(item.name, {
            ...existing,
            close_up: item.close_up || existing.close_up,
            back_view: item.back_view || existing.back_view,
          });
        }
      });
    }

    // Combine pollingResponse characters/creatures with items
    const allChars = [
      ...(pollingResponse.characters || []),
      ...(pollingResponse.creatures || []),
    ];

    allChars.forEach((char) => {
      const item = allItems.get(char.name);
      // Use character's own properties first (they may already have close_up, back_view),
      // then fall back to items from API responses
      // Access properties with type assertion since they might exist on the object
      const charCloseUp = (char as CharacterOrCreature).close_up;
      const charBackView = (char as CharacterOrCreature).back_view;

      characters.push({
        id: char.id,
        name: char.name,
        category: char.category,
        description: char.character_description?.description as
          | string
          | undefined,
        image: char.image,
        front_view: char.image || item?.image || null, // Use char.image as front_view
        back_view: charBackView || item?.back_view || null, // Check char.back_view first
        close_up: charCloseUp || item?.close_up || null, // Check char.close_up first
      });
    });

    return characters;
  }, [
    pollingResponse,
    humanResponse,
    creatureResponse,
    humanAltViewsResponse,
    creatureAltViewsResponse,
  ]);

  // Check if any character/creature has image
  const hasCharactersWithImages = useMemo(() => {
    if (!pollingResponse) return false;
    const characters = [
      ...(pollingResponse.characters || []),
      ...(pollingResponse.creatures || []),
    ];
    return characters.some(
      (char) => char.image !== null && char.image !== undefined
    );
  }, [pollingResponse]);

  // Set first character as selected when available
  useEffect(() => {
    if (
      displayCharacters.length > 0 &&
      !selectedCharacter &&
      !hasInitializedCharacterRef.current
    ) {
      hasInitializedCharacterRef.current = true;
      // eslint-disable-next-line react-hooks/exhaustive-deps
      setSelectedCharacter(displayCharacters[0]);
    }
  }, [displayCharacters, selectedCharacter]);

  const getImageUrl = (url: string | null) => {
    if (!url) return "";
    return convertGoogleDriveUrl(url);
  };

  // Make API call and start polling when modal opens
  useEffect(() => {
    if (!isOpen || !selectedStyle) {
      return;
    }

    const makeApiCall = async () => {
      if (!selectedStyle.prompt) {
        setError(new Error("Selected style does not have a prompt"));
        return;
      }

      setIsLoading(true);
      setError(null);
      setPollingResponse(null);
      setTaskStatus("");
      humanImagesDoneRef.current = false;
      creatureImagesDoneRef.current = false;
      altViewsStartedRef.current = false;
      hasInitializedCharacterRef.current = false;

      try {
        const apiResponse = (await baseFetch(
          "/api/workers/character-context/extract/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              text: selectedStyle.prompt,
              user_id: 7,
              style_id: "",
              e2e_style_id: selectedStyle.id.toString(),
              aspect_ratio: "9:16",
              project_identifier: "test",
            }),
          },
          "https://api.blaze.pockettoons.com"
        )) as ExtractTaskResponse;

        if (apiResponse?.task_id) {
          const receivedTaskId = apiResponse.task_id;
          setTaskId(receivedTaskId);
          currentTaskIdRef.current = receivedTaskId;
          setIsLoading(false);
          setIsPolling(true);
          pollingStartTimeRef.current = Date.now();

          // Start polling using the usePolling hook
          const pollingKey = `character-extraction-${receivedTaskId}`;

          poll<PollingResponse>({
            url: `/api/workers/character-context/list-characters/?user_id=7&task_id=${receivedTaskId}`,
            baseUrl: "https://api.blaze.pockettoons.com",
            pollingKey,
            delay: 5000, // Poll every 5 seconds
            headers: {
              uid: "7",
              "access-token": "c7eb5f9a-e958-4a47-85fe-0b2674a946eb",
            },
            callback: (data) => {
              if (!data) {
                return;
              }

              // Check if task has failed
              if (data.task_status === "failed") {
                stopPolling(pollingKey);
                setIsPolling(false);
                const errorMessage = data.error || "Task failed";
                setError(new Error(errorMessage));
                toast.error(errorMessage);
                // Close modal after a short delay
                setTimeout(() => {
                  onClose();
                }, 2000);
                return;
              }

              // Check if 10 minutes have passed
              if (pollingStartTimeRef.current) {
                const elapsed = Date.now() - pollingStartTimeRef.current;
                if (elapsed > 10 * 60 * 1000) {
                  // 10 minutes = 600000ms
                  stopPolling(pollingKey);
                  setIsPolling(false);
                  setError(
                    new Error(
                      "Polling timeout: Task took longer than 10 minutes"
                    )
                  );
                  return;
                }
              }

              setPollingResponse(data);
              setTaskStatus(data.task_status || "");

              // Check if we should stop polling
              // Stop when: we have characters/creatures entries AND all have non-null images
              const characters = Array.isArray(data.characters)
                ? data.characters
                : [];
              const creatures = Array.isArray(data.creatures)
                ? data.creatures
                : [];

              // Check if we have any entries
              const hasEntries = characters.length > 0 || creatures.length > 0;

              if (hasEntries) {
                // Check if all characters have images
                const allCharactersHaveImages =
                  characters.length === 0 ||
                  characters.every(
                    (char: CharacterOrCreature) =>
                      char.image !== null && char.image !== undefined
                  );

                // Check if all creatures have images
                const allCreaturesHaveImages =
                  creatures.length === 0 ||
                  creatures.every(
                    (creature: CharacterOrCreature) =>
                      creature.image !== null && creature.image !== undefined
                  );

                // Stop polling if all characters and creatures have images
                if (allCharactersHaveImages && allCreaturesHaveImages) {
                  stopPolling(pollingKey);
                  setIsPolling(false);

                  // After first polling completes, start generating images for human and creature
                  startGenerateImages(receivedTaskId);
                }
              }
              // Continue polling if no entries yet or if any image is null
            },
            failData: null,
          });
        } else {
          setError(new Error("No task_id received from API"));
          setIsLoading(false);
        }
      } catch (err) {
        console.error("Error creating character description sheet:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to create character description sheet")
        );
        setIsLoading(false);
      }
    };

    const startGenerateImages = async (taskId: number) => {
      try {
        // Make API call for human
        const humanResponse = (await baseFetch(
          "/api/workers/character-context/generate-images/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              task_id: taskId,
              generate_type: "human",
            }),
          },
          "https://api.blaze.pockettoons.com"
        )) as GenerateImagesResponse;

        if (humanResponse?.task_id) {
          setIsPollingHuman(true);
          humanPollingStartTimeRef.current = Date.now();

          // Custom polling for human images (POST request with body)
          const pollHumanImages = async () => {
            try {
              // Check timeout (10 minutes)
              if (humanPollingStartTimeRef.current) {
                const elapsed = Date.now() - humanPollingStartTimeRef.current;
                if (elapsed > 10 * 60 * 1000) {
                  if (humanPollingIntervalRef.current) {
                    clearInterval(humanPollingIntervalRef.current);
                    humanPollingIntervalRef.current = null;
                  }
                  setIsPollingHuman(false);
                  setError(
                    new Error(
                      "Human image generation timeout: Task took longer than 10 minutes"
                    )
                  );
                  return;
                }
              }

              const data = (await baseFetch(
                "/api/workers/character-context/generate-images/",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    task_id: taskId,
                    generate_type: "human",
                  }),
                },
                "https://api.blaze.pockettoons.com"
              )) as GenerateImagesResponse;

              setHumanResponse(data);
              setHumanStatus(data.status || "");

              // Stop polling when status is not "pending" AND all items have images
              const hasItems =
                Array.isArray(data.items) && data.items.length > 0;
              if (hasItems) {
                const allItemsHaveImages = data.items.every(
                  (item: GenerateImagesItem) =>
                    item.image !== null && item.image !== undefined
                );
                const isNotPending = data.status !== "pending";

                if (isNotPending && allItemsHaveImages) {
                  if (humanPollingIntervalRef.current) {
                    clearInterval(humanPollingIntervalRef.current);
                    humanPollingIntervalRef.current = null;
                  }
                  setIsPollingHuman(false);
                  humanImagesDoneRef.current = true;
                  // Check if both human and creature are done, then start alt-views
                  if (
                    humanImagesDoneRef.current &&
                    creatureImagesDoneRef.current &&
                    !altViewsStartedRef.current &&
                    startGenerateAltViewsRef.current
                  ) {
                    altViewsStartedRef.current = true;
                    startGenerateAltViewsRef.current(taskId);
                  }
                }
              } else if (data.status !== "pending") {
                // If no items but status is not pending, stop polling
                if (humanPollingIntervalRef.current) {
                  clearInterval(humanPollingIntervalRef.current);
                  humanPollingIntervalRef.current = null;
                }
                setIsPollingHuman(false);
                humanImagesDoneRef.current = true;
                // Check if both human and creature are done, then start alt-views
                if (
                  humanImagesDoneRef.current &&
                  creatureImagesDoneRef.current &&
                  !altViewsStartedRef.current &&
                  startGenerateAltViewsRef.current
                ) {
                  altViewsStartedRef.current = true;
                  startGenerateAltViewsRef.current(taskId);
                }
              }
            } catch (err) {
              console.error("Error polling human images:", err);
            }
          };

          // Start polling immediately and then every 5 seconds
          pollHumanImages();
          humanPollingIntervalRef.current = setInterval(pollHumanImages, 5000);
        }

        // Make API call for creature
        const creatureResponse = (await baseFetch(
          "/api/workers/character-context/generate-images/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              task_id: taskId,
              generate_type: "creature",
            }),
          },
          "https://api.blaze.pockettoons.com"
        )) as GenerateImagesResponse;

        if (creatureResponse?.task_id) {
          setIsPollingCreature(true);
          creaturePollingStartTimeRef.current = Date.now();

          // Custom polling for creature images (POST request with body)
          const pollCreatureImages = async () => {
            try {
              // Check timeout (10 minutes)
              if (creaturePollingStartTimeRef.current) {
                const elapsed =
                  Date.now() - creaturePollingStartTimeRef.current;
                if (elapsed > 10 * 60 * 1000) {
                  if (creaturePollingIntervalRef.current) {
                    clearInterval(creaturePollingIntervalRef.current);
                    creaturePollingIntervalRef.current = null;
                  }
                  setIsPollingCreature(false);
                  setError(
                    new Error(
                      "Creature image generation timeout: Task took longer than 10 minutes"
                    )
                  );
                  return;
                }
              }

              const data = (await baseFetch(
                "/api/workers/character-context/generate-images/",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    task_id: taskId,
                    generate_type: "creature",
                  }),
                },
                "https://api.blaze.pockettoons.com"
              )) as GenerateImagesResponse;

              setCreatureResponse(data);
              setCreatureStatus(data.status || "");

              // Stop polling when status is not "pending" AND all items have images
              const hasItems =
                Array.isArray(data.items) && data.items.length > 0;
              if (hasItems) {
                const allItemsHaveImages = data.items.every(
                  (item: GenerateImagesItem) =>
                    item.image !== null && item.image !== undefined
                );
                const isNotPending = data.status !== "pending";

                if (isNotPending && allItemsHaveImages) {
                  if (creaturePollingIntervalRef.current) {
                    clearInterval(creaturePollingIntervalRef.current);
                    creaturePollingIntervalRef.current = null;
                  }
                  setIsPollingCreature(false);
                  creatureImagesDoneRef.current = true;
                  // Check if both human and creature are done, then start alt-views
                  if (
                    humanImagesDoneRef.current &&
                    creatureImagesDoneRef.current &&
                    !altViewsStartedRef.current &&
                    startGenerateAltViewsRef.current
                  ) {
                    altViewsStartedRef.current = true;
                    startGenerateAltViewsRef.current(taskId);
                  }
                }
              } else if (data.status !== "pending") {
                // If no items but status is not pending, stop polling
                if (creaturePollingIntervalRef.current) {
                  clearInterval(creaturePollingIntervalRef.current);
                  creaturePollingIntervalRef.current = null;
                }
                setIsPollingCreature(false);
                creatureImagesDoneRef.current = true;
                // Check if both human and creature are done, then start alt-views
                if (
                  humanImagesDoneRef.current &&
                  creatureImagesDoneRef.current &&
                  !altViewsStartedRef.current &&
                  startGenerateAltViewsRef.current
                ) {
                  altViewsStartedRef.current = true;
                  startGenerateAltViewsRef.current(taskId);
                }
              }
            } catch (err) {
              console.error("Error polling creature images:", err);
            }
          };

          // Start polling immediately and then every 5 seconds
          pollCreatureImages();
          creaturePollingIntervalRef.current = setInterval(
            pollCreatureImages,
            5000
          );
        }
      } catch (err) {
        console.error("Error starting image generation:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to start image generation")
        );
      }
    };

    const startGenerateAltViews = async (taskId: number) => {
      try {
        currentTaskIdForAltViewsRef.current = taskId;

        // Make API call for human alt-views
        const humanAltViewsResponse = (await baseFetch(
          "/api/workers/character-context/generate-alt-views/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              task_id: taskId,
              generate_type: "human",
            }),
          },
          "https://api.blaze.pockettoons.com"
        )) as GenerateImagesResponse;

        if (humanAltViewsResponse?.task_id) {
          setIsPollingHumanAltViews(true);
          humanAltViewsPollingStartTimeRef.current = Date.now();

          // Custom polling for human alt-views (POST request with body)
          const pollHumanAltViews = async () => {
            try {
              // Check timeout (10 minutes)
              if (humanAltViewsPollingStartTimeRef.current) {
                const elapsed =
                  Date.now() - humanAltViewsPollingStartTimeRef.current;
                if (elapsed > 10 * 60 * 1000) {
                  if (humanAltViewsPollingIntervalRef.current) {
                    clearInterval(humanAltViewsPollingIntervalRef.current);
                    humanAltViewsPollingIntervalRef.current = null;
                  }
                  setIsPollingHumanAltViews(false);
                  setError(
                    new Error(
                      "Human alt-views generation timeout: Task took longer than 10 minutes"
                    )
                  );
                  return;
                }
              }

              const data = (await baseFetch(
                "/api/workers/character-context/generate-alt-views/",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    task_id: taskId,
                    generate_type: "human",
                  }),
                },
                "https://api.blaze.pockettoons.com"
              )) as GenerateImagesResponse;

              setHumanAltViewsResponse(data);
              setHumanAltViewsStatus(data.status || "");

              // Stop polling when status is not "pending" AND all items have images
              const hasItems =
                Array.isArray(data.items) && data.items.length > 0;
              if (hasItems) {
                const allItemsHaveImages = data.items.every(
                  (item: GenerateImagesItem) =>
                    item.image !== null && item.image !== undefined
                );
                const isNotPending = data.status !== "pending";

                if (isNotPending && allItemsHaveImages) {
                  if (humanAltViewsPollingIntervalRef.current) {
                    clearInterval(humanAltViewsPollingIntervalRef.current);
                    humanAltViewsPollingIntervalRef.current = null;
                  }
                  setIsPollingHumanAltViews(false);
                }
              } else if (data.status !== "pending") {
                // If no items but status is not pending, stop polling
                if (humanAltViewsPollingIntervalRef.current) {
                  clearInterval(humanAltViewsPollingIntervalRef.current);
                  humanAltViewsPollingIntervalRef.current = null;
                }
                setIsPollingHumanAltViews(false);
              }
            } catch (err) {
              console.error("Error polling human alt-views:", err);
            }
          };

          // Start polling immediately and then every 5 seconds
          pollHumanAltViews();
          humanAltViewsPollingIntervalRef.current = setInterval(
            pollHumanAltViews,
            5000
          );
        }

        // Make API call for creature alt-views
        const creatureAltViewsResponse = (await baseFetch(
          "/api/workers/character-context/generate-alt-views/",
          {
            method: "POST",
            headers: {
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              task_id: taskId,
              generate_type: "creature",
            }),
          },
          "https://api.blaze.pockettoons.com"
        )) as GenerateImagesResponse;

        if (creatureAltViewsResponse?.task_id) {
          setIsPollingCreatureAltViews(true);
          creatureAltViewsPollingStartTimeRef.current = Date.now();

          // Custom polling for creature alt-views (POST request with body)
          const pollCreatureAltViews = async () => {
            try {
              // Check timeout (10 minutes)
              if (creatureAltViewsPollingStartTimeRef.current) {
                const elapsed =
                  Date.now() - creatureAltViewsPollingStartTimeRef.current;
                if (elapsed > 10 * 60 * 1000) {
                  if (creatureAltViewsPollingIntervalRef.current) {
                    clearInterval(creatureAltViewsPollingIntervalRef.current);
                    creatureAltViewsPollingIntervalRef.current = null;
                  }
                  setIsPollingCreatureAltViews(false);
                  setError(
                    new Error(
                      "Creature alt-views generation timeout: Task took longer than 10 minutes"
                    )
                  );
                  return;
                }
              }

              const data = (await baseFetch(
                "/api/workers/character-context/generate-alt-views/",
                {
                  method: "POST",
                  headers: {
                    "Content-Type": "application/json",
                  },
                  body: JSON.stringify({
                    task_id: taskId,
                    generate_type: "creature",
                  }),
                },
                "https://api.blaze.pockettoons.com"
              )) as GenerateImagesResponse;

              setCreatureAltViewsResponse(data);
              setCreatureAltViewsStatus(data.status || "");

              // Stop polling when status is not "pending" AND all items have images
              const hasItems =
                Array.isArray(data.items) && data.items.length > 0;
              if (hasItems) {
                const allItemsHaveImages = data.items.every(
                  (item: GenerateImagesItem) =>
                    item.image !== null && item.image !== undefined
                );
                const isNotPending = data.status !== "pending";

                if (isNotPending && allItemsHaveImages) {
                  if (creatureAltViewsPollingIntervalRef.current) {
                    clearInterval(creatureAltViewsPollingIntervalRef.current);
                    creatureAltViewsPollingIntervalRef.current = null;
                  }
                  setIsPollingCreatureAltViews(false);
                }
              } else if (data.status !== "pending") {
                // If no items but status is not pending, stop polling
                if (creatureAltViewsPollingIntervalRef.current) {
                  clearInterval(creatureAltViewsPollingIntervalRef.current);
                  creatureAltViewsPollingIntervalRef.current = null;
                }
                setIsPollingCreatureAltViews(false);
              }
            } catch (err) {
              console.error("Error polling creature alt-views:", err);
            }
          };

          // Start polling immediately and then every 5 seconds
          pollCreatureAltViews();
          creatureAltViewsPollingIntervalRef.current = setInterval(
            pollCreatureAltViews,
            5000
          );
        }
      } catch (err) {
        console.error("Error starting alt-views generation:", err);
        setError(
          err instanceof Error
            ? err
            : new Error("Failed to start alt-views generation")
        );
      }
    };

    // Store the function in ref so it can be called from polling callbacks
    startGenerateAltViewsRef.current = startGenerateAltViews;

    makeApiCall();

    // Cleanup function
    return () => {
      // Stop polling when component unmounts or dependencies change
      if (currentTaskIdRef.current) {
        const pollingKey = `character-extraction-${currentTaskIdRef.current}`;
        stopPolling(pollingKey);
      }
      // Reset state
      setIsLoading(false);
      setIsPolling(false);
      setIsPollingHuman(false);
      setIsPollingCreature(false);
      setIsPollingHumanAltViews(false);
      setIsPollingCreatureAltViews(false);
      setTaskId(null);
      setTaskStatus("");
      setHumanStatus("");
      setCreatureStatus("");
      setHumanAltViewsStatus("");
      setCreatureAltViewsStatus("");
      setPollingResponse(null);
      setHumanResponse(null);
      setCreatureResponse(null);
      setHumanAltViewsResponse(null);
      setCreatureAltViewsResponse(null);
      setError(null);
      pollingStartTimeRef.current = null;
      humanPollingStartTimeRef.current = null;
      creaturePollingStartTimeRef.current = null;
      humanAltViewsPollingStartTimeRef.current = null;
      creatureAltViewsPollingStartTimeRef.current = null;
      currentTaskIdRef.current = null;
      currentTaskIdForAltViewsRef.current = null;

      // Stop all polling intervals
      if (humanPollingIntervalRef.current) {
        clearInterval(humanPollingIntervalRef.current);
        humanPollingIntervalRef.current = null;
      }
      if (creaturePollingIntervalRef.current) {
        clearInterval(creaturePollingIntervalRef.current);
        creaturePollingIntervalRef.current = null;
      }
      if (humanAltViewsPollingIntervalRef.current) {
        clearInterval(humanAltViewsPollingIntervalRef.current);
        humanAltViewsPollingIntervalRef.current = null;
      }
      if (creatureAltViewsPollingIntervalRef.current) {
        clearInterval(creatureAltViewsPollingIntervalRef.current);
        creatureAltViewsPollingIntervalRef.current = null;
      }

      // Stop polling from hook
      if (currentTaskIdRef.current) {
        stopPolling(`character-extraction-${currentTaskIdRef.current}`);
      }
    };
  }, [isOpen, selectedStyle, poll, stopPolling]);

  if (!isOpen) return null;

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
      onClick={onClose}
    >
      <div
        className="relative w-full max-w-6xl mx-4 bg-[#1A1A1A] rounded-xl shadow-lg p-6 max-h-[90vh] overflow-y-auto"
        onClick={(e) => e.stopPropagation()}
      >
        {/* Close Button */}
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-1 rounded-full bg-[#333333] hover:bg-[#444444] transition-colors"
          aria-label="Close modal"
        >
          <CrossCircleIcon className="size-6 text-white" />
        </button>

        {/* Header */}

        {/* Content */}
        <div className="space-y-6">
          {selectedStyle ? (
            <div className="space-y-4">
              {/* Loading State - Show Loading component until characters have images */}
              {!hasCharactersWithImages &&
                (isLoading ||
                  isPolling ||
                  isPollingHuman ||
                  isPollingCreature ||
                  isPollingHumanAltViews ||
                  isPollingCreatureAltViews) && <Loading text="characters" />}

              {/* Error State */}
              {error &&
                !isPolling &&
                !isPollingHuman &&
                !isPollingCreature &&
                !isPollingHumanAltViews &&
                !isPollingCreatureAltViews && (
                  <div className="bg-red-500/10 border border-red-500/50 rounded-lg p-4">
                    <p className="text-red-400 text-sm">
                      Error: {error.message}
                    </p>
                  </div>
                )}

              {/* Characters Display - Show when we have characters with images */}
              {hasCharactersWithImages &&
                displayCharacters.length > 0 &&
                pollingResponse && (
                  <div className="flex gap-6 h-[calc(90vh-200px)] bg-[#171717]">
                    {/* Left Sidebar - Character Thumbnails */}
                    <div className="w-72 shrink-0 border-r border-[#333333] p-4 flex flex-col h-full">
                      <div className="flex items-center justify-between mb-4 shrink-0">
                        <h2 className="text-lg font-bold text-white">
                          Characters
                        </h2>
                        <button
                          onClick={() => {
                            // TODO: Implement add character functionality
                          }}
                          className="text-[#AB79FF] transition-colors font-fm-poppins text-fm-lg font-bold flex items-center gap-1"
                        >
                          <PlusIcon />
                          ADD
                        </button>
                      </div>
                      <div className="space-y-3 flex-1 overflow-y-auto min-h-0">
                        {displayCharacters.map((character) => {
                          const isSelected =
                            selectedCharacter?.id === character.id;
                          return (
                            <button
                              key={character.id}
                              onClick={() => setSelectedCharacter(character)}
                              className={cn(
                                "w-full group relative overflow-hidden rounded-lg border-2 transition-all duration-200",
                                isSelected
                                  ? "border-[#833AFF] shadow-lg shadow-[#833AFF]/20"
                                  : "border-[#333333] hover:border-[#833AFF]"
                              )}
                            >
                              <div className="aspect-square relative bg-[#2A2A2A]">
                                {character.close_up ? (
                                  <Image
                                    src={getImageUrl(character.close_up)}
                                    alt={`${character.name} - close up`}
                                    fill
                                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                                    sizes="(max-width: 128px) 100vw, 128px"
                                    unoptimized
                                  />
                                ) : character.front_view &&
                                  character.back_view ? (
                                  <div className="flex h-full">
                                    <div className="relative w-1/2 h-full">
                                      <Image
                                        src={getImageUrl(character.front_view)}
                                        alt={`${character.name} - front view`}
                                        fill
                                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                                        sizes="(max-width: 128px) 100vw, 128px"
                                        unoptimized
                                      />
                                    </div>
                                    <div className="w-px bg-[#333333]" />
                                    <div className="relative w-1/2 h-full">
                                      <Image
                                        src={getImageUrl(character.back_view)}
                                        alt={`${character.name} - back view`}
                                        fill
                                        className="object-cover transition-transform duration-200 group-hover:scale-105"
                                        sizes="(max-width: 128px) 100vw, 128px"
                                        unoptimized
                                      />
                                    </div>
                                  </div>
                                ) : character.image ? (
                                  <Image
                                    src={getImageUrl(character.image)}
                                    alt={character.name}
                                    fill
                                    className="object-cover transition-transform duration-200 group-hover:scale-105"
                                    sizes="(max-width: 128px) 100vw, 128px"
                                    unoptimized
                                  />
                                ) : (
                                  <div className="flex h-full items-center justify-center">
                                    <p className="text-[#888888] text-xs">
                                      No image
                                    </p>
                                  </div>
                                )}
                              </div>
                              <div className="absolute inset-0 bg-linear-to-t from-black/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-200" />
                              <div className="absolute bottom-0 left-0 right-0 p-2">
                                <p className="inline-block z-10 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-xs font-semibold text-white">
                                  {character.name}
                                </p>
                              </div>
                              {isSelected && (
                                <div className="absolute top-2 right-2 w-3 h-3 bg-[#833AFF] rounded-full border-2 border-white shadow-lg" />
                              )}
                            </button>
                          );
                        })}
                      </div>
                    </div>

                    {/* Right Side - Main Character View */}
                    <div className="flex-1 flex flex-col rounded-lg overflow-hidden h-full">
                      {selectedCharacter ? (
                        <>
                          {/* Character Name and Description */}
                          <div className="p-6 pt-3 border-b border-[#333333] shrink-0">
                            <div className="flex items-center justify-between mb-4">
                              <p className="text-2xl font-bold text-white font-fm-poppins">
                                {selectedCharacter.name}
                              </p>
                              <div className="flex items-center gap-3">
                                <button
                                  onClick={() => {
                                    // TODO: Implement delete functionality
                                  }}
                                  className="p-2 rounded-lg hover:bg-[#333333] transition-colors"
                                  aria-label="Delete character"
                                >
                                  <Trash />
                                </button>
                                <button
                                  onClick={() => {
                                    // TODO: Implement edit functionality
                                  }}
                                  className="p-2 rounded-lg hover:bg-[#333333] transition-colors"
                                  aria-label="Edit character"
                                >
                                  <Pencil />
                                </button>
                              </div>
                            </div>
                            {selectedCharacter.description && (
                              <div>
                                <p className="text-fm-sm text-[#AB79FF] mb-2 font-fm-poppins tracking-wider">
                                  DESCRIPTION:
                                </p>
                                <p className="text-sm text-white font-fm-poppins">
                                  {selectedCharacter.description}
                                </p>
                              </div>
                            )}
                          </div>

                          {/* Main Image Display - All 3 views */}
                          <div className="flex-1 flex flex-col p-6 relative overflow-hidden min-h-0">
                            <div className="flex-1 w-full flex gap-4 items-center justify-center min-h-0">
                              {/* Close Up View */}
                              {selectedCharacter.close_up ? (
                                <div className="flex-1 h-full max-h-full relative rounded-lg overflow-hidden bg-gray-200">
                                  <div className="absolute top-2 left-2 z-10 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-xs font-semibold text-white">
                                    Close Up
                                  </div>
                                  <Image
                                    src={getImageUrl(
                                      selectedCharacter.close_up
                                    )}
                                    alt={`${selectedCharacter.name} - close up`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 400px) 100vw, 400px"
                                    priority
                                    unoptimized
                                  />
                                </div>
                              ) : (
                                <div className="flex-1 h-full max-h-full relative rounded-lg overflow-hidden bg-gray-200">
                                  <div className="absolute top-2 left-2 z-10 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-xs font-semibold text-white">
                                    Close Up
                                  </div>
                                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                    <p className="text-gray-500 text-sm">
                                      No close up available
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Front View */}
                              {selectedCharacter.front_view ? (
                                <div className="flex-1 h-full max-h-full relative rounded-lg overflow-hidden bg-gray-200">
                                  <div className="absolute top-2 left-2 z-10 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-xs font-semibold text-white">
                                    Front
                                  </div>
                                  <Image
                                    src={getImageUrl(
                                      selectedCharacter.front_view
                                    )}
                                    alt={`${selectedCharacter.name} - front view`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 400px) 100vw, 400px"
                                    unoptimized
                                  />
                                </div>
                              ) : (
                                <div className="flex-1 h-full max-h-full relative rounded-lg overflow-hidden bg-gray-200">
                                  <div className="absolute top-2 left-2 z-10 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-xs font-semibold text-white">
                                    Front
                                  </div>
                                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                    <p className="text-gray-500 text-sm">
                                      No front view available
                                    </p>
                                  </div>
                                </div>
                              )}

                              {/* Back View */}
                              {selectedCharacter.back_view ? (
                                <div className="flex-1 h-full max-h-full relative rounded-lg overflow-hidden bg-gray-200">
                                  <div className="absolute top-2 left-2 z-10 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-xs font-semibold text-white">
                                    Back
                                  </div>
                                  <Image
                                    src={getImageUrl(
                                      selectedCharacter.back_view
                                    )}
                                    alt={`${selectedCharacter.name} - back view`}
                                    fill
                                    className="object-cover"
                                    sizes="(max-width: 400px) 100vw, 400px"
                                    unoptimized
                                  />
                                </div>
                              ) : (
                                <div className="flex-1 h-full max-h-full relative rounded-lg overflow-hidden bg-gray-200">
                                  <div className="absolute top-2 left-2 z-10 px-2 py-1 rounded-md bg-black/70 backdrop-blur-sm text-xs font-semibold text-white">
                                    Back
                                  </div>
                                  <div className="w-full h-full bg-gray-300 flex items-center justify-center">
                                    <p className="text-gray-500 text-sm">
                                      No back view available
                                    </p>
                                  </div>
                                </div>
                              )}
                            </div>
                          </div>
                        </>
                      ) : (
                        <div className="flex items-center justify-center h-full">
                          <p className="text-lg text-white">
                            Select a character to view
                          </p>
                        </div>
                      )}
                    </div>
                  </div>
                )}
            </div>
          ) : (
            <p className="text-[#E0E0E0] text-sm">
              Please select a style first to create a character description
              sheet.
            </p>
          )}
        </div>

        {/* Get Character Sheet Button - Only show when characters are available */}
        {hasCharactersWithImages && displayCharacters.length > 0 && taskId && (
          <button
            onClick={async () => {
              if (!taskId) {
                toast.error("Task ID is missing");
                return;
              }
              try {
                const response = await getCharacterSheet({
                  taskId,
                  generateType: "characters",
                });
                if (response?.spreadsheet_url && response?.task_id) {
                  // Call the callback to set the spreadsheet URL with task_id
                  onSheetCreated?.(response.spreadsheet_url, response.task_id);
                  toast.success("Character sheet created successfully");
                }
              } catch (err) {
                toast.error(
                  err instanceof Error
                    ? err.message
                    : "Failed to get character sheet"
                );
              }
            }}
            disabled={isGettingSheet || !taskId}
            className={cn(
              "w-full flex gap-2 items-center justify-center rounded-xl py-3.5 px-3 transition-all duration-200 relative group cursor-pointer bg-[#833AFF] font-poppins text-sm font-bold tracking-wider text-nowrap mt-4",
              (isGettingSheet || !taskId) && "opacity-50 cursor-not-allowed"
            )}
          >
            {isGettingSheet ? (
              <>
                <svg
                  className="animate-spin h-4 w-4 text-white"
                  xmlns="http://www.w3.org/2000/svg"
                  fill="none"
                  viewBox="0 0 24 24"
                >
                  <circle
                    className="opacity-25"
                    cx="12"
                    cy="12"
                    r="10"
                    stroke="currentColor"
                    strokeWidth="4"
                  ></circle>
                  <path
                    className="opacity-75"
                    fill="currentColor"
                    d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"
                  ></path>
                </svg>
                Loading...
              </>
            ) : (
              "Get Character Description Sheet"
            )}
          </button>
        )}
      </div>
    </div>
  );
}
