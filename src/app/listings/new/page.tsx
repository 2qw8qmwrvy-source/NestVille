import type { Metadata } from "next";
import { requireSession } from "@/lib/dal";
import { createListing } from "@/lib/actions/listings";
import ListingForm from "@/components/listing-form";

export const metadata: Metadata = {
  title: "Post a rental",
};

export default async function NewListingPage() {
  await requireSession();

  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <span className="inline-flex items-center rounded-full bg-gold-light/30 px-3 py-1 text-xs font-semibold uppercase tracking-wide text-garnet-dark">
          Post a listing
        </span>
        <h1 className="mt-3 text-3xl font-bold tracking-tight">Tell students about your place</h1>
        <p className="mt-2 text-muted">
          Share the details students will want to know before reaching out. Takes about
          two minutes, and you can edit anytime.
        </p>
      </div>

      <ListingForm action={createListing} submitLabel="Publish listing" cancelHref="/listings" />
    </div>
  );
}
