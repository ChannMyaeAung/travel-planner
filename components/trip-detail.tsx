"use client";

import { Trip } from "@/app/generated/prisma";

interface TripDetailClientProps {
  trip: Trip;
}

export default function TripDetailClient({ trip }: TripDetailClientProps) {
  return (
    <div>
      <h1 className="text-3xl font-bold mb-4">{trip.title}</h1>
    </div>
  );
}
