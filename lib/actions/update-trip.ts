"use server";

import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth-cached";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function updateTrip(tripId: string, formData: FormData) {
  const session = await getAuth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  const title = formData.get("title") as string;
  const description = formData.get("description") as string;
  const startDate = new Date(formData.get("startDate") as string);
  const endDate = new Date(formData.get("endDate") as string);
  const imageUrl = (formData.get("imageUrl") as string) || null;

  if (!title || !description || !startDate || !endDate)
    throw new Error("Missing required fields");

  // Verify ownership
  const existing = await prisma.trip.findUnique({
    where: { id: tripId, userId: session.user.id },
    select: { id: true },
  });
  if (!existing) throw new Error("Trip not found");

  await prisma.trip.update({
    where: { id: tripId },
    data: { title, description, startDate, endDate, imageUrl },
  });

  revalidatePath(`/trips/${tripId}`);
  revalidatePath("/trips");
  redirect(`/trips/${tripId}`);
}
