import Heading from "@/components/heading";
import Loading from "@/components/loading";
import fetchScenes from "@/server/queries/fetch-scenes";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { Button } from "@/aural/components/ui/button";
import ArrowRightIcon from "@/aural/icons/arrow-right-icon";
import Image from "next/image";
import { convertGoogleDriveUrl } from "@/lib/helpers";
import usePolling from "@/lib/hooks/use-polling";
import { API_URLS } from "@/server/constants";

interface Scene {
  beat_number: number;
  scene_description: string;
  characters: string;
  dialogue?: string;
  thought_bubble?: string;
  setting_environment?: string;
}

type ScenesData = {
  [episodeName: string]: Scene[];
};

interface ScenesResponse {
  beats?: ScenesData;
  message?: string;
}

export default function Scenes({
  onNext,
  characterToAvatarMapping,
}: {
  onNext?: () => void;
  characterToAvatarMapping: Record<string, string>;
}) {
  const [scenes, setScenes] = useState<ScenesData>({});
  const [isLoading, setIsLoading] = useState(true);
  const [isFetchingScenes, setIsFetchingScenes] = useState(true);
  const params = useParams() as { id: string };
  const { poll, stopPolling } = usePolling();

  useEffect(() => {
    const pollingKey = `scenes-${params.id}`;

    const getScenes = async () => {
      setIsLoading(true);
      try {
        const res = await fetchScenes(params.id);
        setScenes(res.beats || {});

        if (res.message === "Beats Generation Completed") {
          setIsLoading(false);
          stopPolling(pollingKey);
        } else if (res.message === "Generating Beats") {
          setIsLoading(true);
          setIsFetchingScenes(false);
          poll({
            url: API_URLS.FETCH_SCENES({ taskId: params.id }),
            pollingKey,
            delay: 2000,
            callback: (data: ScenesResponse | null) => {
              if (data) {
                setScenes(data.beats || {});
                if (data.message === "Beats Generation Completed") {
                  setIsLoading(false);
                  stopPolling(pollingKey);
                }
              }
            },
          });
        } else {
          setIsLoading(false);
        }
      } catch (error) {
        console.error("Error fetching scenes:", error);
        setIsLoading(false);
      }
    };

    getScenes();

    return () => {
      stopPolling(pollingKey);
    };
  }, [params.id, poll, stopPolling]);

  if (isLoading) {
    return <Loading isGenerating={!isFetchingScenes} text="scenes" />;
  }

  if (Object.keys(scenes).length === 0 && !isLoading) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-fm-primary text-lg">No beats found.</p>
      </div>
    );
  }

  return (
    <div>
      <Heading
        heading="Scenes"
        subHeading="Review each scene, characters and pacing of the story"
        rightElement={
          onNext && (
            <Button
              onClick={onNext}
              variant="outline"
              rightIcon={<ArrowRightIcon className="text-white" />}
              noise="none"
              className="font-fm-poppins rounded-lg"
              innerClassName="rounded-lg"
            >
              Continue
            </Button>
          )
        }
      />
      <div className="space-y-8 mt-14">
        {Object.entries(scenes).map(([episodeName, episodeScenes]) => (
          <div key={episodeName} className="space-y-10">
            <h2 className="text-xl font-bold">{episodeName}</h2>
            <div className="grid grid-cols-3 gap-7">
              {episodeScenes.map((scene, index) => (
                <div
                  key={index}
                  className="bg-fm-neutral-0  rounded-2xl p-5 shadow-xl hover:shadow-md transition-shadow space-y-3"
                >
                  <p className="font-bold">Scene {scene.beat_number}</p>

                  <div className="space-y-2.5">
                    <div>
                      <span className="fm-secondary-purple text-sm uppercase tracking-wide">
                        Description:
                      </span>
                      <p className="mt-1.5 leading-relaxed italic h-52 overflow-hidden line-clamp-8">
                        {scene.scene_description}
                      </p>
                    </div>
                    <div>
                      <div className="-mx-5">
                        <hr className="border-t border-fm-neutral-300 w-full" />
                      </div>
                      <p className="font-bold text-sm mt-2 py-2 flex items-center gap-4">
                        {scene.characters
                          ? (() => {
                              const chars = scene.characters
                                .split(",")
                                .map((c) => c.trim());
                              const visible = chars.slice(0, 3);
                              const remaining = chars.length - visible.length;

                              return (
                                <>
                                  {visible.map((c) => {
                                    const avatar = characterToAvatarMapping[c];
                                    return avatar ? (
                                      <span
                                        key={c}
                                        className="flex items-center gap-2"
                                      >
                                        <Image
                                          src={convertGoogleDriveUrl(avatar)}
                                          alt={c}
                                          width={40}
                                          height={40}
                                          className="rounded-[100%] size-10 object-cover"
                                        />
                                        <span>{c}</span>
                                      </span>
                                    ) : null;
                                  })}
                                  {remaining > 0 && <span>+{remaining}</span>}
                                </>
                              );
                            })()
                          : "N/A"}
                      </p>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
