import Link from "next/link";
import ScrollToTop from "@/components/scroll-to-top";

const columns = [
  {
    title: "Browse",
    links: [
      { href: "/listings", label: "Rentals" },
      { href: "/roommates", label: "Roommates" },
    ],
  },
  {
    title: "Account",
    links: [
      { href: "/signup", label: "Sign up" },
      { href: "/login", label: "Log in" },
      { href: "/dashboard", label: "Dashboard" },
    ],
  },
  {
    title: "About",
    links: [
      { href: "/about", label: "About & safety tips" },
      { href: "/listings/new", label: "Post a listing" },
    ],
  },
];

export default function Footer() {
  return (
    <footer className="bg-footer-bg text-footer-fg">
      <div className="mx-auto max-w-6xl px-4 py-14 sm:px-6">
        <div className="grid gap-10 sm:grid-cols-2 md:grid-cols-4">
          <div className="md:col-span-1">
            <div className="flex items-center gap-2 font-semibold">
              <span className="flex h-8 w-8 items-center justify-center rounded-full bg-gold-light text-sm font-bold text-garnet-dark">
                WV
              </span>
              <span className="text-lg tracking-tight">Wolfville Student Rentals</span>
            </div>
            <p className="mt-4 text-sm text-footer-muted">
              An independent, student-run listings board for the Wolfville, Nova
              Scotia community near Acadia University.
            </p>
          </div>

          {columns.map((col) => (
            <div key={col.title}>
              <h3 className="mb-3 text-sm font-semibold uppercase tracking-wide text-gold-light">
                {col.title}
              </h3>
              <ul className="flex flex-col gap-2 text-sm">
                {col.links.map((link) => (
                  <li key={link.href}>
                    <Link href={link.href} className="text-footer-fg/90 hover:text-gold-light">
                      {link.label}
                    </Link>
                  </li>
                ))}
              </ul>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-white/10 pt-6 text-sm text-footer-muted">
          <p>
            Not affiliated with or endorsed by Acadia University. Always meet in
            person, view the unit before paying, and never wire money to someone you
            haven&apos;t met.
          </p>
          <p className="mt-2">&copy; {new Date().getFullYear()} Wolfville Student Rentals.</p>
        </div>
      </div>

      <ScrollToTop />
    </footer>
  );
}
