"use client";

import { useState } from "react";

export type LeaseListingData = {
  title: string;
  address: string;
  price: number;
  bedrooms: number;
  bathrooms: number;
  availableFrom: string;
  furnished: boolean;
  petsAllowed: boolean;
  utilitiesIncluded: boolean;
  parking: boolean;
  laundry: boolean;
  landlordName: string;
};

function formatDateInput(iso: string) {
  return iso.slice(0, 10);
}

export default function LeaseWorksheet({ listing }: { listing: LeaseListingData }) {
  const [generated, setGenerated] = useState(false);

  const [landlordName, setLandlordName] = useState(listing.landlordName);
  const [tenantNames, setTenantNames] = useState("");
  const [address, setAddress] = useState(listing.address);
  const [leaseStart, setLeaseStart] = useState(formatDateInput(listing.availableFrom));
  const [leaseEnd, setLeaseEnd] = useState("");
  const [monthToMonth, setMonthToMonth] = useState(false);
  const [rent, setRent] = useState(String(listing.price));
  const [rentDueDate, setRentDueDate] = useState("1st of each month");
  const [deposit, setDeposit] = useState("");
  const [furnished, setFurnished] = useState(listing.furnished);
  const [petsAllowed, setPetsAllowed] = useState(listing.petsAllowed);
  const [utilitiesIncluded, setUtilitiesIncluded] = useState(listing.utilitiesIncluded);
  const [parking, setParking] = useState(listing.parking);
  const [laundry, setLaundry] = useState(listing.laundry);
  const [notes, setNotes] = useState("");

  if (generated) {
    return (
      <div>
        <div className="mb-6 flex flex-wrap items-center justify-between gap-3 print:hidden">
          <button
            type="button"
            onClick={() => setGenerated(false)}
            className="text-sm font-medium text-muted hover:text-garnet"
          >
            &larr; Edit details
          </button>
          <button
            type="button"
            onClick={() => window.print()}
            className="rounded-full bg-garnet px-4 py-2 text-sm font-semibold text-white transition hover:bg-garnet-dark"
          >
            Print / save as PDF
          </button>
        </div>

        <div className="rounded-xl border border-card-border bg-card p-6 sm:p-10">
          <div className="rounded-lg border border-gold-light/60 bg-gold-light/15 p-4 text-sm leading-relaxed">
            <p className="font-semibold text-garnet-dark">This is a lease summary, not a legal lease.</p>
            <p className="mt-1 text-muted">
              This worksheet is a plain-language summary of terms for your own reference and
              discussion. It is <strong>not</strong> a substitute for Nova Scotia&apos;s official
              Standard Form of Lease, which is required for most residential tenancies under
              the Residential Tenancies Act. Search &ldquo;Nova Scotia Standard Form of Lease&rdquo;
              on novascotia.ca, or contact Nova Scotia&apos;s Residential Tenancies Program, to get
              and sign the official form.
            </p>
          </div>

          <h2 className="mt-6 text-xl font-bold tracking-tight">Lease summary</h2>

          <dl className="mt-4 grid gap-4 sm:grid-cols-2">
            <Field label="Landlord" value={landlordName || "—"} />
            <Field label="Tenant(s)" value={tenantNames || "—"} />
            <Field label="Premises address" value={address || "—"} />
            <Field label="Monthly rent" value={rent ? `$${Number(rent).toLocaleString()}` : "—"} />
            <Field label="Rent due" value={rentDueDate || "—"} />
            <Field label="Security deposit" value={deposit ? `$${Number(deposit).toLocaleString()}` : "—"} />
            <Field
              label="Lease term"
              value={
                monthToMonth
                  ? `Month-to-month, starting ${leaseStart || "—"}`
                  : `${leaseStart || "—"} to ${leaseEnd || "—"}`
              }
            />
          </dl>

          <h3 className="mt-6 font-semibold">Included in this tenancy</h3>
          <ul className="mt-2 flex flex-wrap gap-2 text-sm">
            {[
              { on: furnished, label: "Furnished" },
              { on: petsAllowed, label: "Pets allowed" },
              { on: utilitiesIncluded, label: "Utilities included" },
              { on: parking, label: "Parking" },
              { on: laundry, label: "In-unit laundry" },
            ].map((item) => (
              <li
                key={item.label}
                className={`rounded-full border px-3 py-1 ${
                  item.on
                    ? "border-success/30 bg-success/10 text-success"
                    : "border-card-border text-muted"
                }`}
              >
                {item.on ? "✓" : "✗"} {item.label}
              </li>
            ))}
          </ul>

          {notes && (
            <>
              <h3 className="mt-6 font-semibold">Additional notes</h3>
              <p className="mt-2 whitespace-pre-line leading-relaxed text-muted">{notes}</p>
            </>
          )}

          <div className="mt-10 grid gap-10 sm:grid-cols-2">
            <SignatureLine label="Landlord signature & date" />
            <SignatureLine label="Tenant signature & date" />
          </div>

          <p className="mt-10 text-xs text-muted">
            Generated with NestVille&apos;s lease summary tool. Not legal advice and not a
            binding contract until the parties sign the applicable official lease document.
          </p>
        </div>
      </div>
    );
  }

  return (
    <form
      onSubmit={(e) => {
        e.preventDefault();
        setGenerated(true);
      }}
      className="flex flex-col gap-6"
    >
      <div className="rounded-lg border border-gold-light/60 bg-gold-light/15 p-4 text-sm leading-relaxed text-muted">
        This tool pre-fills a plain-language <strong>lease summary</strong> from your listing —
        it is not a substitute for Nova Scotia&apos;s official Standard Form of Lease.
      </div>

      <FormRow label="Landlord name">
        <input
          value={landlordName}
          onChange={(e) => setLandlordName(e.target.value)}
          className="input"
        />
      </FormRow>

      <FormRow label="Tenant name(s)">
        <input
          value={tenantNames}
          onChange={(e) => setTenantNames(e.target.value)}
          placeholder="e.g. Jordan Sarty, Priya Nair"
          className="input"
        />
      </FormRow>

      <FormRow label="Premises address">
        <input value={address} onChange={(e) => setAddress(e.target.value)} className="input" />
      </FormRow>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormRow label="Lease start date">
          <input
            type="date"
            value={leaseStart}
            onChange={(e) => setLeaseStart(e.target.value)}
            className="input"
          />
        </FormRow>
        <FormRow label="Lease end date">
          <input
            type="date"
            value={leaseEnd}
            onChange={(e) => setLeaseEnd(e.target.value)}
            disabled={monthToMonth}
            className="input disabled:opacity-50"
          />
        </FormRow>
      </div>

      <label className="flex items-center gap-2 text-sm">
        <input
          type="checkbox"
          checked={monthToMonth}
          onChange={(e) => setMonthToMonth(e.target.checked)}
          className="h-4 w-4 rounded border-card-border text-garnet focus:ring-garnet/30"
        />
        Month-to-month (no fixed end date)
      </label>

      <div className="grid gap-4 sm:grid-cols-2">
        <FormRow label="Monthly rent ($)">
          <input
            type="number"
            min="0"
            value={rent}
            onChange={(e) => setRent(e.target.value)}
            className="input"
          />
        </FormRow>
        <FormRow label="Rent due date">
          <input
            value={rentDueDate}
            onChange={(e) => setRentDueDate(e.target.value)}
            className="input"
          />
        </FormRow>
      </div>

      <FormRow label="Security deposit ($, optional)">
        <input
          type="number"
          min="0"
          value={deposit}
          onChange={(e) => setDeposit(e.target.value)}
          className="input"
        />
      </FormRow>

      <div>
        <p className="mb-2 text-sm font-medium">Included in this tenancy</p>
        <div className="flex flex-wrap gap-4 text-sm">
          <CheckboxOption label="Furnished" checked={furnished} onChange={setFurnished} />
          <CheckboxOption label="Pets allowed" checked={petsAllowed} onChange={setPetsAllowed} />
          <CheckboxOption
            label="Utilities included"
            checked={utilitiesIncluded}
            onChange={setUtilitiesIncluded}
          />
          <CheckboxOption label="Parking" checked={parking} onChange={setParking} />
          <CheckboxOption label="In-unit laundry" checked={laundry} onChange={setLaundry} />
        </div>
      </div>

      <FormRow label="Additional notes (optional)">
        <textarea
          value={notes}
          onChange={(e) => setNotes(e.target.value)}
          rows={3}
          placeholder="Anything else worth writing down, e.g. parking spot number, quiet hours..."
          className="input"
        />
      </FormRow>

      <button
        type="submit"
        className="w-fit rounded-full bg-garnet px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-garnet-dark"
      >
        Generate lease summary
      </button>
    </form>
  );
}

function FormRow({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex flex-col gap-1.5 text-sm font-medium">
      {label}
      {children}
    </label>
  );
}

function CheckboxOption({
  label,
  checked,
  onChange,
}: {
  label: string;
  checked: boolean;
  onChange: (value: boolean) => void;
}) {
  return (
    <label className="flex items-center gap-2 font-normal">
      <input
        type="checkbox"
        checked={checked}
        onChange={(e) => onChange(e.target.checked)}
        className="h-4 w-4 rounded border-card-border text-garnet focus:ring-garnet/30"
      />
      {label}
    </label>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-xs font-semibold uppercase tracking-wide text-muted">{label}</dt>
      <dd className="mt-0.5">{value}</dd>
    </div>
  );
}

function SignatureLine({ label }: { label: string }) {
  return (
    <div>
      <div className="h-10 border-b border-foreground/40" />
      <p className="mt-1 text-xs text-muted">{label}</p>
    </div>
  );
}
