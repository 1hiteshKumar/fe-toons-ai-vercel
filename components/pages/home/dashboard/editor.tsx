import { Button } from "@/aural/components/ui/button";
import ArrowRightIcon from "@/aural/icons/arrow-right-icon";
import Heading from "@/components/heading";
import Image from "next/image";

export default function Editor({ onNext }: { onNext: () => void }) {
  return (
    <>
      <Heading
        heading="Editor"
        subHeading="Edit your generated shots here before finalizing your story."
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
      <div className="w-full relative h-[500px]">
        <Image
          src="/images/editorimage.webp"
          alt="Editor"
          fill
          className="object-contain"
        />
      </div>{" "}
    </>
  );
}
