import type { Metadata } from "next";
import Link from "next/link";
import { db } from "@/lib/db";
import RoommateCard from "@/components/roommate-card";
import { ROOMMATE_TYPES } from "@/lib/validation";

export const metadata: Metadata = {
  title: "Roommates",
};

export default async function RoommatesPage({
  searchParams,
}: {
  searchParams: Promise<{ type?: string }>;
}) {
  const { type } = await searchParams;

  const posts = await db.roommatePost.findMany({
    where: type ? { type } : undefined,
    orderBy: { createdAt: "desc" },
    include: { author: { select: { name: true } } },
  });

  return (
    <div className="mx-auto w-full max-w-6xl px-4 py-10 sm:px-6">
      <div className="mb-8 flex flex-wrap items-end justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Roommates &amp; sublets</h1>
          <p className="mt-1 text-muted">
            Connect with other Acadia students who have a room to offer or need one.
          </p>
        </div>
        <Link
          href="/roommates/new"
          className="rounded-full bg-garnet px-5 py-2.5 text-sm font-semibold text-white transition hover:bg-garnet-dark"
        >
          Post to the board
        </Link>
      </div>

      <div className="mb-6 flex flex-wrap gap-2 text-sm">
        <Link
          href="/roommates"
          className={`rounded-full px-4 py-2 font-medium ${
            !type ? "bg-garnet text-white" : "border border-card-border"
          }`}
        >
          All posts
        </Link>
        {ROOMMATE_TYPES.map((t) => (
          <Link
            key={t.value}
            href={`/roommates?type=${t.value}`}
            className={`rounded-full px-4 py-2 font-medium ${
              type === t.value ? "bg-garnet text-white" : "border border-card-border"
            }`}
          >
            {t.label}
          </Link>
        ))}
      </div>

      {posts.length === 0 ? (
        <div className="rounded-xl border border-dashed border-card-border p-10 text-center text-muted">
          No posts yet. Be the first to{" "}
          <Link href="/roommates/new" className="font-semibold text-garnet hover:underline">
            post to the roommate board
          </Link>
          .
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {posts.map((post) => (
            <RoommateCard key={post.id} post={post} />
          ))}
        </div>
      )}
    </div>
  );
}
