import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import ListingCard from "@/components/listing-card";
import { NEIGHBORHOODS, PROPERTY_TYPES, LEASE_LENGTHS } from "@/lib/validation";
import type { Prisma } from "@/generated/prisma/client";

export const metadata: Metadata = {
  title: "Browse rentals",
};

type SearchParams = {
  q?: string;
  minPrice?: string;
  maxPrice?: string;
  bedrooms?: string;
  propertyType?: string;
  neighborhood?: string;
  leaseLength?: string;
};

export default async function ListingsPage({
  searchParams,
}: {
  searchParams: Promise<SearchParams>;
}) {
  const params = await searchParams;

  const where: Prisma.ListingWhereInput = {
    status: "active",
  };

  if (params.q) {
    where.OR = [
      { title: { contains: params.q } },
      { description: { contains: params.q } },
      { address: { contains: params.q } },
      { neighborhood: { contains: params.q } },
    ];
  }
  if (params.minPrice) {
    where.price = { ...(where.price as object), gte: Number(params.minPrice) };
  }
  if (params.maxPrice) {
    where.price = { ...(where.price as object), lte: Number(params.maxPrice) };
  }
  if (params.bedrooms) {
    where.bedrooms = { gte: Number(params.bedrooms) };
  }
  if (params.propertyType) {
    where.propertyType = params.propertyType;
  }
  if (params.neighborhood) {
    where.neighborhood = params.neighborhood;
  }
  if (params.leaseLength) {
    where.leaseLength = params.leaseLength;
  }

  const listings = await db.listing.findMany({
    where,
    orderBy: { createdAt: "desc" },
    include: { images: { orderBy: { position: "asc" }, take: 1 } },
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight">Rentals in Wolfville</h1>
        <p className="mt-1 text-muted">{listings.length} active listing{listings.length === 1 ? "" : "s"}</p>
      </div>

      <form
        method="get"
        className="mb-8 grid grid-cols-2 gap-3 rounded-xl border border-card-border bg-card p-4 sm:grid-cols-3 lg:grid-cols-6"
      >
        <input
          type="text"
          name="q"
          defaultValue={params.q}
          placeholder="Keyword"
          className="col-span-2 rounded-lg border border-card-border bg-background px-3 py-2 text-sm outline-none focus:border-garnet sm:col-span-1"
        />
        <input
          type="number"
          name="minPrice"
          defaultValue={params.minPrice}
          placeholder="Min $"
          className="rounded-lg border border-card-border bg-background px-3 py-2 text-sm outline-none focus:border-garnet"
        />
        <input
          type="number"
          name="maxPrice"
          defaultValue={params.maxPrice}
          placeholder="Max $"
          className="rounded-lg border border-card-border bg-background px-3 py-2 text-sm outline-none focus:border-garnet"
        />
        <select
          name="bedrooms"
          defaultValue={params.bedrooms ?? ""}
          className="rounded-lg border border-card-border bg-background px-3 py-2 text-sm outline-none focus:border-garnet"
        >
          <option value="">Any beds</option>
          {[1, 2, 3, 4, 5].map((n) => (
            <option key={n} value={n}>
              {n}+ bed
            </option>
          ))}
        </select>
        <select
          name="propertyType"
          defaultValue={params.propertyType ?? ""}
          className="rounded-lg border border-card-border bg-background px-3 py-2 text-sm outline-none focus:border-garnet"
        >
          <option value="">Any type</option>
          {PROPERTY_TYPES.map((type) => (
            <option key={type} value={type}>
              {type}
            </option>
          ))}
        </select>
        <select
          name="neighborhood"
          defaultValue={params.neighborhood ?? ""}
          className="rounded-lg border border-card-border bg-background px-3 py-2 text-sm outline-none focus:border-garnet"
        >
          <option value="">Any neighborhood</option>
          {NEIGHBORHOODS.map((n) => (
            <option key={n} value={n}>
              {n}
            </option>
          ))}
        </select>
        <select
          name="leaseLength"
          defaultValue={params.leaseLength ?? ""}
          className="col-span-2 rounded-lg border border-card-border bg-background px-3 py-2 text-sm outline-none focus:border-garnet sm:col-span-1"
        >
          <option value="">Any lease length</option>
          {LEASE_LENGTHS.map((l) => (
            <option key={l} value={l}>
              {l}
            </option>
          ))}
        </select>
        <div className="col-span-2 flex gap-2 sm:col-span-3 lg:col-span-1">
          <button
            type="submit"
            className="flex-1 rounded-lg bg-garnet px-4 py-2 text-sm font-semibold text-white transition hover:bg-garnet-dark"
          >
            Apply
          </button>
          <Link
            href="/listings"
            className="flex-1 rounded-lg border border-card-border px-4 py-2 text-center text-sm font-semibold transition hover:border-garnet hover:text-garnet"
          >
            Clear
          </Link>
        </div>
      </form>

      {listings.length === 0 ? (
        <div className="rounded-xl border border-dashed border-card-border p-10 text-center text-muted">
          No listings match your search. Try adjusting your filters.
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {listings.map((listing) => (
            <ListingCard key={listing.id} listing={listing} />
          ))}
        </div>
      )}
    </div>
  );
}
