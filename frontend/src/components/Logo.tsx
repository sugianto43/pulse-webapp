import { useId } from "react";

export default function Logo({
  className = "h-7 w-7",
  gradient = false,
}: {
  className?: string;
  gradient?: boolean;
}) {
  const gradientId = useId();

  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      {gradient ? (
        <>
          <rect width="32" height="32" rx="9" fill={`url(#${gradientId})`} />
          <defs>
            <linearGradient
              id={gradientId}
              x1="0"
              y1="0"
              x2="32"
              y2="32"
              gradientUnits="userSpaceOnUse"
            >
              <stop stopColor="#10b981" />
              <stop offset="0.5" stopColor="#3b82f6" />
              <stop offset="1" stopColor="#a855f7" />
            </linearGradient>
          </defs>
        </>
      ) : (
        <rect width="32" height="32" rx="9" className="fill-black dark:fill-zinc-50" />
      )}
      <rect
        x="8"
        y="18"
        width="3.5"
        height="7"
        rx="1.75"
        className={gradient ? "fill-white" : "fill-white dark:fill-black"}
      />
      <rect
        x="14.25"
        y="12"
        width="3.5"
        height="13"
        rx="1.75"
        className={gradient ? "fill-white" : "fill-white dark:fill-black"}
      />
      <rect
        x="20.5"
        y="7"
        width="3.5"
        height="18"
        rx="1.75"
        className={gradient ? "fill-white" : "fill-white dark:fill-black"}
      />
    </svg>
  );
}
