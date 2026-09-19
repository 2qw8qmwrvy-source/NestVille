import type { Metadata } from "next";
import { requireSession } from "@/lib/dal";
import { createRoommatePost } from "@/lib/actions/roommates";
import RoommateForm from "@/components/roommate-form";

export const metadata: Metadata = {
  title: "Post to the roommate board",
};

export default async function NewRoommatePostPage() {
  await requireSession();

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight">Post to the roommate board</h1>
      <p className="mt-1 text-muted">
        Let other students know you have a room to offer or that you&apos;re looking for one.
      </p>

      <div className="mt-8">
        <RoommateForm action={createRoommatePost} submitLabel="Post" />
      </div>
    </div>
  );
}
