export default function Heading({
  heading,
  subHeading,
}: {
  heading: string;
  subHeading: string;
}) {
  return (
    <div className="mb-8 relative">
      <div className="flex items-start gap-4">
        {/* Decorative accent line */}
        <div className="flex-1 space-y-2">
          <h1 className="text-3xl font-bold text-fm-secondary-700 tracking-tight">
            {heading}
          </h1>
          <p className="text-sm text-fm-secondary leading-relaxed max-w-2xl">
            {subHeading}
          </p>
        </div>
      </div>

      {/* Subtle bottom border */}
      <div className="mt-6 h-px bg-linear-to-r from-transparent via-fm-divider-primary to-transparent" />
    </div>
  );
}
