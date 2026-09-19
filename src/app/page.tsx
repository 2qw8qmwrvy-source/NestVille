import Link from "next/link";
import Image from "next/image";
import { db } from "@/lib/db";
import ListingCard from "@/components/listing-card";
import WolfvilleStreetscape from "@/components/illustrations/wolfville-streetscape";
import LibraryBuilding from "@/components/illustrations/library-building";

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

        <div className="h-[260px] w-full overflow-hidden sm:h-[320px] lg:h-[380px]">
          <WolfvilleStreetscape className="h-full w-full" />
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
        <div className="mx-auto grid max-w-6xl items-center gap-10 px-4 py-16 sm:px-6 md:grid-cols-2">
          <LibraryBuilding className="w-full max-w-md justify-self-center md:justify-self-start" />

          <div>
            <h2 className="text-3xl font-bold tracking-tight">Built with Wolfville in mind</h2>
            <p className="mt-4 text-muted">
              We built this for the walk between Main Street and campus &mdash; not a
              generic listings site. A few things we designed around:
            </p>
            <ul className="mt-5 flex flex-col gap-3 text-sm">
              <li>
                <span className="font-semibold text-garnet">Lease length that matches the school year.</span>{" "}
                Filter for a 12-month lease, an 8-month school-year lease, or a summer
                sublet.
              </li>
              <li>
                <span className="font-semibold text-garnet">Roommate matching, built in.</span>{" "}
                Have a spare room or need one? Post to the roommate board and connect
                directly.
              </li>
              <li>
                <span className="font-semibold text-garnet">Contact stays private.</span>{" "}
                A poster&apos;s email is only shared with logged-in students, never posted
                publicly.
              </li>
              <li>
                <span className="font-semibold text-garnet">Free to post.</span> Create an
                account and post as many rentals or roommate listings as you need, no
                fees.
              </li>
            </ul>
          </div>
        </div>
      </section>

      <section className="mx-auto w-full max-w-6xl px-4 py-14 sm:px-6">
        <h2 className="text-2xl font-bold tracking-tight">Explore Wolfville</h2>
        <p className="mt-1 text-sm text-muted">
          A few sights you&apos;ll get to know: the walk up to campus and the corner
          shops on Main Street.
        </p>
        <div className="mt-6 grid grid-cols-1 gap-5 sm:grid-cols-2">
          <figure className="overflow-hidden rounded-xl border-t-4 border-garnet bg-card shadow-sm">
            <Image
              src="/images/campus-hall.jpg"
              alt="Illustration of a campus hall near Acadia University"
              width={1365}
              height={768}
              className="h-56 w-full object-cover sm:h-64"
            />
            <figcaption className="p-4 text-sm font-semibold text-garnet-dark">
              The walk up to campus
            </figcaption>
          </figure>
          <figure className="overflow-hidden rounded-xl border-t-4 border-gold bg-card shadow-sm">
            <Image
              src="/images/downtown-wolfville.jpg"
              alt="Illustration of a downtown Wolfville street with shops"
              width={1344}
              height={784}
              className="h-56 w-full object-cover sm:h-64"
            />
            <figcaption className="p-4 text-sm font-semibold text-garnet-dark">
              Main Street, five minutes away
            </figcaption>
          </figure>
        </div>
      </section>
    </div>
  );
}
