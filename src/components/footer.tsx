import Link from "next/link";

export default function Footer() {
  return (
    <footer className="border-t border-card-border py-8 text-sm text-muted">
      <div className="mx-auto flex max-w-6xl flex-col gap-2 px-4 sm:px-6">
        <p>
          Wolfville Student Rentals is an independent, student-run listings board for
          the Wolfville, Nova Scotia community near Acadia University. Not affiliated
          with or endorsed by Acadia University.
        </p>
        <p>
          Always meet in person, view the unit before paying, and never wire money to
          someone you haven&apos;t met. Read our{" "}
          <Link href="/about" className="font-medium text-garnet hover:underline">
            safety tips
          </Link>
          .
        </p>
        <p>&copy; {new Date().getFullYear()} Wolfville Student Rentals.</p>
      </div>
    </footer>
  );
}
