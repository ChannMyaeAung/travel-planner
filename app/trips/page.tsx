import { getAuth } from "@/lib/auth-cached";
import { Button } from "@/components/ui/button";
import { prisma } from "@/lib/prisma";
import { Plus, Calendar, MapPin, Globe, Plane, Clock, ArrowRight } from "lucide-react";
import TripCardActions from "@/components/TripCardActions";
import Link from "next/link";
import Image from "next/image";

export const dynamic = "force-dynamic";

export default async function TripsPage() {
  const session = await getAuth();

  if (!session) {
    return (
      <div className="min-h-screen bg-slate-50 flex items-center justify-center p-4">
        <div className="text-center max-w-sm animate-fade-in-up">
          <div className="inline-flex items-center justify-center w-14 h-14 bg-blue-100 rounded-2xl mb-4">
            <Globe className="h-7 w-7 text-blue-600" />
          </div>
          <h2 className="text-xl font-bold text-slate-900 mb-2">Sign in to view your trips</h2>
          <p className="text-slate-500 text-sm mb-6">Start planning your next adventure.</p>
          <Link href="/sign-in">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white w-full">Sign In</Button>
          </Link>
        </div>
      </div>
    );
  }

  const trips = await prisma.trip.findMany({
    where: { userId: session.user?.id },
    include: { locations: true },
    orderBy: { startDate: "desc" },
  });

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcoming = trips.filter((t) => new Date(t.startDate) >= today);
  const past = trips.filter((t) => new Date(t.endDate) < today);
  const totalPlaces = trips.reduce((s, t) => s + t.locations.length, 0);

  const getStatus = (trip: (typeof trips)[number]) => {
    const start = new Date(trip.startDate);
    const end = new Date(trip.endDate);
    if (start > today) return { label: "Upcoming", classes: "bg-emerald-50 text-emerald-700 border-emerald-200" };
    if (end < today) return { label: "Completed", classes: "bg-slate-100 text-slate-600 border-slate-200" };
    return { label: "Active", classes: "bg-blue-50 text-blue-700 border-blue-200" };
  };

  return (
    <div className="min-h-screen bg-slate-50">
      <div className="max-w-6xl mx-auto px-4 py-10 sm:px-6 lg:px-8 space-y-8">

        {/* Header */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 animate-fade-in-up">
          <div>
            <h1 className="text-3xl font-bold text-slate-900">My Trips</h1>
            <p className="text-slate-500 mt-1 text-sm">
              {trips.length === 0 ? "No trips yet — create your first one" : `${trips.length} ${trips.length === 1 ? "trip" : "trips"} planned`}
            </p>
          </div>
          <Link href="/trips/new">
            <Button className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm hover:shadow-md transition-all duration-200">
              <Plus className="mr-2 h-4 w-4" />
              New Trip
            </Button>
          </Link>
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-3 gap-4 animate-fade-in-up animation-delay-75">
          {[
            { icon: Plane, value: trips.length, label: "Total", color: "text-blue-600", bg: "bg-blue-50" },
            { icon: Clock, value: upcoming.length, label: "Upcoming", color: "text-emerald-600", bg: "bg-emerald-50" },
            { icon: MapPin, value: totalPlaces, label: "Places", color: "text-purple-600", bg: "bg-purple-50" },
          ].map(({ icon: Icon, value, label, color, bg }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
              <div className={`inline-flex items-center justify-center w-8 h-8 ${bg} rounded-lg mb-2`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <div className="text-2xl font-bold text-slate-900">{value}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </div>
          ))}
        </div>

        {/* Empty state */}
        {trips.length === 0 && (
          <div className="bg-white rounded-2xl border border-slate-200 p-16 text-center animate-fade-in-up animation-delay-150">
            <div className="inline-flex items-center justify-center w-16 h-16 bg-blue-50 rounded-2xl mb-4">
              <Plane className="h-8 w-8 text-blue-500" />
            </div>
            <h3 className="text-lg font-semibold text-slate-900 mb-2">No trips yet</h3>
            <p className="text-slate-500 text-sm mb-6 max-w-xs mx-auto">
              Create your first trip and start building your travel story.
            </p>
            <Link href="/trips/new">
              <Button className="bg-blue-600 hover:bg-blue-700 text-white">
                <Plus className="mr-2 h-4 w-4" />
                Create First Trip
              </Button>
            </Link>
          </div>
        )}

        {/* Upcoming */}
        {upcoming.length > 0 && (
          <section className="animate-fade-in-up animation-delay-100">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Clock className="h-4 w-4 text-emerald-500" /> Upcoming
            </h2>
            <TripGrid trips={upcoming} getStatus={getStatus} />
          </section>
        )}

        {/* Past */}
        {past.length > 0 && (
          <section className="animate-fade-in-up animation-delay-150">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Plane className="h-4 w-4 text-slate-400" /> Past trips
            </h2>
            <TripGrid trips={past} getStatus={getStatus} />
          </section>
        )}

        {/* Active (in-progress) — not upcoming, not past */}
        {trips.filter((t) => {
          const s = new Date(t.startDate); const e = new Date(t.endDate);
          return s <= today && e >= today;
        }).length > 0 && (
          <section className="animate-fade-in-up animation-delay-200">
            <h2 className="text-sm font-semibold text-slate-500 uppercase tracking-wider mb-4 flex items-center gap-2">
              <Globe className="h-4 w-4 text-blue-500" /> In progress
            </h2>
            <TripGrid
              trips={trips.filter((t) => {
                const s = new Date(t.startDate); const e = new Date(t.endDate);
                return s <= today && e >= today;
              })}
              getStatus={getStatus}
            />
          </section>
        )}
      </div>
    </div>
  );
}

// ─── Trip card grid ───────────────────────────────────────────────────────────
type Trip = Awaited<ReturnType<typeof prisma.trip.findMany<{ include: { locations: true } }>>>[number];

function TripGrid({
  trips,
  getStatus,
}: {
  trips: Trip[];
  getStatus: (t: Trip) => { label: string; classes: string };
}) {
  return (
    <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4">
      {trips.map((trip) => {
        const { label, classes } = getStatus(trip);
        const duration = Math.ceil(
          (new Date(trip.endDate).getTime() - new Date(trip.startDate).getTime()) /
            (1000 * 60 * 60 * 24)
        );
        return (
          <Link href={`/trips/${trip.id}`} key={trip.id}>
            <div className="bg-white rounded-xl border border-slate-200 overflow-hidden hover:shadow-md hover:-translate-y-0.5 transition-all duration-200 group h-full">
              {/* Cover image or placeholder */}
              <div className="relative h-40 overflow-hidden">
                {trip.imageUrl ? (
                  <Image
                    src={trip.imageUrl}
                    alt={trip.title}
                    fill
                    className="object-cover group-hover:scale-105 transition-transform duration-300"
                  />
                ) : (
                  <div className="h-full bg-linear-to-br from-blue-500 to-indigo-600 flex items-center justify-center">
                    <Plane className="h-10 w-10 text-white/60" />
                  </div>
                )}
                <div className="absolute top-3 right-3">
                  <span className={`text-xs font-medium px-2 py-1 rounded-full border ${classes} backdrop-blur-sm bg-white/80`}>
                    {label}
                  </span>
                </div>
              </div>

              {/* Content */}
              <div className="p-4 space-y-3">
                <h3 className="font-semibold text-slate-900 line-clamp-1 group-hover:text-blue-600 transition-colors duration-200">
                  {trip.title}
                </h3>
                <p className="text-xs text-slate-500 line-clamp-2 leading-relaxed">
                  {trip.description}
                </p>
                <div className="flex items-center justify-between pt-1">
                  <div className="flex items-center gap-3 text-xs text-slate-400">
                    <span className="flex items-center gap-1">
                      <Calendar className="h-3 w-3" />
                      {duration}d
                    </span>
                    <span className="flex items-center gap-1">
                      <MapPin className="h-3 w-3" />
                      {trip.locations.length}
                    </span>
                  </div>
                  <div className="flex items-center gap-1">
                    <TripCardActions tripId={trip.id} />
                    <ArrowRight className="h-4 w-4 text-slate-300 group-hover:text-blue-500 group-hover:translate-x-0.5 transition-all duration-200 ml-1" />
                  </div>
                </div>
              </div>
            </div>
          </Link>
        );
      })}
    </div>
  );
}
