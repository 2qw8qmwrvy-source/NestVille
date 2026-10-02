"use client";

import { useActionState, useState } from "react";
import { submitReport, type ReportFormState } from "@/lib/actions/reports";
import { REPORT_REASONS } from "@/lib/validation";

type ReportTarget =
  | { listingId: string }
  | { roommatePostId: string }
  | { reportedUserId: string };

export default function ReportButton({
  target,
  label = "Report this",
}: {
  target: ReportTarget;
  label?: string;
}) {
  const action = submitReport.bind(null, target);
  const [state, formAction, pending] = useActionState<ReportFormState, FormData>(action, undefined);
  const [open, setOpen] = useState(false);

  if (state?.message === "success") {
    return <p className="text-xs text-muted">Thanks — our team will take a look.</p>;
  }

  if (!open) {
    return (
      <button
        type="button"
        onClick={() => setOpen(true)}
        className="text-xs font-medium text-muted underline-offset-2 hover:text-garnet hover:underline"
      >
        {label}
      </button>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-2 rounded-lg border border-card-border bg-card p-3 text-xs">
      <select name="reason" required defaultValue="" className="input !py-1.5 !text-xs">
        <option value="" disabled>
          Why are you reporting this?
        </option>
        {REPORT_REASONS.map((reason) => (
          <option key={reason} value={reason}>
            {reason}
          </option>
        ))}
      </select>
      {state?.errors?.reason && <span className="text-danger">{state.errors.reason[0]}</span>}

      <textarea name="details" rows={2} placeholder="Optional details" className="input !text-xs" />

      <div className="flex gap-2">
        <button
          type="submit"
          disabled={pending}
          className="rounded-full bg-garnet px-3 py-1.5 font-semibold text-white transition hover:bg-garnet-dark disabled:opacity-60"
        >
          {pending ? "Sending..." : "Submit report"}
        </button>
        <button
          type="button"
          onClick={() => setOpen(false)}
          className="rounded-full border border-card-border px-3 py-1.5 font-semibold transition hover:border-garnet hover:text-garnet"
        >
          Cancel
        </button>
      </div>
    </form>
  );
}
