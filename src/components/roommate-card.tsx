import Link from "next/link";

type RoommatePostCardData = {
  id: string;
  type: string;
  title: string;
  price: number | null;
  location: string | null;
  moveInDate: Date | null;
  author: { name: string };
};

const typeLabel: Record<string, string> = {
  have_room: "Has a room",
  need_room: "Looking for a room",
};

export default function RoommateCard({ post }: { post: RoommatePostCardData }) {
  return (
    <Link
      href={`/roommates/${post.id}`}
      className="flex flex-col gap-2 rounded-xl border border-card-border bg-card p-4 transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="flex items-center justify-between gap-2">
        <span className="rounded-full bg-gold-light/40 px-3 py-1 text-xs font-semibold text-garnet-dark">
          {typeLabel[post.type] ?? post.type}
        </span>
        {post.price !== null && (
          <span className="font-semibold text-garnet">${post.price.toLocaleString()}/mo</span>
        )}
      </div>
      <h3 className="font-semibold leading-snug">{post.title}</h3>
      <p className="text-sm text-muted">
        {post.location ?? "Location not specified"}
        {post.moveInDate
          ? ` · Move in ${post.moveInDate.toLocaleDateString("en-CA", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })}`
          : ""}
      </p>
      <p className="text-sm text-muted">Posted by {post.author.name}</p>
    </Link>
  );
}
