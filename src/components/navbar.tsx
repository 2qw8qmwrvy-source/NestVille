import Link from "next/link";
import { getCurrentUser } from "@/lib/dal";
import { logout } from "@/lib/actions/auth";
import MobileNav from "@/components/mobile-nav";

const navLinks = [
  { href: "/listings", label: "Rentals" },
  { href: "/roommates", label: "Roommates" },
];

export default async function Navbar() {
  const user = await getCurrentUser();

  return (
    <header className="sticky top-0 z-40 border-b border-card-border bg-background/95 backdrop-blur">
      <div className="mx-auto flex max-w-6xl items-center justify-between gap-4 px-4 py-3 sm:px-6">
        <Link href="/" className="flex items-center gap-2 font-semibold">
          <span className="flex h-8 w-8 items-center justify-center rounded-full bg-garnet text-sm font-bold text-white">
            NV
          </span>
          <span className="text-lg tracking-tight">NestVille</span>
        </Link>

        <nav className="hidden items-center gap-6 text-sm font-medium md:flex">
          {navLinks.map((link) => (
            <Link key={link.href} href={link.href} className="hover:text-garnet">
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          {user ? (
            <>
              <Link
                href="/listings/new"
                className="rounded-full bg-garnet px-4 py-2 text-sm font-semibold text-white transition hover:bg-garnet-dark"
              >
                Post a listing
              </Link>
              <Link href="/dashboard" className="text-sm font-medium hover:text-garnet">
                Dashboard
              </Link>
              <form action={logout}>
                <button
                  type="submit"
                  className="text-sm font-medium text-muted hover:text-garnet"
                >
                  Log out
                </button>
              </form>
            </>
          ) : (
            <>
              <Link href="/login" className="text-sm font-medium hover:text-garnet">
                Log in
              </Link>
              <Link
                href="/signup"
                className="rounded-full bg-garnet px-4 py-2 text-sm font-semibold text-white transition hover:bg-garnet-dark"
              >
                Sign up
              </Link>
            </>
          )}
        </div>

        <MobileNav isLoggedIn={Boolean(user)} />
      </div>
    </header>
  );
}
