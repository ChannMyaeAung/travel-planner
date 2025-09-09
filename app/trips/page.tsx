import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import React from "react";

export default async function TripsPage() {
  const session = await auth();
  if (!session) {
    return (
      <div className="flex items-center justify-center h-screen text-xl text-gray-700">
        Please Sign In.
      </div>
    );
  }
  return (
    <div className="container px-4 py-8 mx-auto space-y-6">
      <div>
        <h1>Dashboard</h1>
        <Link href={"/trips/new"}>
          <Button>New Trip</Button>
        </Link>
      </div>
    </div>
  );
}
