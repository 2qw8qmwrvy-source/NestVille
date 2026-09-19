export default function LibraryBuilding({ className }: { className?: string }) {
  return (
    <svg
      viewBox="0 0 420 360"
      className={className}
      role="img"
      aria-label="Illustration of a columned library building"
    >
      {/* background accents */}
      <rect x="-10" y="120" width="70" height="200" fill="var(--card-border)" opacity="0.5" />
      <polygon points="330,180 385,90 420,180" fill="var(--gold-light)" opacity="0.5" />

      {/* ground */}
      <rect x="0" y="320" width="420" height="40" fill="var(--card-border)" opacity="0.7" />

      {/* building */}
      <polygon points="40,190 210,100 380,190" fill="var(--gold-light)" stroke="var(--garnet-dark)" strokeWidth="4" />
      <rect x="55" y="190" width="310" height="16" fill="var(--garnet-dark)" />
      {[85, 135, 185, 235, 285, 335].map((x) => (
        <rect key={x} x={x} y="206" width="18" height="98" fill="var(--garnet)" />
      ))}
      <rect x="40" y="304" width="340" height="14" fill="var(--garnet-dark)" />

      {/* small tree + lamp for scale/charm */}
      <g fill="var(--garnet-dark)">
        <rect x="393" y="280" width="6" height="40" />
        <circle cx="396" cy="266" r="18" />
        <rect x="18" y="286" width="4" height="34" />
        <circle cx="20" cy="282" r="6" />
      </g>
    </svg>
  );
}
