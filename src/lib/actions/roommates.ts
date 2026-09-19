"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession, verifySession } from "@/lib/dal";
import { RoommatePostSchema } from "@/lib/validation";

export type RoommateFormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;

function parseRoommateFormData(formData: FormData) {
  return {
    type: formData.get("type"),
    title: formData.get("title"),
    description: formData.get("description"),
    price: formData.get("price") || undefined,
    location: formData.get("location") || undefined,
    moveInDate: formData.get("moveInDate") || undefined,
    moveOutDate: formData.get("moveOutDate") || undefined,
  };
}

export async function createRoommatePost(
  _prevState: RoommateFormState,
  formData: FormData
): Promise<RoommateFormState> {
  const session = await verifySession();
  if (!session) {
    return { message: "You must be logged in to post." };
  }

  const validated = RoommatePostSchema.safeParse(parseRoommateFormData(formData));
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { moveInDate, moveOutDate, ...data } = validated.data;

  const post = await db.roommatePost.create({
    data: {
      ...data,
      moveInDate: moveInDate ? new Date(moveInDate) : undefined,
      moveOutDate: moveOutDate ? new Date(moveOutDate) : undefined,
      authorId: session.userId,
    },
    select: { id: true },
  });

  revalidatePath("/roommates");
  redirect(`/roommates/${post.id}`);
}

export async function updateRoommatePost(
  postId: string,
  _prevState: RoommateFormState,
  formData: FormData
): Promise<RoommateFormState> {
  const session = await requireSession();

  const existing = await db.roommatePost.findUnique({
    where: { id: postId },
    select: { authorId: true },
  });
  if (!existing || existing.authorId !== session.userId) {
    return { message: "You don't have permission to edit this post." };
  }

  const validated = RoommatePostSchema.safeParse(parseRoommateFormData(formData));
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { moveInDate, moveOutDate, ...data } = validated.data;

  await db.roommatePost.update({
    where: { id: postId },
    data: {
      ...data,
      moveInDate: moveInDate ? new Date(moveInDate) : null,
      moveOutDate: moveOutDate ? new Date(moveOutDate) : null,
    },
  });

  revalidatePath("/roommates");
  revalidatePath(`/roommates/${postId}`);
  redirect(`/roommates/${postId}`);
}

export async function deleteRoommatePost(postId: string) {
  const session = await requireSession();

  const existing = await db.roommatePost.findUnique({
    where: { id: postId },
    select: { authorId: true },
  });
  if (!existing || existing.authorId !== session.userId) {
    throw new Error("You don't have permission to delete this post.");
  }

  await db.roommatePost.delete({ where: { id: postId } });

  revalidatePath("/roommates");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}
