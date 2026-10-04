"use client";

import { useActionState, useState } from "react";
import Link from "next/link";
import type { ListingFormState } from "@/lib/actions/listings";
import Select from "@/components/ui/select";
import { NEIGHBORHOODS, PROPERTY_TYPES, LEASE_LENGTHS } from "@/lib/validation";

export type ListingFormDefaults = {
  title?: string;
  description?: string;
  address?: string;
  neighborhood?: string;
  price?: number;
  bedrooms?: number;
  bathrooms?: number;
  propertyType?: string;
  availableFrom?: string;
  leaseLength?: string;
  furnished?: boolean;
  petsAllowed?: boolean;
  utilitiesIncluded?: boolean;
  parking?: boolean;
  laundry?: boolean;
  images?: string[];
};

type ActionFn = (
  state: ListingFormState,
  formData: FormData
) => Promise<ListingFormState>;

const AMENITIES = [
  { key: "furnished", label: "Furnished" },
  { key: "petsAllowed", label: "Pets allowed" },
  { key: "utilitiesIncluded", label: "Utilities included" },
  { key: "parking", label: "Parking" },
  { key: "laundry", label: "In-unit laundry" },
] as const;

export default function ListingForm({
  action,
  defaults,
  submitLabel = "Publish listing",
  cancelHref = "/listings",
}: {
  action: ActionFn;
  defaults?: ListingFormDefaults;
  submitLabel?: string;
  cancelHref?: string;
}) {
  const [state, formAction, pending] = useActionState<ListingFormState, FormData>(
    action,
    undefined
  );

  const errors = state?.errors ?? {};

  const [amenities, setAmenities] = useState<Record<(typeof AMENITIES)[number]["key"], boolean>>({
    furnished: defaults?.furnished ?? false,
    petsAllowed: defaults?.petsAllowed ?? false,
    utilitiesIncluded: defaults?.utilitiesIncluded ?? false,
    parking: defaults?.parking ?? false,
    laundry: defaults?.laundry ?? false,
  });

  const [imagesText, setImagesText] = useState(defaults?.images?.join("\n") ?? "");
  const previewUrls = imagesText
    .split("\n")
    .map((url) => url.trim())
    .filter(Boolean)
    .slice(0, 8);

  return (
    <form
      action={formAction}
      className="rounded-2xl border border-card-border bg-card p-6 shadow-sm sm:p-8"
    >
      {state?.message && (
        <p className="mb-6 rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">
          {state.message}
        </p>
      )}

      <div className="flex flex-col gap-8">
        <Section title="The basics">
          <Field label="Title" error={errors.title?.[0]} full>
            <input
              name="title"
              defaultValue={defaults?.title}
              placeholder="Bright 2-bedroom near Main Street"
              className="input"
            />
          </Field>

          <Field label="Address" error={errors.address?.[0]} full>
            <input
              name="address"
              defaultValue={defaults?.address}
              placeholder="123 Main St, Wolfville, NS"
              className="input"
            />
          </Field>

          <Field label="Neighborhood" error={errors.neighborhood?.[0]}>
            <Select name="neighborhood" defaultValue={defaults?.neighborhood}>
              <option value="">Select neighborhood</option>
              {NEIGHBORHOODS.map((n) => (
                <option key={n} value={n}>
                  {n}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Property type" error={errors.propertyType?.[0]}>
            <Select name="propertyType" defaultValue={defaults?.propertyType}>
              <option value="">Select type</option>
              {PROPERTY_TYPES.map((t) => (
                <option key={t} value={t}>
                  {t}
                </option>
              ))}
            </Select>
          </Field>
        </Section>

        <Section title="Price & lease">
          <Field label="Rent (CAD / month)" error={errors.price?.[0]}>
            <input
              type="number"
              name="price"
              min={0}
              defaultValue={defaults?.price}
              placeholder="900"
              className="input"
            />
          </Field>

          <Field label="Lease length" error={errors.leaseLength?.[0]}>
            <Select name="leaseLength" defaultValue={defaults?.leaseLength}>
              <option value="">Select lease length</option>
              {LEASE_LENGTHS.map((l) => (
                <option key={l} value={l}>
                  {l}
                </option>
              ))}
            </Select>
          </Field>

          <Field label="Bedrooms" error={errors.bedrooms?.[0]}>
            <input
              type="number"
              name="bedrooms"
              min={0}
              defaultValue={defaults?.bedrooms}
              className="input"
            />
          </Field>

          <Field label="Bathrooms" error={errors.bathrooms?.[0]}>
            <input
              type="number"
              name="bathrooms"
              min={0.5}
              step={0.5}
              defaultValue={defaults?.bathrooms}
              className="input"
            />
          </Field>

          <Field label="Available from" error={errors.availableFrom?.[0]} full>
            <input
              type="date"
              name="availableFrom"
              defaultValue={defaults?.availableFrom}
              className="input sm:w-1/2"
            />
          </Field>
        </Section>

        <Section title="Description" grid={false}>
          <Field label="Description" error={errors.description?.[0]} hideLabel>
            <textarea
              name="description"
              defaultValue={defaults?.description}
              rows={6}
              placeholder="Tell students about the unit, the neighborhood, and what's included."
              className="input"
            />
          </Field>
        </Section>

        <Section title="Amenities" grid={false}>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-3">
            {AMENITIES.map((item) => (
              <label
                key={item.key}
                className={`flex cursor-pointer items-center justify-center rounded-xl border px-3 py-2.5 text-center text-sm font-medium transition ${
                  amenities[item.key]
                    ? "border-garnet bg-garnet text-white"
                    : "border-card-border bg-background hover:border-garnet"
                }`}
              >
                <input
                  type="checkbox"
                  name={item.key}
                  checked={amenities[item.key]}
                  onChange={(e) =>
                    setAmenities((a) => ({ ...a, [item.key]: e.target.checked }))
                  }
                  className="sr-only"
                />
                {item.label}
              </label>
            ))}
          </div>
        </Section>

        <Section title="Photos" grid={false}>
          <Field
            label="Photo URLs (one per line, up to 8)"
            error={errors.images?.[0]}
            hint="Paste image links (e.g. from Imgur or Google Photos). Leave blank if you don't have any yet."
          >
            <textarea
              name="images"
              value={imagesText}
              onChange={(e) => setImagesText(e.target.value)}
              rows={4}
              placeholder={"https://example.com/photo1.jpg\nhttps://example.com/photo2.jpg"}
              className="input"
            />
          </Field>

          {previewUrls.length > 0 && (
            <div className="mt-3 grid grid-cols-4 gap-2 sm:grid-cols-6">
              {previewUrls.map((url, i) => (
                // eslint-disable-next-line @next/next/no-img-element
                <img
                  key={`${i}-${url}`}
                  src={url}
                  alt=""
                  className="aspect-square w-full rounded-lg border border-card-border bg-background object-cover"
                  onError={(e) => {
                    e.currentTarget.style.visibility = "hidden";
                  }}
                />
              ))}
            </div>
          )}
        </Section>
      </div>

      <div className="mt-8 flex flex-wrap items-center gap-4 border-t border-card-border pt-6">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-garnet px-6 py-3 text-sm font-semibold text-white transition hover:bg-garnet-dark disabled:opacity-60"
        >
          {pending ? "Saving..." : submitLabel}
        </button>
        <Link href={cancelHref} className="text-sm font-medium text-muted hover:text-garnet">
          Cancel
        </Link>
      </div>
    </form>
  );
}

function Section({
  title,
  grid = true,
  children,
}: {
  title: string;
  grid?: boolean;
  children: React.ReactNode;
}) {
  return (
    <div className="border-t border-card-border pt-8 first:border-t-0 first:pt-0">
      <h2 className="text-xs font-semibold uppercase tracking-wide text-garnet">{title}</h2>
      <div className={grid ? "mt-4 grid gap-4 sm:grid-cols-2" : "mt-4"}>{children}</div>
    </div>
  );
}

function Field({
  label,
  error,
  full,
  hint,
  hideLabel,
  children,
}: {
  label: string;
  error?: string;
  full?: boolean;
  hint?: string;
  hideLabel?: boolean;
  children: React.ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-1 text-sm font-medium ${full ? "sm:col-span-2" : ""}`}>
      {hideLabel ? <span className="sr-only">{label}</span> : label}
      {children}
      {hint && <span className="text-xs font-normal text-muted">{hint}</span>}
      {error && <span className="text-xs font-normal text-danger">{error}</span>}
    </label>
  );
}
