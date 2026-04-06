import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth-cached";
import {
  Globe,
  MapPin,
  Calendar,
  TrendingUp,
  ArrowRight,
  Route,
  Camera,
} from "lucide-react";
import Link from "next/link";
import Image from "next/image";

// ─── Auth-dependent section (streams in) ─────────────────────────────────────
async function AuthSection() {
  const session = await getAuth();

  if (!session?.user?.id) {
    return (
      <div className="flex flex-col sm:flex-row gap-3 justify-center animate-fade-in-up animation-delay-300">
        <Link href="/sign-in">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200 px-8">
            Get Started Free
          </Button>
        </Link>
        <Link href="#features">
          <Button variant="outline" size="lg" className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8">
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
      .filter((c): c is string => Boolean(c) && c !== "Unknown")
  );
  const upcoming = trips.filter((t) => new Date(t.startDate) > new Date()).length;

  return (
    <div className="space-y-8 animate-fade-in-up animation-delay-300">
      {/* CTA buttons */}
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <Link href="/trips/new">
          <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200 px-8">
            <Calendar className="mr-2 h-4 w-4" />
            New Trip
          </Button>
        </Link>
        <Link href="/trips">
          <Button variant="outline" size="lg" className="border-slate-300 text-slate-700 hover:bg-slate-50 px-8">
            <MapPin className="mr-2 h-4 w-4" />
            My Trips
          </Button>
        </Link>
      </div>

      {/* Inline stats */}
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 max-w-2xl mx-auto">
        {[
          { icon: Calendar, value: trips.length, label: "Trips", color: "text-blue-600", bg: "bg-blue-50" },
          { icon: MapPin, value: totalLocations, label: "Places", color: "text-emerald-600", bg: "bg-emerald-50" },
          { icon: Globe, value: countries.size, label: "Countries", color: "text-purple-600", bg: "bg-purple-50" },
          { icon: TrendingUp, value: upcoming, label: "Upcoming", color: "text-amber-600", bg: "bg-amber-50" },
        ].map(({ icon: Icon, value, label, color, bg }) => (
          <div key={label} className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm hover:shadow-md transition-shadow duration-200">
            <div className={`inline-flex items-center justify-center w-8 h-8 ${bg} rounded-lg mb-2`}>
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

function AuthSectionSkeleton() {
  return (
    <div className="space-y-8">
      <div className="flex flex-col sm:flex-row gap-3 justify-center">
        <div className="h-11 w-36 bg-slate-200 rounded-lg animate-pulse" />
        <div className="h-11 w-36 bg-slate-100 rounded-lg border border-slate-200 animate-pulse" />
      </div>
    </div>
  );
}

// ─── Feature data ─────────────────────────────────────────────────────────────
const FEATURES = [
  {
    icon: Route,
    title: "Smart Itineraries",
    description: "Build day-by-day plans with drag-and-drop reordering. Every destination, perfectly sequenced.",
    color: "text-blue-600",
    bg: "bg-blue-50",
  },
  {
    icon: MapPin,
    title: "Location Tracking",
    description: "Geocode any address and pin it on an interactive map. Never lose a hidden gem again.",
    color: "text-emerald-600",
    bg: "bg-emerald-50",
  },
  {
    icon: Globe,
    title: "3D Travel Globe",
    description: "See every place you've visited rendered on a spinning globe. Your journey, visualized.",
    color: "text-purple-600",
    bg: "bg-purple-50",
  },
  {
    icon: Camera,
    title: "Trip Cover Photos",
    description: "Upload a cover image for each trip and build a visual diary of your adventures.",
    color: "text-rose-600",
    bg: "bg-rose-50",
  },
  {
    icon: TrendingUp,
    title: "Travel Stats",
    description: "Track countries visited, places explored, and upcoming adventures at a glance.",
    color: "text-amber-600",
    bg: "bg-amber-50",
  },
  {
    icon: Calendar,
    title: "Date Planning",
    description: "Set start and end dates, see trip status at a glance — upcoming, active, or completed.",
    color: "text-indigo-600",
    bg: "bg-indigo-50",
  },
];

// ─── Page ─────────────────────────────────────────────────────────────────────
export default function Home() {
  return (
    <div className="min-h-screen bg-white">
      {/* ── Hero ── */}
      <section className="relative pt-24 pb-20 px-4 sm:px-6 lg:px-8 overflow-hidden">
        {/* Subtle background blobs */}
        <div className="absolute inset-0 -z-10">
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-blue-100/60 rounded-full blur-3xl" />
          <div className="absolute bottom-0 right-1/4 w-80 h-80 bg-purple-100/50 rounded-full blur-3xl" />
        </div>

        <div className="max-w-4xl mx-auto text-center space-y-8">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 bg-blue-50 border border-blue-100 rounded-full text-xs font-medium text-blue-700 animate-fade-in">
            <span className="w-1.5 h-1.5 bg-blue-500 rounded-full" />
            Your personal travel planner
          </div>

          <h1 className="text-5xl sm:text-6xl font-bold text-slate-900 leading-tight tracking-tight animate-fade-in-up animation-delay-75">
            Plan trips.{" "}
            <span className="text-blue-600">Track places.</span>
            <br />
            Explore the world.
          </h1>

          <p className="text-lg text-slate-500 max-w-xl mx-auto leading-relaxed animate-fade-in-up animation-delay-150">
            Build detailed itineraries, pin your favourite spots on a map, and
            watch your adventures unfold on an interactive 3D globe.
          </p>

          <Suspense fallback={<AuthSectionSkeleton />}>
            <AuthSection />
          </Suspense>
        </div>

        {/* Preview image strip */}
        <div className="mt-16 max-w-5xl mx-auto animate-fade-in-up animation-delay-400">
          <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-xl">
            <div className="h-2 bg-linear-to-r from-blue-500 via-purple-500 to-pink-500" />
            <div className="bg-slate-50 px-6 py-8 flex items-center justify-center gap-8 flex-wrap">
              {["Myanmar (Burma)", "Thailand", "Australia", "Switzerland"].map((country, i) => (
                <div key={country} className={`flex items-center gap-2 text-sm text-slate-600 font-medium animate-fade-in animation-delay-${(i + 4) * 100}`}>
                  <div className="w-2 h-2 bg-blue-500 rounded-full" />
                  {country}
                </div>
              ))}
              <div className="flex items-center gap-1.5 text-xs text-slate-400">
                <Globe className="h-3.5 w-3.5" />
                <span>and more waiting to be explored</span>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* ── Features ── */}
      <section id="features" className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-slate-900 mb-4">
              Everything you need to plan better trips
            </h2>
            <p className="text-slate-500 max-w-xl mx-auto">
              From first idea to fond memory — every tool in one place.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {FEATURES.map(({ icon: Icon, title, description, color, bg }) => (
              <div
                key={title}
                className="bg-white rounded-xl border border-slate-200 p-6 hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group"
              >
                <div className={`inline-flex items-center justify-center w-10 h-10 ${bg} rounded-lg mb-4`}>
                  <Icon className={`h-5 w-5 ${color}`} />
                </div>
                <h3 className="font-semibold text-slate-900 mb-2">{title}</h3>
                <p className="text-sm text-slate-500 leading-relaxed">{description}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA ── */}
      <section className="py-24 px-4 sm:px-6 lg:px-8 bg-slate-900">
        <div className="max-w-2xl mx-auto text-center space-y-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-600 rounded-xl mb-2">
            <Image src="/logo.png" alt="logo" width={24} height={24} className="brightness-0 invert" />
          </div>
          <h2 className="text-3xl font-bold text-white">
            Ready to start your journey?
          </h2>
          <p className="text-slate-400">
            Create your first trip in under a minute. No credit card required.
          </p>
          <Link href="/sign-in">
            <Button size="lg" className="bg-blue-600 hover:bg-blue-700 text-white shadow-lg hover:shadow-xl transition-all duration-200 px-8 mt-2">
              Get Started Free
              <ArrowRight className="ml-2 h-4 w-4" />
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
