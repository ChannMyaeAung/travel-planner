// Import necessary modules for authentication, geocoding, database access, and API responses
import { auth } from "@/auth";
import { getCountryFromCoordinates } from "@/lib/actions/geocode";
import { prisma } from "@/lib/prisma";
import { NextResponse } from "next/server";

/**
 * GET /api/trips
 *
 * Retrieves all locations from trips belonging to the authenticated user.
 * Each location is enriched with geocoding information to provide formatted addresses and country data.
 *
 * @returns {Promise<NextResponse>} JSON array of location objects with the following structure:
 * - name: Combined trip title and formatted address
 * - lat: Latitude coordinate
 * - lng: Longitude coordinate
 * - country: Country name derived from coordinates
 *
 * @throws {401} Unauthorized - If user is not authenticated
 * @throws {500} Internal Server Error - If database or geocoding operations fail
 */
export async function GET() {
  try {
    // Authenticate the user session
    const session = await auth();
    if (!session) {
      return new NextResponse("Unauthorized", { status: 401 });
    }

    // Query database for all locations belonging to the authenticated user's trips
    // Uses relation filtering to only get locations from trips owned by the current user
    const locations = await prisma.location.findMany({
      where: { trip: { userId: session.user?.id } },
      select: {
        locationTitle: true, // Name/title of the location
        lat: true, // Latitude coordinate
        lng: true, // Longitude coordinate
        trip: {
          select: {
            title: true, // Trip title for display purposes
          },
        },
      },
    });

    // Transform each location by adding geocoding information
    // This enriches the data with formatted addresses and country information
    const transformedLocations = await Promise.all(
      locations.map(async (loc) => {
        // Reverse geocode the coordinates to get address and country information
        const geocodeResult = await getCountryFromCoordinates(loc.lat, loc.lng);

        // Return enriched location object
        return {
          name: `${loc.trip.title} - ${geocodeResult.formattedAddress}`, // Combine trip title with address
          lat: loc.lat, // Preserve original latitude
          lng: loc.lng, // Preserve original longitude
          country: geocodeResult.country || "Unknown", // Country name with fallback
        };
      })
    );

    // Return the transformed locations as JSON response
    return NextResponse.json(transformedLocations);
  } catch (error) {
    // Handle any errors that occur during database queries or geocoding operations
    console.error("Error fetching trips:", error);
    return new NextResponse("Internal Server Error", { status: 500 });
  }
}
