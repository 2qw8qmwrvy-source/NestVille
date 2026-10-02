export default function TrustedBadge() {
  return (
    <span className="inline-flex items-center gap-1 rounded-full border border-card-border px-2.5 py-1 text-xs font-medium text-muted">
      <svg viewBox="0 0 20 20" fill="none" className="h-3 w-3" aria-hidden="true">
        <path
          d="M4 10.5L8 14.5L16 5.5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
      Trusted landlord
    </span>
  );
}
