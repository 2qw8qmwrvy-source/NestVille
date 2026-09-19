export default function RoleBadge({ role }: { role: string }) {
  if (role === "student") {
    return (
      <span className="inline-flex items-center gap-1 rounded-full bg-success/10 px-2.5 py-1 text-xs font-semibold text-success">
        &#10003; Verified Acadia student
      </span>
    );
  }

  return (
    <span className="inline-flex items-center gap-1 rounded-full bg-gold-light/40 px-2.5 py-1 text-xs font-semibold text-garnet-dark">
      Landlord
    </span>
  );
}
