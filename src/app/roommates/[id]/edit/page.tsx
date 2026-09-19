import type { Metadata } from "next";
import { notFound, redirect } from "next/navigation";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/dal";
import { updateRoommatePost } from "@/lib/actions/roommates";
import RoommateForm from "@/components/roommate-form";

export const metadata: Metadata = {
  title: "Edit post",
};

export default async function EditRoommatePostPage({
  params,
}: {
  params: Promise<{ id: string }>;
}) {
  const { id } = await params;
  const session = await requireSession();

  const post = await db.roommatePost.findUnique({ where: { id } });
  if (!post) notFound();
  if (post.authorId !== session.userId) redirect(`/roommates/${id}`);

  const action = updateRoommatePost.bind(null, id);

  return (
    <div className="mx-auto w-full max-w-2xl px-4 py-10 sm:px-6">
      <h1 className="text-2xl font-bold tracking-tight">Edit post</h1>

      <div className="mt-8">
        <RoommateForm
          action={action}
          submitLabel="Save changes"
          defaults={{
            type: post.type,
            title: post.title,
            description: post.description,
            price: post.price ?? undefined,
            location: post.location ?? undefined,
            moveInDate: post.moveInDate?.toISOString().slice(0, 10),
            moveOutDate: post.moveOutDate?.toISOString().slice(0, 10),
          }}
        />
      </div>
    </div>
  );
}
