"use server";

import { getAuth } from "@/lib/auth-cached";
import { prisma } from "../prisma";
import { redirect } from "next/navigation";
import { getCountryFromCoordinates } from "@/lib/actions/geocode";

async function geocodeAddress(address: string) {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?address=${encodeURIComponent(
      address
    )}&key=${apiKey}`
  );

  const data = await response.json();

  if (!data.results?.[0]) {
    throw new Error(`Could not geocode address: ${address}`);
  }

  const { lat, lng } = data.results[0].geometry.location;
  return { lat, lng };
}

export async function addLocation(formData: FormData, tripId: string) {
  const session = await getAuth();
  if (!session) {
    throw new Error("Unauthorized");
  }

  const address = formData.get("address")?.toString();
  if (!address) {
    throw new Error("Address is required");
  }

  // Geocode the address to get coordinates
  const { lat, lng } = await geocodeAddress(address);

  // Reverse geocode to get country + formatted address — stored once at write
  // time so the globe page never needs to call the Maps API at read time.
  const { country, formattedAddress } = await getCountryFromCoordinates(lat, lng);

  const count = await prisma.location.count({
    where: { tripId },
  });

  await prisma.location.create({
    data: {
      locationTitle: address,
      lat,
      lng,
      country: country || "Unknown",
      formattedAddress: formattedAddress || address,
      tripId,
      order: count,
    },
  });

  redirect(`/trips/${tripId}`);
}
