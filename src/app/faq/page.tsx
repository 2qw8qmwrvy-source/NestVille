import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "FAQ",
};

const faqs = [
  {
    q: "Do I need an Acadia email to use NestVille?",
    a: "Only students need an @acadiau.ca email to sign up — that's what lets us show a \"Verified Acadia student\" badge on your profile. Landlords and property managers can sign up with any email address.",
  },
  {
    q: "Is NestVille affiliated with Acadia University?",
    a: "No. NestVille is an independent, student-built platform and is not affiliated with, run by, or endorsed by Acadia University.",
  },
  {
    q: "How does the rating system work?",
    a: "After an actual interaction — viewing a unit, signing a lease, or sorting out a roommate arrangement — either side can leave a 1-5 star rating with an optional comment on the other person's profile. Please only rate people you've genuinely dealt with.",
  },
  {
    q: "What does the \"Trusted landlord\" badge mean?",
    a: "It's a subtle label shown on a landlord's profile and listings once they've built up a solid rating history through enough completed deals on the platform. It's a signal based on real ratings, not a guarantee.",
  },
  {
    q: "How do I report a scam or a suspicious listing?",
    a: "Every listing, roommate post, and profile has a \"Report\" link. Pick a reason, add any details, and submit — our team reviews every report by hand. Reported content stays visible until it's actually reviewed, so reporting something doesn't take it down automatically.",
  },
  {
    q: "Can I get a lease drafted through NestVille?",
    a: "Landlords can generate a plain-language lease summary worksheet pre-filled from their listing details. It's a helpful starting point, not a legal document — you still need Nova Scotia's official Standard Form of Lease to actually sign a tenancy. See the lease summary tool on any of your listings for details.",
  },
  {
    q: "What should I watch out for when renting?",
    a: "Never send money or banking details to someone you haven't met or verified, always view a unit in person first, and treat pressure to act immediately as a red flag. See our About & safety tips page for more.",
  },
];

export default function FaqPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">Frequently asked questions</h1>

      <dl className="mt-10 flex flex-col gap-8">
        {faqs.map((item) => (
          <div key={item.q}>
            <dt className="font-bold tracking-tight">{item.q}</dt>
            <dd className="mt-2 leading-relaxed text-muted">{item.a}</dd>
          </div>
        ))}
      </dl>
    </div>
  );
}
