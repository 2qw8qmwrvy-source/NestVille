import type { Metadata } from "next";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/dal";
import StarRating from "@/components/star-rating";
import RatingForm from "@/components/rating-form";
import ListingCard from "@/components/listing-card";
import RoommateCard from "@/components/roommate-card";

async function getProfile(id: string) {
  const user = await db.user.findUnique({
    where: { id },
    select: {
      id: true,
      name: true,
      createdAt: true,
      listings: {
        where: { status: "active" },
        orderBy: { createdAt: "desc" },
        include: { images: { orderBy: { position: "asc" }, take: 1 } },
      },
      roommatePosts: {
        orderBy: { createdAt: "desc" },
        include: { author: { select: { name: true } } },
      },
      ratingsReceived: {
        orderBy: { createdAt: "desc" },
        take: 10,
        include: { rater: { select: { name: true } } },
      },
    },
  });
  if (!user) return null;

  const agg = await db.rating.aggregate({
    where: { ratedUserId: id },
    _avg: { score: true },
    _count: true,
  });

  return { user, average: agg._avg.score ?? 0, count: agg._count };
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const profile = await getProfile(id);
  if (!profile) return { title: "Profile not found" };
  return { title: profile.user.name };
}

export default async function UserProfilePage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const profile = await getProfile(id);
  if (!profile) notFound();

  const { user, average, count } = profile;
  const currentUser = await getCurrentUser();
  const isOwnProfile = currentUser?.id === user.id;

  const existingRating = currentUser
    ? await db.rating.findUnique({
        where: { raterId_ratedUserId: { raterId: currentUser.id, ratedUserId: user.id } },
      })
    : null;

  return (
    <div className="mx-auto w-full max-w-4xl px-4 py-10 sm:px-6">
      <div className="rounded-xl border border-card-border bg-card p-6">
        <div className="flex flex-wrap items-center justify-between gap-3">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">{user.name}</h1>
            <p className="mt-1 text-sm text-muted">
              Member since{" "}
              {user.createdAt.toLocaleDateString("en-CA", { month: "long", year: "numeric" })}
            </p>
          </div>
          <StarRating average={average} count={count} />
        </div>
      </div>

      {currentUser && !isOwnProfile && (
        <div className="mt-6 rounded-xl border border-card-border bg-card p-6">
          <h2 className="text-lg font-bold tracking-tight">Rate {user.name}</h2>
          <p className="mt-1 text-sm text-muted">
            Only rate someone after an actual rental interaction &mdash; a viewing, a
            lease, or a roommate arrangement.
          </p>
          <div className="mt-4">
            <RatingForm
              ratedUserId={user.id}
              ratedUserName={user.name}
              existingScore={existingRating?.score}
              existingComment={existingRating?.comment ?? undefined}
            />
          </div>
        </div>
      )}

      {!currentUser && (
        <p className="mt-6 text-sm text-muted">
          <a href={`/login?next=/users/${user.id}`} className="font-semibold text-garnet hover:underline">
            Log in
          </a>{" "}
          to leave a rating for {user.name}.
        </p>
      )}

      {user.ratingsReceived.length > 0 && (
        <section className="mt-8">
          <h2 className="text-lg font-bold tracking-tight">Recent ratings</h2>
          <ul className="mt-3 flex flex-col gap-3">
            {user.ratingsReceived.map((r) => (
              <li key={r.id} className="rounded-lg border border-card-border bg-card p-4 text-sm">
                <div className="flex items-center justify-between">
                  <span className="font-semibold">{r.rater.name}</span>
                  <span className="text-gold" aria-hidden="true">
                    {"★".repeat(r.score)}
                    <span className="text-card-border">{"★".repeat(5 - r.score)}</span>
                  </span>
                </div>
                {r.comment && <p className="mt-1 text-muted">{r.comment}</p>}
              </li>
            ))}
          </ul>
        </section>
      )}

      {user.listings.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold tracking-tight">Listings by {user.name}</h2>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {user.listings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        </section>
      )}

      {user.roommatePosts.length > 0 && (
        <section className="mt-10">
          <h2 className="text-lg font-bold tracking-tight">Roommate posts by {user.name}</h2>
          <div className="mt-3 grid grid-cols-1 gap-4 sm:grid-cols-2">
            {user.roommatePosts.map((post) => (
              <RoommateCard key={post.id} post={post} />
            ))}
          </div>
        </section>
      )}
    </div>
  );
}
