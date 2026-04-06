import { Suspense } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { getAuth } from "@/lib/auth-cached";
import {
  Globe,
  MapPin,
  Calendar,
  Users,
  Camera,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

// ---------------------------------------------------------------------------
// Async server component — resolves session + DB query then streams the
// personalised hero CTA and user stats into the static shell.
// ---------------------------------------------------------------------------
async function AuthSection() {
  const session = await getAuth();

  if (!session?.user?.id) {
    // Unauthenticated: show sign-in CTA
    return (
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/api/auth/signin">
          <Button size="lg" className="min-w-50">
            Get Started Free
          </Button>
        </Link>
        <Link href="#features">
          <Button variant="outline" size="lg" className="min-w-50">
            Learn More
          </Button>
        </Link>
      </div>
    );
  }

  // Authenticated: fetch stats and show personalised content
  const trips = await prisma.trip.findMany({
    where: { userId: session.user.id },
    include: { locations: { select: { country: true } } },
  });

  const totalLocations = trips.reduce(
    (sum, trip) => sum + trip.locations.length,
    0
  );
  const countries = new Set(
    trips
      .flatMap((trip) => trip.locations.map((l) => l.country))
      .filter((c): c is string => Boolean(c) && c !== "Unknown")
  );
  const upcomingTrips = trips.filter(
    (trip) => new Date(trip.startDate) > new Date()
  ).length;

  return (
    <>
      {/* Personalised hero CTA */}
      <div className="flex flex-col sm:flex-row gap-4 justify-center">
        <Link href="/trips/new">
          <Button size="lg" className="min-w-50">
            <Calendar className="mr-2 h-5 w-5" />
            Create New Trip
          </Button>
        </Link>
        <Link href="/globe">
          <Button variant="outline" size="lg" className="min-w-50">
            <Globe className="mr-2 h-5 w-5" />
            View Your Globe
          </Button>
        </Link>
      </div>

      {/* User stats */}
      <section className="py-12 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-8">
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome back, {session.user.name}!
            </h2>
            <p className="text-gray-600">Here&apos;s your travel journey so far</p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6 text-center">
                <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                <div className="text-2xl font-bold text-gray-900">
                  {trips.length}
                </div>
                <div className="text-sm text-gray-600">Total Trips</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <MapPin className="h-8 w-8 mx-auto mb-2 text-green-600" />
                <div className="text-2xl font-bold text-gray-900">
                  {totalLocations}
                </div>
                <div className="text-sm text-gray-600">Places Visited</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <Globe className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                <div className="text-2xl font-bold text-gray-900">
                  {countries.size}
                </div>
                <div className="text-sm text-gray-600">Countries</div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6 text-center">
                <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                <div className="text-2xl font-bold text-gray-900">
                  {upcomingTrips}
                </div>
                <div className="text-sm text-gray-600">Upcoming Trips</div>
              </CardContent>
            </Card>
          </div>

          <div className="text-center mt-8">
            <Link href="/trips">
              <Button variant="outline">View All Trips</Button>
            </Link>
          </div>
        </div>
      </section>
    </>
  );
}

// Skeleton shown while AuthSection resolves — matches the height of the hero
// CTAs so there's no layout shift on the buttons.
function AuthSectionSkeleton() {
  return (
    <div className="flex flex-col sm:flex-row gap-4 justify-center">
      <div className="h-11 w-50 bg-gray-200 rounded-md animate-pulse mx-auto sm:mx-0" />
      <div className="h-11 w-50 bg-gray-100 rounded-md border animate-pulse mx-auto sm:mx-0" />
    </div>
  );
}

// ---------------------------------------------------------------------------
// Page — static shell, no async/dynamic data here.
// The hero, features and CTA sections are fully static and render instantly.
// The auth-dependent content (CTA buttons + user stats) streams in.
// ---------------------------------------------------------------------------
export default function Home() {
  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Plan Your Perfect
              <span className="block text-transparent bg-clip-text bg-linear-to-r from-blue-600 to-purple-600">
                Travel Adventure
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create detailed itineraries, track your visited locations, and
              visualize your journey on an interactive globe. Your travel
              memories, beautifully organized.
            </p>

            {/* Auth-dependent buttons + user stats stream in here */}
            <Suspense fallback={<AuthSectionSkeleton />}>
              <AuthSection />
            </Suspense>
          </div>
        </div>
      </section>

      {/* Features Section — fully static */}
      <section id="features" className="py-20 px-4 sm:px-6 lg:px-8 bg-white">
        <div className="max-w-7xl mx-auto">
          <div className="text-center mb-16">
            <h2 className="text-3xl font-bold text-gray-900 mb-4">
              Everything You Need to Plan Your Journey
            </h2>
            <p className="text-xl text-gray-600 max-w-2xl mx-auto">
              From planning to memories, we&apos;ve got all your travel needs
              covered
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Calendar className="h-6 w-6 text-blue-600" />
                </div>
                <CardTitle>Smart Trip Planning</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Create detailed itineraries with dates, locations, and
                  activities. Keep everything organized in one place.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-green-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <MapPin className="h-6 w-6 text-green-600" />
                </div>
                <CardTitle>Location Tracking</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Pin your favorite spots with precise coordinates. Never forget
                  that hidden gem you discovered.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Globe className="h-6 w-6 text-purple-600" />
                </div>
                <CardTitle>Interactive Globe</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Visualize your travels on a beautiful 3D globe. See your
                  journey from a whole new perspective.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-orange-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Users className="h-6 w-6 text-orange-600" />
                </div>
                <CardTitle>Easy Sharing</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Share your travel plans and memories with friends and family.
                  Inspire others with your adventures.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-red-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <Camera className="h-6 w-6 text-red-600" />
                </div>
                <CardTitle>Photo Memories</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Upload and organize photos from your trips. Create a visual
                  diary of your adventures.
                </p>
              </CardContent>
            </Card>

            <Card className="text-center">
              <CardHeader>
                <div className="w-12 h-12 bg-indigo-100 rounded-lg flex items-center justify-center mx-auto mb-4">
                  <TrendingUp className="h-6 w-6 text-indigo-600" />
                </div>
                <CardTitle>Travel Insights</CardTitle>
              </CardHeader>
              <CardContent>
                <p className="text-gray-600">
                  Track your travel statistics and discover patterns. See how
                  your wanderlust has grown over time.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section — static */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-linear-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Plan, visualize, and relive your adventures around the world.
          </p>
          <Link href="/api/auth/signin">
            <Button size="lg" variant="secondary" className="min-w-50">
              Sign Up for Free
            </Button>
          </Link>
        </div>
      </section>
    </div>
  );
}
