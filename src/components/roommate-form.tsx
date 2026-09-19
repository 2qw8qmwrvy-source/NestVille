"use client";

import { useActionState } from "react";
import type { RoommateFormState } from "@/lib/actions/roommates";
import { ROOMMATE_TYPES } from "@/lib/validation";

export type RoommateFormDefaults = {
  type?: string;
  title?: string;
  description?: string;
  price?: number;
  location?: string;
  moveInDate?: string;
  moveOutDate?: string;
};

type ActionFn = (
  state: RoommateFormState,
  formData: FormData
) => Promise<RoommateFormState>;

export default function RoommateForm({
  action,
  defaults,
  submitLabel = "Post",
}: {
  action: ActionFn;
  defaults?: RoommateFormDefaults;
  submitLabel?: string;
}) {
  const [state, formAction, pending] = useActionState<RoommateFormState, FormData>(
    action,
    undefined
  );

  const errors = state?.errors ?? {};

  return (
    <form action={formAction} className="flex flex-col gap-6">
      {state?.message && (
        <p className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{state.message}</p>
      )}

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-semibold">What are you posting?</legend>
        {ROOMMATE_TYPES.map((t) => (
          <label key={t.value} className="flex items-center gap-2 text-sm">
            <input
              type="radio"
              name="type"
              value={t.value}
              defaultChecked={defaults?.type ? defaults.type === t.value : t.value === "have_room"}
              required
            />
            {t.label}
          </label>
        ))}
        {errors.type && <span className="text-xs text-danger">{errors.type[0]}</span>}
      </fieldset>

      <Field label="Title" error={errors.title?.[0]}>
        <input
          name="title"
          defaultValue={defaults?.title}
          placeholder="Room available in 3-bedroom near campus"
          className="input"
        />
      </Field>

      <Field label="Description" error={errors.description?.[0]}>
        <textarea
          name="description"
          defaultValue={defaults?.description}
          rows={6}
          placeholder="Share details: rent split, house vibe, what you're looking for."
          className="input"
        />
      </Field>

      <div className="grid gap-4 sm:grid-cols-2">
        <Field label="Rent / budget (CAD / month, optional)" error={errors.price?.[0]}>
          <input
            type="number"
            name="price"
            min={0}
            defaultValue={defaults?.price}
            placeholder="700"
            className="input"
          />
        </Field>

        <Field label="Location (optional)" error={errors.location?.[0]}>
          <input
            name="location"
            defaultValue={defaults?.location}
            placeholder="Highland Ave"
            className="input"
          />
        </Field>

        <Field label="Move-in date (optional)" error={errors.moveInDate?.[0]}>
          <input type="date" name="moveInDate" defaultValue={defaults?.moveInDate} className="input" />
        </Field>

        <Field label="Move-out date (optional)" error={errors.moveOutDate?.[0]}>
          <input type="date" name="moveOutDate" defaultValue={defaults?.moveOutDate} className="input" />
        </Field>
      </div>

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
  children,
}: {
  label: string;
  error?: string;
  children: React.ReactNode;
}) {
  return (
    <label className="flex flex-col gap-1 text-sm font-medium">
      {label}
      {children}
      {error && <span className="text-xs font-normal text-danger">{error}</span>}
    </label>
  );
}
