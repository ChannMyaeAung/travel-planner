import { getAuth } from "@/lib/auth-cached";
import { prisma } from "@/lib/prisma";
import { Button } from "@/components/ui/button";
import { Calendar, MapPin, Globe, TrendingUp } from "lucide-react";
import Link from "next/link";

export async function AuthSection() {
  const session = await getAuth();

  if (!session?.user?.id) {
    return (
      <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up animation-delay-300">
        <Link href="/sign-in">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200 px-8"
          >
            Get Started Free
          </Button>
        </Link>
        <Link href="#features">
          <Button
            variant="outline"
            size="lg"
            className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8"
          >
            See Features
          </Button>
        </Link>
      </div>
    );
  }

  const trips = await prisma.trip.findMany({
    where: { userId: session.user.id },
    include: { locations: { select: { country: true } } },
  });

  const totalLocations = trips.reduce((sum, t) => sum + t.locations.length, 0);
  const countries = new Set(
    trips
      .flatMap((t) => t.locations.map((l) => l.country))
      .filter((c): c is string => Boolean(c) && c !== "Unknown"),
  );
  const upcoming = trips.filter(
    (t) => new Date(t.startDate) > new Date(),
  ).length;

  return (
    <div className="space-y-8 animate-fade-in-up animation-delay-300">
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/trips/new">
          <Button
            size="lg"
            className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200 px-8"
          >
            <Calendar className="mr-2 h-4 w-4" />
            New Trip
          </Button>
        </Link>
        <Link href="/trips">
          <Button
            variant="outline"
            size="lg"
            className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8"
          >
            <MapPin className="mr-2 h-4 w-4" />
            My Trips
          </Button>
        </Link>
      </div>

      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {[
          {
            icon: Calendar,
            value: trips.length,
            label: "Trips",
            color: "text-blue-600",
            bg: "bg-blue-50",
          },
          {
            icon: MapPin,
            value: totalLocations,
            label: "Places",
            color: "text-emerald-600",
            bg: "bg-emerald-50",
          },
          {
            icon: Globe,
            value: countries.size,
            label: "Countries",
            color: "text-purple-600",
            bg: "bg-purple-50",
          },
          {
            icon: TrendingUp,
            value: upcoming,
            label: "Upcoming",
            color: "text-amber-600",
            bg: "bg-amber-50",
          },
        ].map(({ icon: Icon, value, label, color, bg }) => (
          <div
            key={label}
            className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm hover:shadow-md transition-shadow duration-200"
          >
            <div
              className={`inline-flex items-center justify-center w-8 h-8 ${bg} rounded-lg mb-2`}
            >
              <Icon className={`h-4 w-4 ${color}`} />
            </div>
            <div className="text-2xl font-bold text-slate-900">{value}</div>
            <div className="text-xs text-slate-500 mt-0.5">{label}</div>
          </div>
        ))}
      </div>
    </div>
  );
}

export function AuthSectionSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <div className="h-11 w-36 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-11 w-36 bg-slate-100 rounded-lg border border-slate-200 animate-pulse" />
      </div>
    </div>
  );
}

// ── Country strip ─────────────────────────────────────────────────────────────
// Shown below the hero. For logged-in users it shows real visited countries;
// for guests it shows sample countries as marketing copy.
const SAMPLE_COUNTRIES = ["Japan", "Italy", "New Zealand", "Iceland"];

export async function CountryStrip() {
  const session = await getAuth();

  let countries: string[] = [];

  if (session?.user?.id) {
    const locations = await prisma.location.findMany({
      where: {
        trip: { userId: session.user.id },
        country: { not: null },
      },
      select: { country: true },
      distinct: ["country"],
    });
    countries = locations
      .map((l) => l.country!)
      .filter((c) => c !== "Unknown")
      .sort();
  }

  const display = countries.length > 0 ? countries : SAMPLE_COUNTRIES;
  const isSample = countries.length === 0;

  return (
    <div className=" flex items-center justify-center gap-6 flex-wrap">
      {display.map((country, i) => (
        <div
          key={country}
          className={`flex items-center gap-2 text-sm text-slate-600 font-medium animate-fade-in animation-delay-${(i + 4) * 100}`}
        >
          <div className="w-2 h-2 bg-blue-500 rounded-full" />
          {country}
        </div>
      ))}
      <div className="flex items-center gap-1.5 text-xs text-slate-400">
        <Globe className="h-3.5 w-3.5" />
        <span>
          {isSample
            ? "and more waiting to be explored"
            : "countries visited so far"}
        </span>
      </div>
    </div>
  );
}

export function CountryStripSkeleton() {
  return (
    <div className="bg-slate-50 px-6 py-8 flex items-center justify-center gap-6 flex-wrap">
      {[80, 64, 72, 56].map((w) => (
        <div
          key={w}
          className={`h-4 w-${w} bg-slate-200 rounded animate-pulse`}
        />
      ))}
    </div>
  );
}
