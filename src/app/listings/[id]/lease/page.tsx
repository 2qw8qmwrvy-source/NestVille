import type { Metadata } from "next";
import Link from "next/link";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/dal";
import LeaseWorksheet from "@/components/lease-worksheet";

export const metadata: Metadata = {
  title: "Lease summary tool",
};

export default async function LeaseWorksheetPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireSession();

  const listing = await db.listing.findUnique({
    where: { id },
    include: { author: { select: { id: true, name: true } } },
  });
  if (!listing) notFound();
  if (listing.authorId !== session.userId) redirect(`/listings/${id}`);

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <Link
        href={`/listings/${listing.id}`}
        className="text-sm font-medium text-muted hover:text-garnet print:hidden"
      >
        &larr; Back to listing
      </Link>

      <h1 className="mt-4 text-2xl font-bold tracking-tight">Lease summary tool</h1>
      <p className="mt-1 text-sm text-muted">
        Pre-filled from &ldquo;{listing.title}&rdquo;. Edit anything below, then generate a
        printable summary.
      </p>

      <div className="mt-8">
        <LeaseWorksheet
          listing={{
            title: listing.title,
            address: listing.address,
            price: listing.price,
            bedrooms: listing.bedrooms,
            bathrooms: listing.bathrooms,
            availableFrom: listing.availableFrom.toISOString(),
            furnished: listing.furnished,
            petsAllowed: listing.petsAllowed,
            utilitiesIncluded: listing.utilitiesIncluded,
            parking: listing.parking,
            laundry: listing.laundry,
            landlordName: listing.author.name,
          }}
        />
      </div>
    </div>
  );
}
