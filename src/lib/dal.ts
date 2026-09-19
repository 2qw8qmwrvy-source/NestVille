import "server-only";
import { cache } from "react";
import { redirect } from "next/navigation";
import { db } from "@/lib/db";
import { getSessionPayload } from "@/lib/session";

export const verifySession = cache(async () => {
  const session = await getSessionPayload();
  if (!session?.userId) return null;
  return { userId: session.userId as string };
});

export const requireSession = cache(async () => {
  const session = await verifySession();
  if (!session) redirect("/login");
  return session;
});

export const getCurrentUser = cache(async () => {
  const session = await verifySession();
  if (!session) return null;

  const user = await db.user.findUnique({
    where: { id: session.userId },
    select: { id: true, name: true, email: true, createdAt: true },
  });

  return user;
});
