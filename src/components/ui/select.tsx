export default function Select({
  name,
  defaultValue,
  className,
  children,
}: {
  name: string;
  defaultValue?: string;
  className?: string;
  children: React.ReactNode;
}) {
  return (
    <div className={`relative ${className ?? ""}`}>
      <select
        name={name}
        defaultValue={defaultValue ?? ""}
        className="w-full appearance-none rounded-xl border border-card-border bg-background py-2.5 pl-4 pr-9 text-sm outline-none transition focus:border-garnet focus:ring-2 focus:ring-garnet/15"
      >
        {children}
      </select>
      <svg
        className="pointer-events-none absolute right-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted"
        viewBox="0 0 20 20"
        fill="none"
        aria-hidden="true"
      >
        <path
          d="M5 7.5L10 12.5L15 7.5"
          stroke="currentColor"
          strokeWidth="1.7"
          strokeLinecap="round"
          strokeLinejoin="round"
        />
      </svg>
    </div>
  );
}
