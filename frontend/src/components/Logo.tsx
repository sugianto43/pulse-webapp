export default function Logo({ className = "h-7 w-7" }: { className?: string }) {
  return (
    <svg viewBox="0 0 32 32" fill="none" xmlns="http://www.w3.org/2000/svg" className={className}>
      <rect width="32" height="32" rx="9" fill="#059669" />
      <circle cx="16" cy="16" r="8" stroke="white" strokeWidth="2.2" opacity="0.9" />
      <circle cx="16" cy="16" r="2.6" fill="white" />
    </svg>
  );
}
