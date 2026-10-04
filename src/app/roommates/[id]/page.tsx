import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/dal";
import { deleteRoommatePost } from "@/lib/actions/roommates";
import { ROOMMATE_TYPES } from "@/lib/validation";
import DeleteButton from "@/components/delete-button";
import StarRating from "@/components/star-rating";
import RoleBadge from "@/components/role-badge";
import TrustedBadge from "@/components/trusted-badge";
import ReportButton from "@/components/report-button";
import RoommateCard from "@/components/roommate-card";
import Avatar from "@/components/avatar";
import { isTrustedLandlord } from "@/lib/trust";
import { rankMatches } from "@/lib/matching";

async function getPost(id: string) {
  return db.roommatePost.findUnique({
    where: { id },
    include: { author: { select: { id: true, name: true, email: true, role: true } } },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) return { title: "Post not found" };
  return { title: post.title };
}

export default async function RoommatePostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const post = await getPost(id);
  if (!post) notFound();

  const user = await getCurrentUser();
  const isOwner = user?.id === post.authorId;
  const typeLabel = ROOMMATE_TYPES.find((t) => t.value === post.type)?.label ?? post.type;

  const ratingAgg = await db.rating.aggregate({
    where: { ratedUserId: post.authorId },
    _avg: { score: true },
    _count: true,
  });

  const oppositeType = post.type === "have_room" ? "need_room" : "have_room";
  const candidates = await db.roommatePost.findMany({
    where: { type: oppositeType, authorId: { not: post.authorId } },
    include: { author: { select: { name: true } } },
    take: 50,
  });
  const matches = rankMatches(post, candidates, 3);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <Link href="/roommates" className="text-sm font-medium text-muted hover:text-garnet">
        &larr; Back to roommates
      </Link>

      <div className="mt-4 grid gap-6 md:grid-cols-3">
        <div className="md:col-span-2">
          <span className="rounded-full bg-gold-light/40 px-3 py-1 text-xs font-semibold text-garnet-dark">
            {typeLabel}
          </span>
          <h1 className="mt-3 text-2xl font-bold tracking-tight sm:text-3xl">{post.title}</h1>
          <p className="mt-1 text-muted">
            {post.location ?? "Location not specified"}
            {post.moveInDate
              ? ` · Move in ${post.moveInDate.toLocaleDateString("en-CA", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}`
              : ""}
            {post.moveOutDate
              ? ` – ${post.moveOutDate.toLocaleDateString("en-CA", {
                  month: "long",
                  day: "numeric",
                  year: "numeric",
                })}`
              : ""}
          </p>
          {post.price !== null && (
            <p className="mt-3 text-xl font-bold text-garnet">
              ${post.price.toLocaleString()}
              <span className="text-base font-normal text-muted">/month</span>
            </p>
          )}
          <p className="mt-6 whitespace-pre-line leading-relaxed">{post.description}</p>
        </div>

        <aside className="flex flex-col gap-4">
          <div className="rounded-xl border border-card-border bg-card p-5">
            {isOwner ? (
              <div className="flex flex-col gap-2">
                <Link
                  href={`/roommates/${post.id}/edit`}
                  className="rounded-full border border-garnet px-4 py-2 text-center text-sm font-semibold text-garnet transition hover:bg-garnet hover:text-white"
                >
                  Edit post
                </Link>
                <DeleteButton action={deleteRoommatePost.bind(null, post.id)} label="Delete post" />
              </div>
            ) : user ? (
              <a
                href={`mailto:${post.author.email}?subject=${encodeURIComponent(
                  `NestVille: ${post.title}`
                )}`}
                className="block rounded-full bg-garnet px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-garnet-dark"
              >
                Email {post.author.name.split(" ")[0]}
              </a>
            ) : (
              <Link
                href={`/login?next=/roommates/${post.id}`}
                className="block rounded-full bg-garnet px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-garnet-dark"
              >
                Log in to contact poster
              </Link>
            )}
          </div>

          <div className="rounded-xl border border-card-border bg-card p-5 text-sm text-muted">
            <div className="flex items-center gap-3">
              <Avatar name={post.author.name} size="sm" />
              <Link
                href={`/users/${post.author.id}`}
                className="font-semibold text-foreground hover:text-garnet hover:underline"
              >
                Posted by {post.author.name}
              </Link>
            </div>
            <div className="mt-2 flex flex-wrap gap-1.5">
              <RoleBadge role={post.author.role} />
              {isTrustedLandlord(post.author.role, ratingAgg._avg.score ?? 0, ratingAgg._count) && (
                <TrustedBadge />
              )}
            </div>
            <div className="mt-1.5">
              <StarRating average={ratingAgg._avg.score ?? 0} count={ratingAgg._count} size="sm" />
            </div>
            <p className="mt-3">Meet in a public place first and trust your instincts.</p>
            {user && !isOwner && (
              <div className="mt-3">
                <ReportButton target={{ roommatePostId: post.id }} label="Report this post" />
              </div>
            )}
          </div>
        </aside>
      </div>

      {matches.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold tracking-tight">
            {oppositeType === "have_room" ? "Rooms that might fit" : "People who might fit"}
          </h2>
          <p className="mt-1 text-sm text-muted">
            Ranked by budget, location, and move-in dates in common with this post.
          </p>
          <div className="mt-4 grid grid-cols-1 gap-4 sm:grid-cols-3">
            {matches.map((m) => (
              <RoommateCard
                key={m.post.id}
                post={m.post}
                matchScore={m.score}
                matchReasons={m.reasons}
              />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
