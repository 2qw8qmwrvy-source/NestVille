"use client";

import { useActionState } from "react";
import { login } from "@/lib/actions/auth";

export default function LoginForm({ next }: { next?: string }) {
  const [state, formAction, pending] = useActionState(login, undefined);

  return (
    <form action={formAction} className="flex flex-col gap-4">
      {next && <input type="hidden" name="next" value={next} />}

      {state?.message && (
        <p className="rounded-lg bg-danger/10 px-4 py-3 text-sm text-danger">{state.message}</p>
      )}

      <label className="flex flex-col gap-1 text-sm font-medium">
        Email
        <input type="email" name="email" required className="input" />
        {state?.errors?.email && (
          <span className="text-xs font-normal text-danger">{state.errors.email[0]}</span>
        )}
      </label>

      <label className="flex flex-col gap-1 text-sm font-medium">
        Password
        <input type="password" name="password" required className="input" />
        {state?.errors?.password && (
          <span className="text-xs font-normal text-danger">{state.errors.password[0]}</span>
        )}
      </label>

      <button
        type="submit"
        disabled={pending}
        className="mt-2 w-full rounded-full bg-garnet px-6 py-3 text-sm font-semibold text-white transition hover:bg-garnet-dark disabled:opacity-60"
      >
        {pending ? "Logging in..." : "Log in"}
      </button>
    </form>
  );
}
