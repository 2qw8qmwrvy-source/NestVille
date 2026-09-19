"use client";

import { useState } from "react";
import Link from "next/link";
import { logout } from "@/lib/actions/auth";

export default function MobileNav({ isLoggedIn }: { isLoggedIn: boolean }) {
  const [open, setOpen] = useState(false);

  return (
    <div className="md:hidden">
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-label="Toggle menu"
        aria-expanded={open}
        className="flex h-9 w-9 items-center justify-center rounded-md border border-card-border"
      >
        <span className="sr-only">Toggle menu</span>
        {open ? "✕" : "☰"}
      </button>

      {open && (
        <div className="absolute inset-x-0 top-full border-b border-card-border bg-background px-4 pb-4">
          <nav className="flex flex-col gap-1 pt-2 text-sm font-medium">
            <Link href="/listings" onClick={() => setOpen(false)} className="rounded-md px-2 py-2 hover:bg-card">
              Rentals
            </Link>
            <Link href="/roommates" onClick={() => setOpen(false)} className="rounded-md px-2 py-2 hover:bg-card">
              Roommates
            </Link>
            {isLoggedIn ? (
              <>
                <Link href="/listings/new" onClick={() => setOpen(false)} className="rounded-md px-2 py-2 hover:bg-card">
                  Post a listing
                </Link>
                <Link href="/dashboard" onClick={() => setOpen(false)} className="rounded-md px-2 py-2 hover:bg-card">
                  Dashboard
                </Link>
                <form action={logout}>
                  <button type="submit" className="w-full rounded-md px-2 py-2 text-left hover:bg-card">
                    Log out
                  </button>
                </form>
              </>
            ) : (
              <>
                <Link href="/login" onClick={() => setOpen(false)} className="rounded-md px-2 py-2 hover:bg-card">
                  Log in
                </Link>
                <Link href="/signup" onClick={() => setOpen(false)} className="rounded-md px-2 py-2 hover:bg-card">
                  Sign up
                </Link>
              </>
            )}
          </nav>
        </div>
      )}
    </div>
  );
}
