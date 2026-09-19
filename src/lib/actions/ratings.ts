"use server";

import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession } from "@/lib/dal";
import { RatingSchema } from "@/lib/validation";

export type RatingFormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;

export async function submitRating(
  ratedUserId: string,
  _prevState: RatingFormState,
  formData: FormData
): Promise<RatingFormState> {
  const session = await requireSession();

  if (session.userId === ratedUserId) {
    return { message: "You can't rate yourself." };
  }

  const ratedUser = await db.user.findUnique({ where: { id: ratedUserId }, select: { id: true } });
  if (!ratedUser) {
    return { message: "That user doesn't exist." };
  }

  const validated = RatingSchema.safeParse({
    score: formData.get("score"),
    comment: formData.get("comment") || undefined,
  });

  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  await db.rating.upsert({
    where: { raterId_ratedUserId: { raterId: session.userId, ratedUserId } },
    update: validated.data,
    create: { ...validated.data, raterId: session.userId, ratedUserId },
  });

  revalidatePath(`/users/${ratedUserId}`);
  return { message: "success" };
}
