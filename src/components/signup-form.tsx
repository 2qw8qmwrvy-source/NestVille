"use client";

import { useActionState, useState } from "react";
import { signup } from "@/lib/actions/auth";
import { USER_ROLES, ACADIA_EMAIL_DOMAIN } from "@/lib/validation";

export default function SignupForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(signup, undefined);
  const [role, setRole] = useState<"student" | "landlord">("student");

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {next && <input type="hidden" name="next" value={next} />}

      {state?.message && (
        <p className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{state.message}</p>
      )}

      <fieldset className="flex flex-col gap-2">
        <legend className="mb-1 text-sm font-medium">I&apos;m signing up as a...</legend>
        <div className="grid grid-cols-2 gap-2">
          {USER_ROLES.map((r) => (
            <label
              key={r.value}
              className={`cursor-pointer rounded-xl border px-3 py-2.5 text-center text-sm font-medium transition ${
                role === r.value
                  ? "border-garnet bg-garnet text-white"
                  : "border-card-border bg-background hover:border-garnet"
              }`}
            >
              <input
                type="radio"
                name="role"
                value={r.value}
                checked={role === r.value}
                onChange={() => setRole(r.value)}
                className="sr-only"
              />
              {r.label}
            </label>
          ))}
        </div>
      </fieldset>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Name
        <input name="name" required className="input" />
        {state?.errors?.name && (
          <span className="text-xs font-normal text-danger">{state.errors.name[0]}</span>
        )}
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Email
        <input
          type="email"
          name="email"
          required
          placeholder={role === "student" ? `you${ACADIA_EMAIL_DOMAIN}` : "you@example.com"}
          className="input"
        />
        <span className="text-xs font-normal text-muted">
          {role === "student"
            ? `Students verify with their ${ACADIA_EMAIL_DOMAIN} email.`
            : "Landlords can sign up with any email."}
        </span>
        {state?.errors?.email && (
          <span className="text-xs font-normal text-danger">{state.errors.email[0]}</span>
        )}
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Password
        <input type="password" name="password" required minLength={8} className="input" />
        <span className="text-xs font-normal text-muted">At least 8 characters.</span>
        {state?.errors?.password && (
          <span className="text-xs font-normal text-danger">{state.errors.password[0]}</span>
        )}
      </label>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-full rounded-full bg-garnet px-6 py-3 text-sm font-semibold text-white transition hover:bg-garnet-dark disabled:opacity-60"
      >
        {pending ? "Creating account..." : "Sign up"}
      </button>
    </form>
  );
}
