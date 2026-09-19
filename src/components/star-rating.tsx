export default function StarRating({
  average,
  count,
  size = "md",
}: {
  average: number;
  count: number;
  size?: "sm" | "md";
}) {
  const rounded = Math.round(average);
  const starClass = size === "sm" ? "text-sm" : "text-base";

  if (count === 0) {
    return <span className={`${starClass} text-muted`}>No ratings yet</span>;
  }

  return (
    <span className={`inline-flex items-center gap-1.5 ${starClass}`}>
      <span aria-hidden="true" className="text-gold">
        {"★".repeat(rounded)}
        <span className="text-card-border">{"★".repeat(5 - rounded)}</span>
      </span>
      <span className="text-muted">
        {average.toFixed(1)} ({count} rating{count === 1 ? "" : "s"})
      </span>
    </span>
  );
}
