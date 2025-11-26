import Heading from "@/components/heading";
import Loading from "@/components/loading";
import fetchScenes from "@/server/queries/fetch-scenes";
import { useParams } from "next/navigation";
import { useEffect, useState } from "react";
import { toast } from "sonner";

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

export default function Scenes() {
  const [scenes, setScenes] = useState<ScenesData>({});
  const [loading, setLoading] = useState(true);
  const params = useParams() as { id: string };

  useEffect(() => {
    const getScenes = async () => {
      setLoading(true);
      try {
        const res = await fetchScenes(params.id);
        setScenes(res.beats || {});
        toast.info(res.message);
      } finally {
        setLoading(false);
      }
    };
    getScenes();
  }, [params.id]);

  if (loading) {
    return <Loading text="scenes" />;
  }

  if (Object.keys(scenes).length === 0) {
    return (
      <div className="flex items-center justify-center h-96">
        <p className="text-fm-primary text-lg">No beats found.</p>
      </div>
    );
  }

  return (
    <div>
      <Heading
        heading="Story Scenes"
        subHeading="Review each scene and add new scenes to continue your story"
      />
      <div className="space-y-8">
        {Object.entries(scenes).map(([episodeName, episodeScenes]) => (
          <div key={episodeName} className="space-y-5">
            <h2 className="text-lg font-bold text-fm-primary-600 border-b-2 border-fm-primary-500 pb-2">
              {episodeName}
            </h2>
            <div className="grid grid-cols-3 gap-4">
              {episodeScenes.map((scene, index) => (
                <div
                  key={index}
                  className="bg-fm-surface-secondary border border-fm-divider-primary rounded-lg p-5 shadow-sm hover:shadow-md transition-shadow space-y-3"
                >
                  <div className="flex items-center gap-3">
                    <div className="bg-fm-primary-500 text-fm-neutral-1100 font-bold text-sm px-3 py-1 rounded-md">
                      Scene #{scene.beat_number}
                    </div>
                  </div>
                  <div className="space-y-2.5">
                    <div>
                      <span className="font-bold text-fm-label-primary text-sm uppercase tracking-wide">
                        Description:
                      </span>
                      <p className="text-fm-primary mt-1.5 leading-relaxed">
                        {scene.scene_description}
                      </p>
                    </div>
                    <div>
                      <span className="font-bold text-fm-blue-500 text-sm uppercase tracking-wide">
                        Characters:
                      </span>
                      <p className="text-fm-primary mt-1.5 font-medium">
                        {scene.characters}
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
