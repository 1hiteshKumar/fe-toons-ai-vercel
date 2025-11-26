import React from "react";

export default function Heading({
  heading,
  subHeading,
  rightElement,
}: {
  heading: string;
  subHeading: string;
  rightElement?: React.ReactNode;
}) {
  return (
    <div className="mb-8 relative">
      <div className="flex items-start gap-4 justify-between">
        {/* Decorative accent line */}
        <div className="flex-1 space-y-2">
          <h1 className="text-3xl font-bold text-fm-secondary-700 tracking-tight">
            {heading}
          </h1>
          <p className="text-sm text-fm-secondary leading-relaxed max-w-2xl">
            {subHeading}
          </p>
        </div>
        {rightElement && (
          <div className="flex items-center">{rightElement}</div>
        )}
      </div>

      {/* Subtle bottom border */}
      <div className="mt-6 h-px bg-linear-to-r from-transparent via-fm-divider-primary to-transparent" />
    </div>
  );
}
