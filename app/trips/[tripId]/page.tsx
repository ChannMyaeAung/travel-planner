import { getAuth } from "@/lib/auth-cached";
import TripDetailClient from "@/components/trip-detail";
import { prisma } from "@/lib/prisma";

export const dynamic = "force-dynamic";

export default async function TripDetail({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;

  const session = await getAuth();

  if (!session) {
    return <div>Please sign in.</div>;
  }

  const trip = await prisma.trip.findFirst({
    where: { id: tripId, userId: session.user?.id },
    include: { locations: true },
  });
  if (!trip) {
    return <div>Trip not found.</div>;
  }
  return <TripDetailClient trip={trip} />;
}
