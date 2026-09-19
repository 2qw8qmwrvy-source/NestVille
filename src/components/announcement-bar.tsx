import Link from "next/link";

export default function AnnouncementBar() {
  return (
    <div className="bg-garnet-dark px-4 py-2.5 text-center text-sm text-white">
      New here? Post your first listing free.{" "}
      <Link href="/listings/new" className="font-semibold text-gold-light hover:underline">
        Get started &rarr;
      </Link>
    </div>
  );
}
