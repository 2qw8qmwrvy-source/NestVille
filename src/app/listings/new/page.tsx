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
      <h1 className="text-2xl font-bold tracking-tight">Post a rental</h1>
      <p className="mt-1 text-muted">
        Share the details students will want to know before reaching out.
      </p>

      <div className="mt-8">
        <ListingForm action={createListing} submitLabel="Publish listing" />
      </div>
    </div>
  );
}
