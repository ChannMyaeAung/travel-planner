/**
 * One-time script — backfills country + formattedAddress for locations that
 * were created before those fields were added to the schema.
 *
 * Run once with:
 *   npx tsx scripts/backfill-countries.ts
 *
 * Safe to re-run: skips rows that already have a country value.
 */

import { PrismaClient } from "../app/generated/prisma/client";

const prisma = new PrismaClient();

async function getCountry(lat: number, lng: number) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;
  const res = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
  );
  const data = await res.json();
  const result = data.results?.[0];
  if (!result) return { country: "Unknown", formattedAddress: null };

  const countryComponent = result.address_components?.find(
    (c: { types: string[] }) => c.types.includes("country")
  );

  return {
    country: countryComponent?.long_name ?? "Unknown",
    formattedAddress: result.formatted_address ?? null,
  };
}

async function main() {
  const locations = await prisma.location.findMany({
    where: { country: null },
    select: { id: true, lat: true, lng: true, locationTitle: true },
  });

  console.log(`Found ${locations.length} location(s) without country data.`);

  for (const loc of locations) {
    process.stdout.write(`  Geocoding "${loc.locationTitle}"... `);
    const { country, formattedAddress } = await getCountry(loc.lat, loc.lng);
    await prisma.location.update({
      where: { id: loc.id },
      data: { country, formattedAddress },
    });
    console.log(`→ ${country}`);
    // Small delay to stay within Google Maps API rate limits
    await new Promise((r) => setTimeout(r, 200));
  }

  console.log("Done.");
}

main()
  .catch(console.error)
  .finally(() => prisma.$disconnect());
