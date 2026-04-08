import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth-cached";
import { notFound, redirect } from "next/navigation";
import EditTripForm from "./EditTripForm";

export const dynamic = "force-dynamic";

export default async function EditTripPage({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;
  const session = await getAuth();
  if (!session?.user?.id) redirect("/sign-in");

  const trip = await prisma.trip.findUnique({
    where: { id: tripId, userId: session.user.id },
    select: {
      id: true,
      title: true,
      description: true,
      startDate: true,
      endDate: true,
      imageUrl: true,
    },
  });

  if (!trip) notFound();

  return <EditTripForm trip={trip} />;
}
