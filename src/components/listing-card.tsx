import Link from "next/link";

type ListingCardData = {
  id: string;
  title: string;
  address: string;
  neighborhood: string | null;
  price: number;
  bedrooms: number;
  bathrooms: number;
  propertyType: string;
  status: string;
  images: { url: string }[];
};

export default function ListingCard({ listing }: { listing: ListingCardData }) {
  const image = listing.images[0]?.url;

  return (
    <Link
      href={`/listings/${listing.id}`}
      className="group flex flex-col overflow-hidden rounded-xl border border-card-border bg-card transition hover:-translate-y-0.5 hover:shadow-md"
    >
      <div className="relative aspect-[4/3] w-full overflow-hidden bg-card-border">
        {image ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={image}
            alt={listing.title}
            className="h-full w-full object-cover transition group-hover:scale-105"
          />
        ) : (
          <div className="flex h-full w-full items-center justify-center text-sm text-muted">
            No photo yet
          </div>
        )}
        {listing.status === "rented" && (
          <span className="absolute left-2 top-2 rounded-full bg-foreground/80 px-3 py-1 text-xs font-semibold text-background">
            Rented
          </span>
        )}
      </div>
      <div className="flex flex-1 flex-col gap-1 p-4">
        <div className="flex items-start justify-between gap-2">
          <h3 className="font-semibold leading-snug">{listing.title}</h3>
          <span className="whitespace-nowrap font-semibold text-garnet">
            ${listing.price.toLocaleString()}/mo
          </span>
        </div>
        <p className="text-sm text-muted">{listing.neighborhood ?? listing.address}</p>
        <p className="mt-auto pt-2 text-sm text-muted">
          {listing.bedrooms} bed &middot; {listing.bathrooms} bath &middot; {listing.propertyType}
        </p>
      </div>
    </Link>
  );
}
