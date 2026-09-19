"use client";

import { useActionState } from "react";
import type { ListingFormState } from "@/lib/actions/listings";
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

export default function ListingForm({
  action,
  defaults,
  submitLabel = "Publish listing",
}: {
  action: ActionFn;
  defaults?: ListingFormDefaults;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState<ListingFormState, FormData>(
    action,
    undefined
  );

  const errors = state?.errors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state?.message && (
        <p className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{state.message}</p>
      )}

      <div className="grid gap-4 sm:grid-cols-2">
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
          <select name="neighborhood" defaultValue={defaults?.neighborhood ?? ""} className="input">
            <option value="">Select neighborhood</option>
            {NEIGHBORHOODS.map((n) => (
              <option key={n} value={n}>
                {n}
              </option>
            ))}
          </select>
        </Field>

        <Field label="Property type" error={errors.propertyType?.[0]}>
          <select name="propertyType" defaultValue={defaults?.propertyType ?? ""} className="input">
            <option value="">Select type</option>
            {PROPERTY_TYPES.map((t) => (
              <option key={t} value={t}>
                {t}
              </option>
            ))}
          </select>
        </Field>

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
          <select name="leaseLength" defaultValue={defaults?.leaseLength ?? ""} className="input">
            <option value="">Select lease length</option>
            {LEASE_LENGTHS.map((l) => (
              <option key={l} value={l}>
                {l}
              </option>
            ))}
          </select>
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

        <Field label="Available from" error={errors.availableFrom?.[0]}>
          <input
            type="date"
            name="availableFrom"
            defaultValue={defaults?.availableFrom}
            className="input"
          />
        </Field>
      </div>

      <Field label="Description" error={errors.description?.[0]} full>
        <textarea
          name="description"
          defaultValue={defaults?.description}
          rows={6}
          placeholder="Tell students about the unit, the neighborhood, and what's included."
          className="input"
        />
      </Field>

      <fieldset className="grid grid-cols-2 gap-3 sm:grid-cols-3">
        <legend className="mb-2 text-sm font-semibold">Amenities</legend>
        {[
          { name: "furnished", label: "Furnished", checked: defaults?.furnished },
          { name: "petsAllowed", label: "Pets allowed", checked: defaults?.petsAllowed },
          {
            name: "utilitiesIncluded",
            label: "Utilities included",
            checked: defaults?.utilitiesIncluded,
          },
          { name: "parking", label: "Parking", checked: defaults?.parking },
          { name: "laundry", label: "In-unit laundry", checked: defaults?.laundry },
        ].map((item) => (
          <label key={item.name} className="flex items-center gap-2 text-sm">
            <input type="checkbox" name={item.name} defaultChecked={item.checked} />
            {item.label}
          </label>
        ))}
      </fieldset>

      <Field
        label="Photo URLs (one per line, up to 8)"
        error={errors.images?.[0]}
        full
        hint="Paste image links (e.g. from Imgur or Google Photos). Leave blank if you don't have any yet."
      >
        <textarea
          name="images"
          defaultValue={defaults?.images?.join("\n")}
          rows={4}
          placeholder={"https://example.com/photo1.jpg\nhttps://example.com/photo2.jpg"}
          className="input"
        />
      </Field>

      <button
        type="submit"
        disabled={pending}
        className="w-full rounded-full bg-garnet px-6 py-3 text-sm font-semibold text-white transition hover:bg-garnet-dark disabled:opacity-60 sm:w-fit"
      >
        {pending ? "Saving..." : submitLabel}
      </button>
    </form>
  );
}

function Field({
  label,
  error,
  full,
  hint,
  children,
}: {
  label: string;
  error?: string;
  full?: boolean;
  hint?: string;
  children: React.ReactNode;
}) {
  return (
    <label className={`flex flex-col gap-1 text-sm font-medium ${full ? "sm:col-span-2" : ""}`}>
      {label}
      {children}
      {hint && <span className="text-xs font-normal text-muted">{hint}</span>}
      {error && <span className="text-xs font-normal text-danger">{error}</span>}
    </label>
  );
}
