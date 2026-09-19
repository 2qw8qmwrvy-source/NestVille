import Link from "next/link";
import { db } from "@/lib/db";
import ListingCard from "@/components/listing-card";

export default async function Home() {
  const recentListings = await db.listing.findMany({
    where: { status: "active" },
    orderBy: { createdAt: "desc" },
    take: 6,
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
  });

  return (
    <div className="flex flex-col">
      <section className="border-b border-card-border bg-gradient-to-b from-garnet/5 to-transparent">
        <div className="mx-auto flex max-w-6xl flex-col gap-6 px-4 py-16 sm:px-6 sm:py-24">
          <p className="text-sm font-semibold uppercase tracking-wide text-garnet">
            Wolfville, Nova Scotia
          </p>
          <h1 className="max-w-2xl text-4xl font-bold tracking-tight sm:text-5xl">
            Find your place near Acadia
          </h1>
          <p className="max-w-xl text-lg text-muted">
            Browse rentals and roommate posts shared by fellow Acadia students &mdash;
            apartments, houses, sublets, and shared rooms across Wolfville.
          </p>

          <form action="/listings" className="flex w-full max-w-xl flex-col gap-2 sm:flex-row">
            <input
              type="text"
              name="q"
              placeholder="Search by neighborhood, street, or keyword"
              className="w-full rounded-full border border-card-border bg-card px-5 py-3 text-sm outline-none focus:border-garnet"
            />
            <button
              type="submit"
              className="rounded-full bg-garnet px-6 py-3 text-sm font-semibold text-white transition hover:bg-garnet-dark"
            >
              Search rentals
            </button>
          </form>

          <div className="flex flex-wrap gap-3 pt-2 text-sm">
            <Link
              href="/listings/new"
              className="rounded-full border border-garnet px-5 py-2 font-semibold text-garnet transition hover:bg-garnet hover:text-white"
            >
              Post a rental
            </Link>
            <Link
              href="/roommates"
              className="rounded-full border border-card-border px-5 py-2 font-semibold transition hover:border-garnet hover:text-garnet"
            >
              Find a roommate
            </Link>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <div className="mb-6 flex items-end justify-between">
          <div>
            <h2 className="text-2xl font-bold tracking-tight">Recent listings</h2>
            <p className="text-sm text-muted">Newly posted rentals in and around Wolfville.</p>
          </div>
          <Link href="/listings" className="text-sm font-semibold text-garnet hover:underline">
            View all &rarr;
          </Link>
        </div>

        {recentListings.length === 0 ? (
          <div className="rounded-xl border border-dashed border-card-border p-10 text-center text-muted">
            No listings yet. Be the first to{" "}
            <Link href="/listings/new" className="font-semibold text-garnet hover:underline">
              post a rental
            </Link>
            .
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {recentListings.map((listing) => (
              <ListingCard key={listing.id} listing={listing} />
            ))}
          </div>
        )}
      </section>

      <section className="border-t border-card-border bg-card/60">
        <div className="mx-auto grid max-w-6xl gap-8 px-4 py-14 sm:px-6 md:grid-cols-3">
          <div>
            <h3 className="mb-2 font-semibold text-garnet">Built for students</h3>
            <p className="text-sm text-muted">
              Filter by lease length, so you can find a school-year lease, a summer
              sublet, or a full 12-month term.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-garnet">Roommate matching</h3>
            <p className="text-sm text-muted">
              Have a spare room or need one? Post to the roommate board and connect
              directly with other students.
            </p>
          </div>
          <div>
            <h3 className="mb-2 font-semibold text-garnet">Free to post</h3>
            <p className="text-sm text-muted">
              Create an account and post as many rentals or roommate listings as you
              need, no fees.
            </p>
          </div>
        </div>
      </section>
    </div>
  );
}
