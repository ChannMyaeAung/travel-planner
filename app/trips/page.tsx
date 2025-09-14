import { auth } from "@/auth";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { prisma } from "@/lib/prisma";
import { Plus, Calendar, MapPin, Clock, Globe, Plane } from "lucide-react";
import Link from "next/link";
import React from "react";

export default async function TripsPage() {
  const session = await auth();

  const trips = await prisma.trip.findMany({
    where: { userId: session?.user?.id },
    include: { locations: true },
  });

  const sortedTrips = [...trips].sort(
    (a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime()
  );

  const today = new Date();
  today.setHours(0, 0, 0, 0);

  const upcomingTrips = sortedTrips.filter(
    (trip) => new Date(trip.startDate) >= today
  );

  if (!session) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-blue-50 to-purple-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="text-center py-8">
            <Globe className="h-16 w-16 mx-auto mb-4 text-blue-500" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Welcome to Travel Planner
            </h2>
            <p className="text-gray-600 mb-6">
              Please sign in to access your trips and start planning your
              adventures.
            </p>
            <Link href="/api/auth/signin">
              <Button className="w-full">Sign In to Continue</Button>
            </Link>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 via-white to-purple-50">
      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Header Section */}
        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
          <div>
            <h1 className="text-4xl font-bold text-gray-900 mb-2">
              Your Journeys
            </h1>
            <p className="text-lg text-gray-600">
              Track your adventures and plan new ones
            </p>
          </div>
          <Link href={"/trips/new"}>
            <Button
              size="lg"
              className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 shadow-lg"
            >
              <Plus className="mr-2 h-5 w-5" />
              New Trip
            </Button>
          </Link>
        </div>

        {/* Stats Overview */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          <Card className="bg-gradient-to-br from-blue-500 to-blue-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-blue-100 text-sm font-medium">
                    Total Trips
                  </p>
                  <p className="text-3xl font-bold">{trips.length}</p>
                </div>
                <Plane className="h-8 w-8 text-blue-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-green-500 to-green-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-green-100 text-sm font-medium">Upcoming</p>
                  <p className="text-3xl font-bold">{upcomingTrips.length}</p>
                </div>
                <Calendar className="h-8 w-8 text-green-200" />
              </div>
            </CardContent>
          </Card>

          <Card className="bg-gradient-to-br from-purple-500 to-purple-600 text-white border-0">
            <CardContent className="p-6">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-purple-100 text-sm font-medium">Places</p>
                  <p className="text-3xl font-bold">
                    {trips.reduce(
                      (sum, trip) => sum + trip.locations.length,
                      0
                    )}
                  </p>
                </div>
                <MapPin className="h-8 w-8 text-purple-200" />
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Welcome Message */}
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-8">
            <div className="flex items-center space-x-4">
              <div className="w-12 h-12 bg-gradient-to-br from-blue-500 to-purple-600 rounded-full flex items-center justify-center">
                <Globe className="h-6 w-6 text-white" />
              </div>
              <div>
                <h2 className="text-xl font-semibold text-gray-900">
                  Welcome back, {session.user?.name}!
                </h2>
                <p className="text-gray-600">
                  {trips.length === 0
                    ? "Ready to start your first adventure? Create your first trip to begin exploring the world!"
                    : `You have ${trips.length} ${
                        trips.length === 1 ? "trip" : "trips"
                      } planned. ${
                        upcomingTrips.length > 0
                          ? `${upcomingTrips.length} ${
                              upcomingTrips.length === 1
                                ? "adventure awaits"
                                : "adventures await"
                            }!`
                          : "Time to plan your next adventure!"
                      }`}
                </p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Trips Section */}
        {trips.length === 0 ? (
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="flex flex-col items-center justify-center py-16">
              <div className="w-24 h-24 bg-gradient-to-br from-blue-100 to-purple-100 rounded-full flex items-center justify-center mb-6">
                <Plane className="h-12 w-12 text-blue-600" />
              </div>
              <h3 className="text-2xl font-semibold text-gray-900 mb-2">
                No trips yet
              </h3>
              <p className="text-center text-gray-600 mb-8 max-w-md">
                Start planning your dream vacation! Create your first trip and
                begin collecting memories from around the world.
              </p>
              <Link href={"/trips/new"}>
                <Button
                  size="lg"
                  className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                >
                  <Plus className="mr-2 h-5 w-5" />
                  Create Your First Trip
                </Button>
              </Link>
            </CardContent>
          </Card>
        ) : (
          <div className="space-y-8">
            {/* Upcoming Trips */}
            {upcomingTrips.length > 0 && (
              <div>
                <div className="flex items-center space-x-2 mb-6">
                  <Clock className="h-5 w-5 text-green-600" />
                  <h2 className="text-2xl font-bold text-gray-900">
                    Upcoming Adventures
                  </h2>
                </div>
                <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                  {upcomingTrips.map((trip) => (
                    <Link href={`/trips/${trip.id}`} key={trip.id}>
                      <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg overflow-hidden">
                        <div className="h-2 bg-gradient-to-r from-green-500 to-blue-500"></div>
                        <CardHeader className="pb-4">
                          <CardTitle className="line-clamp-1 group-hover:text-blue-600 transition-colors">
                            {trip.title}
                          </CardTitle>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-gray-600 line-clamp-2">
                            {trip.description}
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(
                              trip.startDate
                            ).toLocaleDateString()} -{" "}
                            {new Date(trip.endDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-4 w-4 mr-2" />
                            {trip.locations.length}{" "}
                            {trip.locations.length === 1
                              ? "location"
                              : "locations"}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  ))}
                </div>
              </div>
            )}

            {/* All Trips */}
            <div>
              <div className="flex items-center space-x-2 mb-6">
                <Plane className="h-5 w-5 text-blue-600" />
                <h2 className="text-2xl font-bold text-gray-900">All Trips</h2>
              </div>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {sortedTrips.map((trip) => {
                  const isUpcoming = new Date(trip.startDate) >= today;
                  const isCompleted = new Date(trip.endDate) < today;

                  return (
                    <Link href={`/trips/${trip.id}`} key={trip.id}>
                      <Card className="group hover:shadow-xl transition-all duration-300 hover:-translate-y-1 border-0 shadow-lg overflow-hidden">
                        <div
                          className={`h-2 ${
                            isUpcoming
                              ? "bg-gradient-to-r from-green-500 to-blue-500"
                              : isCompleted
                              ? "bg-gradient-to-r from-gray-400 to-gray-500"
                              : "bg-gradient-to-r from-yellow-500 to-orange-500"
                          }`}
                        ></div>
                        <CardHeader className="pb-4">
                          <div className="flex items-start justify-between">
                            <CardTitle className="line-clamp-1 group-hover:text-blue-600 transition-colors">
                              {trip.title}
                            </CardTitle>
                            {isUpcoming && (
                              <span className="text-xs bg-green-100 text-green-700 px-2 py-1 rounded-full">
                                Upcoming
                              </span>
                            )}
                            {isCompleted && (
                              <span className="text-xs bg-gray-100 text-gray-700 px-2 py-1 rounded-full">
                                Completed
                              </span>
                            )}
                          </div>
                        </CardHeader>
                        <CardContent className="space-y-3">
                          <p className="text-sm text-gray-600 line-clamp-1">
                            {trip.description}
                          </p>
                          <div className="flex items-center text-sm text-gray-500">
                            <Calendar className="h-4 w-4 mr-2" />
                            {new Date(
                              trip.startDate
                            ).toLocaleDateString()} -{" "}
                            {new Date(trip.endDate).toLocaleDateString()}
                          </div>
                          <div className="flex items-center text-sm text-gray-500">
                            <MapPin className="h-4 w-4 mr-2" />
                            {trip.locations.length}{" "}
                            {trip.locations.length === 1
                              ? "location"
                              : "locations"}
                          </div>
                        </CardContent>
                      </Card>
                    </Link>
                  );
                })}
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
