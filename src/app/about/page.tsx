import type { Metadata } from "next";

export const metadata: Metadata = {
  title: "About & safety tips",
};

export default function AboutPage() {
  return (
    <div className="mx-auto w-full max-w-3xl px-4 py-14 sm:px-6">
      <h1 className="text-3xl font-bold tracking-tight">About Wolfville Student Rentals</h1>
      <p className="mt-4 leading-relaxed text-muted">
        Wolfville Student Rentals is an independent, student-built listings board for
        the Wolfville, Nova Scotia community around Acadia University. Students and
        local landlords can post rentals, and students can find or offer a room on
        the roommate board. It is not affiliated with, run by, or endorsed by Acadia
        University.
      </p>

      <h2 className="mt-10 text-xl font-bold tracking-tight">Staying safe while renting</h2>
      <ul className="mt-4 flex flex-col gap-3 leading-relaxed text-muted">
        <li>
          &bull; Always view a unit in person (or over video call) before sending any
          money.
        </li>
        <li>
          &bull; Never wire money, e-transfer a deposit, or share banking details to
          someone you haven&apos;t met or verified.
        </li>
        <li>
          &bull; Meet new roommates in a public place first.
        </li>
        <li>
          &bull; Get a written lease and read it before signing or paying a deposit.
        </li>
        <li>
          &bull; If a deal seems too good to be true, or a landlord pressures you to
          act immediately, treat it as a red flag.
        </li>
        <li>
          &bull; Report suspicious listings or messages by contacting the poster&apos;s
          listed email, or your local police non-emergency line if you believe you&apos;ve
          been targeted by a scam.
        </li>
      </ul>
    </div>
  );
}
