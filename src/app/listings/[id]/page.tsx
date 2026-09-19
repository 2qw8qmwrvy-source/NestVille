import type { Metadata } from "next";
import Link from "next/link";
import { notFound } from "next/navigation";
import { db } from "@/lib/db";
import { getCurrentUser } from "@/lib/dal";
import { toggleFavorite, deleteListing, setListingStatus } from "@/lib/actions/listings";
import DeleteButton from "@/components/delete-button";
import StarRating from "@/components/star-rating";
import RoleBadge from "@/components/role-badge";

async function getListing(id: string) {
  return db.listing.findUnique({
    where: { id },
    include: {
      images: { orderBy: { position: "asc" } },
      author: { select: { id: true, name: true, email: true, role: true } },
    },
  });
}

export async function generateMetadata({
  params,
}: {
  params: Promise<{ id: string }>;
}): Promise<Metadata> {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) return { title: "Listing not found" };
  return { title: listing.title };
}

const amenityLabels: { key: "furnished" | "petsAllowed" | "utilitiesIncluded" | "parking" | "laundry"; label: string }[] = [
  { key: "furnished", label: "Furnished" },
  { key: "petsAllowed", label: "Pets allowed" },
  { key: "utilitiesIncluded", label: "Utilities included" },
  { key: "parking", label: "Parking" },
  { key: "laundry", label: "In-unit laundry" },
];

export default async function ListingDetailPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const listing = await getListing(id);
  if (!listing) notFound();

  const user = await getCurrentUser();
  const isOwner = user?.id === listing.authorId;

  const favorite = user
    ? await db.favorite.findUnique({
        where: { userId_listingId: { userId: user.id, listingId: listing.id } },
      })
    : null;

  const activeAmenities = amenityLabels.filter((a) => listing[a.key]);

  const ratingAgg = await db.rating.aggregate({
    where: { ratedUserId: listing.authorId },
    _avg: { score: true },
    _count: true,
  });

  return (
    <div className="mx-auto w-full max-w-5xl px-4 py-10 sm:px-6">
      <Link href="/listings" className="text-sm font-medium text-muted hover:text-garnet">
        &larr; Back to listings
      </Link>

      <div className="mt-4 grid gap-8 lg:grid-cols-3">
        <div className="lg:col-span-2">
          {listing.images.length > 0 ? (
            <div className="grid grid-cols-2 gap-2 overflow-hidden rounded-xl">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={listing.images[0].url}
                alt={listing.title}
                className="col-span-2 aspect-[16/9] w-full object-cover"
              />
              {listing.images.slice(1, 5).map((image) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={image.id}
                  src={image.url}
                  alt={listing.title}
                  className="aspect-[4/3] w-full object-cover"
                />
              ))}
            </div>
          ) : (
            <div className="flex aspect-[16/9] w-full items-center justify-center rounded-xl border border-dashed border-card-border text-muted">
              No photos yet
            </div>
          )}

          <div className="mt-6">
            <div className="flex flex-wrap items-start justify-between gap-2">
              <div>
                <h1 className="text-2xl font-bold tracking-tight sm:text-3xl">{listing.title}</h1>
                <p className="mt-1 text-muted">
                  {listing.address}
                  {listing.neighborhood ? ` · ${listing.neighborhood}` : ""}
                </p>
              </div>
              {listing.status === "rented" && (
                <span className="rounded-full bg-foreground/80 px-3 py-1 text-xs font-semibold text-background">
                  Rented
                </span>
              )}
            </div>

            <div className="mt-4 flex flex-wrap gap-4 text-sm">
              <span className="rounded-full bg-card px-3 py-1.5 font-medium">
                {listing.bedrooms} bed
              </span>
              <span className="rounded-full bg-card px-3 py-1.5 font-medium">
                {listing.bathrooms} bath
              </span>
              <span className="rounded-full bg-card px-3 py-1.5 font-medium">
                {listing.propertyType}
              </span>
              {listing.leaseLength && (
                <span className="rounded-full bg-card px-3 py-1.5 font-medium">
                  {listing.leaseLength}
                </span>
              )}
            </div>

            <p className="mt-6 whitespace-pre-line leading-relaxed">{listing.description}</p>

            {activeAmenities.length > 0 && (
              <div className="mt-6">
                <h2 className="mb-2 font-semibold">Amenities</h2>
                <div className="flex flex-wrap gap-2">
                  {activeAmenities.map((a) => (
                    <span
                      key={a.key}
                      className="rounded-full border border-card-border px-3 py-1 text-sm text-muted"
                    >
                      {a.label}
                    </span>
                  ))}
                </div>
              </div>
            )}
          </div>
        </div>

        <aside className="flex flex-col gap-4">
          <div className="rounded-xl border border-card-border bg-card p-5">
            <p className="text-2xl font-bold text-garnet">
              ${listing.price.toLocaleString()}
              <span className="text-base font-normal text-muted">/month</span>
            </p>
            <p className="mt-1 text-sm text-muted">
              Available {listing.availableFrom.toLocaleDateString("en-CA", {
                month: "long",
                day: "numeric",
                year: "numeric",
              })}
            </p>

            {isOwner ? (
              <div className="mt-4 flex flex-col gap-2">
                <Link
                  href={`/listings/${listing.id}/edit`}
                  className="rounded-full border border-garnet px-4 py-2 text-center text-sm font-semibold text-garnet transition hover:bg-garnet hover:text-white"
                >
                  Edit listing
                </Link>
                <form
                  action={setListingStatus.bind(
                    null,
                    listing.id,
                    listing.status === "active" ? "rented" : "active"
                  )}
                >
                  <button
                    type="submit"
                    className="w-full rounded-full border border-card-border px-4 py-2 text-sm font-semibold transition hover:border-garnet hover:text-garnet"
                  >
                    Mark as {listing.status === "active" ? "rented" : "available"}
                  </button>
                </form>
                <DeleteButton action={deleteListing.bind(null, listing.id)} label="Delete listing" />
              </div>
            ) : (
              <div className="mt-4 flex flex-col gap-2">
                {user ? (
                  <>
                    <a
                      href={`mailto:${listing.author.email}?subject=${encodeURIComponent(
                        `NestVille: ${listing.title}`
                      )}`}
                      className="rounded-full bg-garnet px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-garnet-dark"
                    >
                      Email {listing.author.name.split(" ")[0]}
                    </a>
                    <form action={toggleFavorite.bind(null, listing.id)}>
                      <button
                        type="submit"
                        className="w-full rounded-full border border-card-border px-4 py-2 text-sm font-semibold transition hover:border-garnet hover:text-garnet"
                      >
                        {favorite ? "★ Saved" : "☆ Save listing"}
                      </button>
                    </form>
                  </>
                ) : (
                  <Link
                    href={`/login?next=/listings/${listing.id}`}
                    className="rounded-full bg-garnet px-4 py-2 text-center text-sm font-semibold text-white transition hover:bg-garnet-dark"
                  >
                    Log in to contact poster
                  </Link>
                )}
              </div>
            )}
          </div>

          <div className="rounded-xl border border-card-border bg-card p-5 text-sm text-muted">
            <Link
              href={`/users/${listing.author.id}`}
              className="font-semibold text-foreground hover:text-garnet hover:underline"
            >
              Posted by {listing.author.name}
            </Link>
            <div className="mt-1.5">
              <RoleBadge role={listing.author.role} />
            </div>
            <div className="mt-1.5">
              <StarRating average={ratingAgg._avg.score ?? 0} count={ratingAgg._count} size="sm" />
            </div>
            <p className="mt-3">
              Meet in person before paying anything, and never wire money to someone
              you haven&apos;t met.
            </p>
          </div>
        </aside>
      </div>
    </div>
  );
}
