export default function Loading({
  text,
  isGenerating = true,
  className,
}: {
  text: string;
  isGenerating?: boolean;
  className?: string;
}) {
  return (
    <div className={`flex items-center justify-center h-96 ${className}`}>
      <div className="flex flex-col items-center gap-4">
        <div className="animate-pulse">
          <div className="w-12 h-12 bg-fm-primary/40 rounded-full flex items-center justify-center">
            <div className="w-6 h-6 border-2 border-fm-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>
        <p className="text-fm-primary text-lg">
          {isGenerating ? "Generating" : "Fetching"} {text}...
        </p>
        <p className="text-fm-secondary text-sm">
          We are generating best results for you. This may take some time
        </p>
      </div>
    </div>
  );
}
