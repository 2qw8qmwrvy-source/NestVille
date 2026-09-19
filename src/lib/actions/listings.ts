"use server";

import { redirect } from "next/navigation";
import { revalidatePath } from "next/cache";
import { db } from "@/lib/db";
import { requireSession, verifySession } from "@/lib/dal";
import { ListingSchema } from "@/lib/validation";

export type ListingFormState =
  | {
      errors?: Record<string, string[]>;
      message?: string;
    }
  | undefined;

function parseListingFormData(formData: FormData) {
  const images = (formData.get("images") as string | null)
    ?.split("\n")
    .map((url) => url.trim())
    .filter(Boolean)
    .slice(0, 8);

  return {
    title: formData.get("title"),
    description: formData.get("description"),
    address: formData.get("address"),
    neighborhood: formData.get("neighborhood") || undefined,
    price: formData.get("price"),
    bedrooms: formData.get("bedrooms"),
    bathrooms: formData.get("bathrooms"),
    propertyType: formData.get("propertyType"),
    availableFrom: formData.get("availableFrom"),
    leaseLength: formData.get("leaseLength") || undefined,
    furnished: formData.get("furnished") === "on",
    petsAllowed: formData.get("petsAllowed") === "on",
    utilitiesIncluded: formData.get("utilitiesIncluded") === "on",
    parking: formData.get("parking") === "on",
    laundry: formData.get("laundry") === "on",
    images,
  };
}

export async function createListing(
  _prevState: ListingFormState,
  formData: FormData
): Promise<ListingFormState> {
  const session = await verifySession();
  if (!session) {
    return { message: "You must be logged in to post a listing." };
  }

  const validated = ListingSchema.safeParse(parseListingFormData(formData));
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { images, availableFrom, ...data } = validated.data;

  const listing = await db.listing.create({
    data: {
      ...data,
      availableFrom: new Date(availableFrom),
      authorId: session.userId,
      images: {
        create: (images ?? [])
          .filter((url) => url)
          .map((url, position) => ({ url, position })),
      },
    },
    select: { id: true },
  });

  revalidatePath("/listings");
  redirect(`/listings/${listing.id}`);
}

export async function updateListing(
  listingId: string,
  _prevState: ListingFormState,
  formData: FormData
): Promise<ListingFormState> {
  const session = await requireSession();

  const existing = await db.listing.findUnique({
    where: { id: listingId },
    select: { authorId: true },
  });
  if (!existing || existing.authorId !== session.userId) {
    return { message: "You don't have permission to edit this listing." };
  }

  const validated = ListingSchema.safeParse(parseListingFormData(formData));
  if (!validated.success) {
    return { errors: validated.error.flatten().fieldErrors };
  }

  const { images, availableFrom, ...data } = validated.data;

  await db.listing.update({
    where: { id: listingId },
    data: {
      ...data,
      availableFrom: new Date(availableFrom),
      images: {
        deleteMany: {},
        create: (images ?? [])
          .filter((url) => url)
          .map((url, position) => ({ url, position })),
      },
    },
  });

  revalidatePath("/listings");
  revalidatePath(`/listings/${listingId}`);
  redirect(`/listings/${listingId}`);
}

export async function deleteListing(listingId: string) {
  const session = await requireSession();

  const existing = await db.listing.findUnique({
    where: { id: listingId },
    select: { authorId: true },
  });
  if (!existing || existing.authorId !== session.userId) {
    throw new Error("You don't have permission to delete this listing.");
  }

  await db.listing.delete({ where: { id: listingId } });

  revalidatePath("/listings");
  revalidatePath("/dashboard");
  redirect("/dashboard");
}

export async function setListingStatus(listingId: string, status: "active" | "rented") {
  const session = await requireSession();

  const existing = await db.listing.findUnique({
    where: { id: listingId },
    select: { authorId: true },
  });
  if (!existing || existing.authorId !== session.userId) {
    throw new Error("You don't have permission to update this listing.");
  }

  await db.listing.update({ where: { id: listingId }, data: { status } });

  revalidatePath("/listings");
  revalidatePath(`/listings/${listingId}`);
  revalidatePath("/dashboard");
}

export async function toggleFavorite(listingId: string) {
  const session = await verifySession();
  if (!session) {
    throw new Error("You must be logged in to save favorites.");
  }

  const existing = await db.favorite.findUnique({
    where: { userId_listingId: { userId: session.userId, listingId } },
  });

  if (existing) {
    await db.favorite.delete({ where: { id: existing.id } });
  } else {
    await db.favorite.create({ data: { userId: session.userId, listingId } });
  }

  revalidatePath(`/listings/${listingId}`);
  revalidatePath("/dashboard");
}
