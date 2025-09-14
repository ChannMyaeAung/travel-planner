import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import {
  Globe,
  MapPin,
  Calendar,
  Users,
  Camera,
  TrendingUp,
} from "lucide-react";
import Link from "next/link";

export default async function Home() {
  const session = await auth();

  // Get user's trip statistics if authenticated
  let userStats = null;
  if (session?.user?.id) {
    const trips = await prisma.trip.findMany({
      where: { userId: session.user.id },
      include: { locations: true },
    });

    const totalLocations = trips.reduce(
      (sum, trip) => sum + trip.locations.length,
      0
    );
    const countries = new Set(
      // We'd need geocoding here for real countries, using placeholder for now
      trips.flatMap(() => ["Unknown"])
    );

    userStats = {
      tripCount: trips.length,
      locationCount: totalLocations,
      countryCount: countries.size,
      upcomingTrips: trips.filter(
        (trip) => new Date(trip.startDate) > new Date()
      ).length,
    };
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      {/* Hero Section */}
      <section className="relative py-20 px-4 sm:px-6 lg:px-8">
        <div className="max-w-7xl mx-auto">
          <div className="text-center">
            <h1 className="text-4xl sm:text-6xl font-bold text-gray-900 mb-6">
              Plan Your Perfect
              <span className="block text-transparent bg-clip-text bg-gradient-to-r from-blue-600 to-purple-600">
                Travel Adventure
              </span>
            </h1>
            <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
              Create detailed itineraries, track your visited locations, and
              visualize your journey on an interactive globe. Your travel
              memories, beautifully organized.
            </p>

            {session ? (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/trips/new">
                  <Button size="lg" className="min-w-[200px]">
                    <Calendar className="mr-2 h-5 w-5" />
                    Create New Trip
                  </Button>
                </Link>
                <Link href="/globe">
                  <Button variant="outline" size="lg" className="min-w-[200px]">
                    <Globe className="mr-2 h-5 w-5" />
                    View Your Globe
                  </Button>
                </Link>
              </div>
            ) : (
              <div className="flex flex-col sm:flex-row gap-4 justify-center">
                <Link href="/api/auth/signin">
                  <Button size="lg" className="min-w-[200px]">
                    Get Started Free
                  </Button>
                </Link>
                <Link href="#features">
                  <Button variant="outline" size="lg" className="min-w-[200px]">
                    Learn More
                  </Button>
                </Link>
              </div>
            )}
          </div>
        </div>
      </section>

      {/* User Stats Section (for authenticated users) */}
      {session && userStats && (
        <section className="py-12 px-4 sm:px-6 lg:px-8">
          <div className="max-w-7xl mx-auto">
            <div className="text-center mb-8">
              <h2 className="text-2xl font-bold text-gray-900 mb-2">
                Welcome back, {session.user?.name}!
              </h2>
              <p className="text-gray-600">
                Here&apos;s your travel journey so far
              </p>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
              <Card>
                <CardContent className="p-6 text-center">
                  <Calendar className="h-8 w-8 mx-auto mb-2 text-blue-600" />
                  <div className="text-2xl font-bold text-gray-900">
                    {userStats.tripCount}
                  </div>
                  <div className="text-sm text-gray-600">Total Trips</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-green-600" />
                  <div className="text-2xl font-bold text-gray-900">
                    {userStats.locationCount}
                  </div>
                  <div className="text-sm text-gray-600">Places Visited</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <Globe className="h-8 w-8 mx-auto mb-2 text-purple-600" />
                  <div className="text-2xl font-bold text-gray-900">
                    {userStats.countryCount}
                  </div>
                  <div className="text-sm text-gray-600">Countries</div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-orange-600" />
                  <div className="text-2xl font-bold text-gray-900">
                    {userStats.upcomingTrips}
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
      )}

      {/* Features Section */}
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
            {/* Feature 1 */}
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

            {/* Feature 2 */}
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

            {/* Feature 3 */}
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

            {/* Feature 4 */}
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

            {/* Feature 5 */}
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

            {/* Feature 6 */}
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

      {/* CTA Section */}
      <section className="py-20 px-4 sm:px-6 lg:px-8 bg-gradient-to-r from-blue-600 to-purple-600">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl font-bold text-white mb-4">
            Ready to Start Your Journey?
          </h2>
          <p className="text-xl text-blue-100 mb-8">
            Join thousands of travelers who trust us with their adventures
          </p>

          {!session && (
            <Link href="/api/auth/signin">
              <Button size="lg" variant="secondary" className="min-w-[200px]">
                Sign Up for Free
              </Button>
            </Link>
          )}
        </div>
      </section>
    </div>
  );
}
