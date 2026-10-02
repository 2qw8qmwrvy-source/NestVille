import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "How it works",
};

const steps = [
  {
    title: "Verify who you are",
    body: "Students sign up with their @acadiau.ca email so everyone on the roommate board and in listing inboxes is a real Acadia student. Landlords sign up with any email and can build a track record over time.",
  },
  {
    title: "Browse or post",
    body: "Search rentals by neighborhood, price, and amenities, or post your own room on the roommate board if you're looking for (or offering) a place to live.",
  },
  {
    title: "Rate after a real interaction",
    body: "Once you've actually viewed a unit, signed a lease, or worked out a roommate arrangement, leave a star rating for the other person. Ratings build up into a visible track record on everyone's profile.",
  },
  {
    title: "Earn trust over time",
    body: "Landlords who build up a solid rating history across enough completed deals earn a subtle \"Trusted landlord\" badge on their profile and listings.",
  },
  {
    title: "Report anything that looks wrong",
    body: "Every listing, roommate post, and profile has a report option. Our team reviews every report by hand before taking anything down.",
  },
];

export default function HowItWorksPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">How NestVille works</h1>
      <p className="mt-4 leading-relaxed text-muted">
        NestVille combines student email verification, a two-way rating system, and
        manual review of reported content to make renting in Wolfville a little less
        risky for everyone.
      </p>

      <ol className="mt-10 flex flex-col gap-8">
        {steps.map((step, i) => (
          <li key={step.title} className="flex gap-4">
            <span className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-garnet text-sm font-bold text-white">
              {i + 1}
            </span>
            <div>
              <h2 className="font-bold tracking-tight">{step.title}</h2>
              <p className="mt-1 leading-relaxed text-muted">{step.body}</p>
            </div>
          </li>
        ))}
      </ol>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/listings"
          className="rounded-full bg-garnet px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-garnet-dark"
        >
          Browse rentals
        </Link>
        <Link
          href="/faq"
          className="rounded-full border border-card-border px-5 py-2.5 text-sm font-semibold transition hover:border-garnet hover:text-garnet"
        >
          Read the FAQ
        </Link>
      </div>
    </div>
  );
}
