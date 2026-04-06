import NewLocationClient from "@/components/new-location";

export const dynamic = "force-dynamic";

export default async function NewLocation({
  params,
}: {
  params: Promise<{ tripId: string }>;
}) {
  const { tripId } = await params;

  return <NewLocationClient tripId={tripId} />;
}
