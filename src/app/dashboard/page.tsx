import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/dal";
import ListingCard from "@/components/listing-card";
import RoommateCard from "@/components/roommate-card";
import StarRating from "@/components/star-rating";

export const metadata: Metadata = {
  title: "Dashboard",
};

export default async function DashboardPage() {
  const session = await requireSession();

  const [user, myListings, myRoommatePosts, favorites] = await Promise.all([
    db.user.findUnique({ where: { id: session.userId }, select: { name: true, email: true } }),
    db.listing.findMany({
      where: { authorId: session.userId },
      orderBy: { createdAt: "desc" },
      include: { images: { orderBy: { position: "asc" }, take: 1 } },
    }),
    db.roommatePost.findMany({
      where: { authorId: session.userId },
      orderBy: { createdAt: "desc" },
      include: { author: { select: { name: true } } },
    }),
    db.favorite.findMany({
      where: { userId: session.userId },
      orderBy: { createdAt: "desc" },
      include: {
        listing: { include: { images: { orderBy: { position: "asc" }, take: 1 } } },
      },
    }),
  ]);

  const ratingAgg = await db.rating.aggregate({
    where: { ratedUserId: session.userId },
    _avg: { score: true },
    _count: true,
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="flex flex-wrap items-center justify-between gap-3">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Welcome, {user?.name}</h1>
          <p className="mt-1 text-muted">{user?.email}</p>
        </div>
        <Link
          href={`/users/${session.userId}`}
          className="rounded-full border border-card-border px-4 py-2 text-sm font-semibold transition hover:border-garnet hover:text-garnet"
        >
          View your public profile
        </Link>
      </div>
      <div className="mt-2">
        <StarRating average={ratingAgg._avg.score ?? 0} count={ratingAgg._count} />
      </div>

      <Section
        title="Your listings"
        action={
          <Link href="/listings/new" className="text-sm font-semibold text-garnet hover:underline">
            + New listing
          </Link>
        }
      >
        {myListings.length === 0 ? (
          <EmptyState>
            You haven&apos;t posted any rentals yet.{" "}
            <Link href="/listings/new" className="font-semibold text-garnet hover:underline">
              Post one
            </Link>
            .
          </EmptyState>
        ) : (
          <Grid>
            {myListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </Grid>
        )}
      </Section>

      <Section
        title="Your roommate posts"
        action={
          <Link href="/roommates/new" className="text-sm font-semibold text-garnet hover:underline">
            + New post
          </Link>
        }
      >
        {myRoommatePosts.length === 0 ? (
          <EmptyState>
            You haven&apos;t posted to the roommate board yet.{" "}
            <Link href="/roommates/new" className="font-semibold text-garnet hover:underline">
              Post one
            </Link>
            .
          </EmptyState>
        ) : (
          <Grid>
            {myRoommatePosts.map((post) => (
              <RoommateCard key={post.id} post={post} />
            ))}
          </Grid>
        )}
      </Section>

      <Section title="Saved listings">
        {favorites.length === 0 ? (
          <EmptyState>
            You haven&apos;t saved any listings yet. Tap &ldquo;Save listing&rdquo; on a
            rental you like.
          </EmptyState>
        ) : (
          <Grid>
            {favorites.map((fav) => (
              <ListingCard key={fav.id} listing={fav.listing} />
            ))}
          </Grid>
        )}
      </Section>
    </div>
  );
}

function Section({
  title,
  action,
  children,
}: {
  title: string;
  action?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-10">
      <div className="mb-4 flex items-center justify-between">
        <h2 className="text-xl font-bold tracking-tight">{title}</h2>
        {action}
      </div>
      {children}
    </section>
  );
}

function Grid({ children }: { children: React.ReactNode }) {
  return <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">{children}</div>;
}

function EmptyState({ children }: { children: React.ReactNode }) {
  return (
    <div className="rounded-xl border border-dashed border-card-border p-6 text-sm text-muted">
      {children}
    </div>
  );
}
