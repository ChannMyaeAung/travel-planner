"use server";

import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth-cached";
import { revalidatePath } from "next/cache";
import { redirect } from "next/navigation";

export async function deleteTrip(tripId: string) {
  const session = await getAuth();
  if (!session?.user?.id) throw new Error("Unauthorized");

  // Verify ownership before deleting
  const trip = await prisma.trip.findUnique({
    where: { id: tripId, userId: session.user.id },
    select: { id: true },
  });
  if (!trip) throw new Error("Trip not found");

  await prisma.trip.delete({ where: { id: tripId } });

  revalidatePath("/trips");
  redirect("/trips");
}
