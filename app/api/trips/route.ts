import { auth } from "@/auth";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

export const dynamic = "force-dynamic"; // reads session cookies — never prerender

/**
 * GET /api/trips
 *
 * Returns all locations for the authenticated user's trips, enriched with
 * country data. Country is stored on the Location row at creation time so
 * this route makes zero external API calls — previously it called Google Maps
 * Geocoding once per location on every request (N+1).
 */
export async function GET() {
  try {
    const session = await auth();
    if (!session?.user?.id) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    const locations = await prisma.location.findMany({
      where: { trip: { userId: session.user.id } },
      select: {
        locationTitle: true,
        lat: true,
        lng: true,
        country: true,
        formattedAddress: true,
        trip: { select: { title: true } },
      },
    });

    const body = locations.map((loc) => ({
      name: `${loc.trip.title} - ${loc.formattedAddress ?? loc.locationTitle}`,
      lat: loc.lat,
      lng: loc.lng,
      country: loc.country ?? "Unknown",
    }));

    return NextResponse.json(body, {
      headers: {
        // Cache per-user in the browser for 60 s; CDN must not cache (private data).
        "Cache-Control": "private, max-age=60, stale-while-revalidate=300",
      },
    });
  } catch (error) {
    console.error("Error fetching trips:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
