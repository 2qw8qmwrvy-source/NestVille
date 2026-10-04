import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/dal";
import { updateListing } from "@/lib/actions/listings";
import ListingForm from "@/components/listing-form";

export const metadata: Metadata = {
  title: "Edit listing",
};

export default async function EditListingPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireSession();

  const listing = await db.listing.findUnique({
    where: { id },
    include: { images: { orderBy: { position: "asc" } } },
  });

  if (!listing) notFound();
  if (listing.authorId !== session.userId) redirect(`/listings/${id}`);

  const action = updateListing.bind(null, id);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <span className="inline-flex items-center rounded-full bg-gold-light/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-garnet-dark">
          Edit listing
        </span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Update {listing.title}</h1>
        <p className="mt-2 text-muted">Keep the details current so students know what to expect.</p>
      </div>

      <ListingForm
        action={action}
        submitLabel="Save changes"
        cancelHref={`/listings/${id}`}
        defaults={{
          title: listing.title,
          description: listing.description,
          address: listing.address,
          neighborhood: listing.neighborhood ?? undefined,
          price: listing.price,
          bedrooms: listing.bedrooms,
          bathrooms: listing.bathrooms,
          propertyType: listing.propertyType,
          availableFrom: listing.availableFrom.toISOString().slice(0, 10),
          leaseLength: listing.leaseLength ?? undefined,
          furnished: listing.furnished,
          petsAllowed: listing.petsAllowed,
          utilitiesIncluded: listing.utilitiesIncluded,
          parking: listing.parking,
          laundry: listing.laundry,
          images: listing.images.map((i) => i.url),
        }}
      />
    </div>
  );
}
