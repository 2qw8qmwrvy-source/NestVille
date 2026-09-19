"use client";

import { useActionState, useState } from "react";
import { submitRating, type RatingFormState } from "@/lib/actions/ratings";

export default function RatingForm({
  ratedUserId,
  ratedUserName,
  existingScore,
  existingComment,
}: {
  ratedUserId: string;
  ratedUserName: string;
  existingScore?: number;
  existingComment?: string;
}) {
  const action = submitRating.bind(null, ratedUserId);
  const [state, formAction, pending] = useActionState<RatingFormState, FormData>(action, undefined);
  const [hovered, setHovered] = useState(0);
  const [selected, setSelected] = useState(existingScore ?? 0);

  if (state?.message === "success") {
    return (
      <p className="rounded-lg bg-success/10 px-4 py-3 text-sm text-success">
        Thanks! Your rating for {ratedUserName} has been saved.
      </p>
    );
  }

  return (
    <form action={formAction} className="flex flex-col gap-3">
      {state?.message && state.message !== "success" && (
        <p className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{state.message}</p>
      )}

      <div className="flex items-center gap-1" onMouseLeave={() => setHovered(0)}>
        {[1, 2, 3, 4, 5].map((n) => (
          <label key={n} className="cursor-pointer" onMouseEnter={() => setHovered(n)}>
            <input
              type="radio"
              name="score"
              value={n}
              checked={selected === n}
              onChange={() => setSelected(n)}
              className="sr-only"
              required
            />
            <span
              className={`text-2xl leading-none ${
                (hovered || selected) >= n ? "text-gold" : "text-card-border"
              }`}
            >
              &#9733;
            </span>
          </label>
        ))}
      </div>
      {state?.errors?.score && <span className="text-xs text-danger">{state.errors.score[0]}</span>}

      <textarea
        name="comment"
        defaultValue={existingComment}
        rows={3}
        placeholder={`Optional: how was your experience with ${ratedUserName}?`}
        className="input"
      />

      <button
        type="submit"
        disabled={pending || selected === 0}
        className="w-fit rounded-full bg-garnet px-5 py-2 text-sm font-semibold text-white transition hover:bg-garnet-dark disabled:opacity-60"
      >
        {pending ? "Saving..." : existingScore ? "Update rating" : "Submit rating"}
      </button>
    </form>
  );
}
