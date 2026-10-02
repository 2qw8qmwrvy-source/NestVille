import type { Metadata } from "next";
import Link from "next/link";

export const metadata: Metadata = {
  title: "For landlords",
};

const benefits = [
  {
    title: "Reach verified students directly",
    body: "Every student renter signs up with their @acadiau.ca email, so you know your inbox is full of actual Acadia students, not anonymous strangers.",
  },
  {
    title: "Build a visible track record",
    body: "Students rate landlords after a real interaction. A solid rating history builds trust before you ever exchange a message.",
  },
  {
    title: "Earn a Trusted landlord badge",
    body: "Once you've built up enough completed deals with solid ratings, a subtle Trusted landlord badge shows up on your profile and listings — no extra steps required.",
  },
  {
    title: "Generate a lease summary in minutes",
    body: "Pre-fill a plain-language lease summary worksheet straight from your listing details — address, rent, and the amenities you've already entered.",
  },
  {
    title: "Reported content is reviewed, not auto-hidden",
    body: "If a listing gets reported, it stays live while our team reviews it by hand, so an honest mistake or a mistaken report doesn't cost you a live listing.",
  },
];

export default function LandlordsPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">List with NestVille</h1>
      <p className="mt-4 leading-relaxed text-muted">
        NestVille connects you with verified Acadia students looking for a place
        near campus, and gives you simple tools to manage listings and build trust
        over time.
      </p>

      <div className="mt-10 flex flex-col gap-8">
        {benefits.map((b) => (
          <div key={b.title}>
            <h2 className="font-bold tracking-tight">{b.title}</h2>
            <p className="mt-1 leading-relaxed text-muted">{b.body}</p>
          </div>
        ))}
      </div>

      <div className="mt-12 flex flex-wrap gap-3">
        <Link
          href="/listings/new"
          className="rounded-full bg-garnet px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-garnet-dark"
        >
          Post a listing
        </Link>
        <Link
          href="/how-it-works"
          className="rounded-full border border-card-border px-5 py-2.5 text-sm font-semibold transition hover:border-garnet hover:text-garnet"
        >
          See how it works
        </Link>
      </div>
    </div>
  );
}
