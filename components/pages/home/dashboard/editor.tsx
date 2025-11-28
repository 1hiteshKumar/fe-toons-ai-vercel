import { Button } from "@/aural/components/ui/button";
import ArrowRightIcon from "@/aural/icons/arrow-right-icon";
import Image from "next/image";

export default function Editor({ onNext }: { onNext: () => void }) {
  return (
    <div className="flex flex-col h-full w-full justify-end">
      <div className="flex justify-end">
        <Button
          onClick={onNext}
          variant="outline"
          rightIcon={<ArrowRightIcon className="text-white" />}
          noise="none"
          className="font-fm-poppins rounded-lg max-w-40"
          innerClassName="rounded-lg"
        >
          Continue
        </Button>{" "}
      </div>
      <div className="flex-1 w-full h-auto relative min-h-0">
        <Image src="/images/editorimage.webp" className="object-contain" alt="Editor" fill preload />
      </div>
    </div>
  );
}
