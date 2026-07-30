import { useId } from "react";

export default function Logo({ className = "h-7 w-7" }: { className?: string }) {
  // Unique per instance — this component renders more than once per page
  // (Navbar + page hero), and SVG gradient ids must be unique in the DOM.
  const gradientId = useId();

  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <circle cx="16" cy="16" r="15" fill="#09090b" />
      <path
        d="M16 16 L16 4 A12 12 0 0 1 26.39 21.86 Z"
        fill={`url(#${gradientId})`}
        opacity="0.6"
      />
      <circle cx="16" cy="16" r="11" stroke="#10b981" strokeWidth="1.4" opacity="0.55" />
      <circle cx="16" cy="16" r="6.5" stroke="#10b981" strokeWidth="1.4" opacity="0.8" />
      <circle cx="16" cy="16" r="2.4" fill="#10b981" />
      <defs>
        <linearGradient
          id={gradientId}
          x1="16"
          y1="16"
          x2="26"
          y2="10"
          gradientUnits="userSpaceOnUse"
        >
          <stop stopColor="#10b981" />
          <stop offset="1" stopColor="#10b981" stopOpacity="0" />
        </linearGradient>
      </defs>
    </svg>
  );
}
