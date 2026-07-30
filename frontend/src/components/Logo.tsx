export default function Logo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="32" height="32" rx="9" className="fill-black dark:fill-zinc-50" />
      <rect x="8" y="18" width="3.5" height="7" rx="1.75" className="fill-white dark:fill-black" />
      <rect
        x="14.25"
        y="12"
        width="3.5"
        height="13"
        rx="1.75"
        className="fill-white dark:fill-black"
      />
      <rect
        x="20.5"
        y="7"
        width="3.5"
        height="18"
        rx="1.75"
        className="fill-white dark:fill-black"
      />
    </svg>
  );
}
