"use client";

import { Location, Trip } from "@/app/generated/prisma";
import Image from "next/image";
import { Calendar, MapPin, Plus, ArrowLeft, Clock, Globe } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "./ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "./ui/tabs";
import { useState } from "react";
import Map from "./map";
import SortableItinerary from "./sortable-itinerary";

export type TripWithLocation = Trip & {
  locations: Location[];
};

interface TripDetailClientProps {
  trip: TripWithLocation;
}

export default function TripDetailClient({ trip }: TripDetailClientProps) {
  const [activeTab, setActiveTab] = useState("overview");

  const tripDuration = Math.ceil(
    (trip.endDate.getTime() - trip.startDate.getTime()) / (1000 * 60 * 60 * 24)
  );

  const uniqueCountries = new Set(
    trip.locations
      .map((l) => l.country)
      .filter((c): c is string => Boolean(c) && c !== "Unknown")
  );

  const today = new Date();
  const isUpcoming = new Date(trip.startDate) > today;
  const isActive =
    new Date(trip.startDate) <= today && new Date(trip.endDate) >= today;
  const isCompleted = new Date(trip.endDate) < today;

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      {/* Back Navigation */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-4">
          <Link href="/trips">
            <Button
              variant="ghost"
              className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
            >
              <ArrowLeft className="h-4 w-4" />
              <span>Back to Trips</span>
            </Button>
          </Link>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8 space-y-8">
        {/* Hero Section */}
        <div className="relative">
          {trip.imageUrl ? (
            <div className="w-full h-64 md:h-96 overflow-hidden rounded-2xl shadow-2xl relative">
              <Image
                src={trip.imageUrl}
                alt={trip.title}
                className="object-cover"
                fill
                priority
              />
              <div className="absolute inset-0 bg-linear-to-t from-black/60 to-transparent" />
              <div className="absolute bottom-6 left-6 right-6 text-white">
                <h1 className="text-3xl md:text-5xl font-bold mb-2">
                  {trip.title}
                </h1>
                <div className="flex items-center space-x-4 text-lg">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    {trip.startDate.toLocaleDateString()} -{" "}
                    {trip.endDate.toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    {tripDuration} {tripDuration === 1 ? "day" : "days"}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <Card className="bg-linear-to-br from-blue-600 to-purple-600 text-white border-0">
              <CardContent className="p-8 md:p-12">
                <h1 className="text-3xl md:text-5xl font-bold mb-4">
                  {trip.title}
                </h1>
                <div className="flex flex-wrap items-center gap-6 text-lg">
                  <div className="flex items-center">
                    <Calendar className="h-5 w-5 mr-2" />
                    {trip.startDate.toLocaleDateString()} -{" "}
                    {trip.endDate.toLocaleDateString()}
                  </div>
                  <div className="flex items-center">
                    <Clock className="h-5 w-5 mr-2" />
                    {tripDuration} {tripDuration === 1 ? "day" : "days"}
                  </div>
                </div>
              </CardContent>
            </Card>
          )}

          {/* Trip Status Badge */}
          <div className="absolute top-4 right-4">
            {isUpcoming && (
              <span className="bg-green-500 text-white px-4 py-2 rounded-full text-sm font-medium">
                Upcoming
              </span>
            )}
            {isActive && (
              <span className="bg-blue-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Active
              </span>
            )}
            {isCompleted && (
              <span className="bg-gray-500 text-white px-3 py-1 rounded-full text-sm font-medium">
                Completed
              </span>
            )}
          </div>
        </div>

        {/* Quick Stats & Actions */}
        <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <MapPin className="h-8 w-8 mx-auto mb-2 text-blue-600" />
              <div className="text-2xl font-bold text-gray-900">
                {trip.locations.length}
              </div>
              <div className="text-sm text-gray-600">
                {trip.locations.length === 1 ? "Location" : "Locations"}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Calendar className="h-8 w-8 mx-auto mb-2 text-green-600" />
              <div className="text-2xl font-bold text-gray-900">
                {tripDuration}
              </div>
              <div className="text-sm text-gray-600">
                {tripDuration === 1 ? "Day" : "Days"}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6 text-center">
              <Globe className="h-8 w-8 mx-auto mb-2 text-purple-600" />
              <div className="text-2xl font-bold text-gray-900">
                {uniqueCountries.size}
              </div>
              <div className="text-sm text-gray-600">
                {uniqueCountries.size === 1 ? "Country" : "Countries"}
              </div>
            </CardContent>
          </Card>

          <Card className="bg-white border-0 shadow-lg">
            <CardContent className="p-6 text-center self-center">
              <Link href={`/trips/${trip.id}/itinerary/new`}>
                <Button className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Add Location
                </Button>
              </Link>
            </CardContent>
          </Card>
        </div>

        {/* Main Content */}
        <Card className="bg-white border-0 shadow-lg">
          <CardContent className="p-6">
            <Tabs value={activeTab} onValueChange={setActiveTab}>
              <TabsList className="grid w-full grid-cols-3 mb-8 bg-gray-100">
                <TabsTrigger
                  value="overview"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600 font-medium"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="itinerary"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600 font-medium"
                >
                  Itinerary
                </TabsTrigger>
                <TabsTrigger
                  value="map"
                  className="data-[state=active]:bg-white data-[state=active]:text-blue-600 font-medium"
                >
                  Map View
                </TabsTrigger>
              </TabsList>

              <TabsContent value="overview" className="space-y-8">
                <div className="grid md:grid-cols-2 gap-8">
                  {/* Trip Details */}
                  <div className="space-y-6">
                    <Card className="border border-gray-200">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <Calendar className="h-5 w-5 text-blue-600" />
                          <span>Trip Details</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="space-y-4">
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Duration
                          </p>
                          <p className="text-lg text-gray-900">
                            {tripDuration} {tripDuration === 1 ? "day" : "days"}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Dates
                          </p>
                          <p className="text-lg text-gray-900">
                            {trip.startDate.toLocaleDateString()} -{" "}
                            {trip.endDate.toLocaleDateString()}
                          </p>
                        </div>
                        <div>
                          <p className="text-sm font-medium text-gray-700">
                            Locations
                          </p>
                          <p className="text-lg text-gray-900">
                            {trip.locations.length}{" "}
                            {trip.locations.length === 1
                              ? "location"
                              : "locations"}{" "}
                            planned
                          </p>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="border border-gray-200">
                      <CardHeader>
                        <CardTitle>Description</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <p className="text-gray-700 leading-relaxed">
                          {trip.description ||
                            "No description provided for this trip."}
                        </p>
                      </CardContent>
                    </Card>
                  </div>

                  {/* Map Preview */}
                  <div>
                    <Card className="border border-gray-200 h-full">
                      <CardHeader>
                        <CardTitle className="flex items-center space-x-2">
                          <MapPin className="h-5 w-5 text-green-600" />
                          <span>Map Preview</span>
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        {trip.locations.length > 0 ? (
                          <div className="h-80 rounded-lg overflow-hidden">
                            <Map itineraries={trip.locations} />
                          </div>
                        ) : (
                          <div className="h-80 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-center p-6">
                            <MapPin className="h-12 w-12 text-gray-400 mb-4" />
                            <p className="text-gray-600 mb-4">
                              No locations added yet
                            </p>
                            <Link href={`/trips/${trip.id}/itinerary/new`}>
                              <Button variant="outline">
                                <Plus className="mr-2 h-4 w-4" />
                                Add Your First Location
                              </Button>
                            </Link>
                          </div>
                        )}
                      </CardContent>
                    </Card>
                  </div>
                </div>
              </TabsContent>

              <TabsContent value="itinerary" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Your Itinerary
                  </h2>
                  <Link href={`/trips/${trip.id}/itinerary/new`}>
                    <Button className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700">
                      <Plus className="mr-2 h-4 w-4" />
                      Add Location
                    </Button>
                  </Link>
                </div>

                {trip.locations.length === 0 ? (
                  <Card className="border border-gray-200">
                    <CardContent className="text-center p-12">
                      <Calendar className="h-16 w-16 text-gray-400 mx-auto mb-4" />
                      <h3 className="text-xl font-semibold text-gray-900 mb-2">
                        Your itinerary is empty
                      </h3>
                      <p className="text-gray-600 mb-6">
                        Start building your perfect trip by adding locations you
                        want to visit.
                      </p>
                      <Link href={`/trips/${trip.id}/itinerary/new`}>
                        <Button
                          size="lg"
                          className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                        >
                          <Plus className="mr-2 h-5 w-5" />
                          Add Your First Location
                        </Button>
                      </Link>
                    </CardContent>
                  </Card>
                ) : (
                  <Card className="border border-gray-200">
                    <CardContent className="p-6">
                      <SortableItinerary
                        locations={trip.locations}
                        tripId={trip.id}
                      />
                    </CardContent>
                  </Card>
                )}
              </TabsContent>

              <TabsContent value="map" className="space-y-6">
                <div className="flex justify-between items-center">
                  <h2 className="text-2xl font-bold text-gray-900">
                    Interactive Map
                  </h2>
                  <div className="text-sm text-gray-600">
                    {trip.locations.length}{" "}
                    {trip.locations.length === 1 ? "location" : "locations"}{" "}
                    plotted
                  </div>
                </div>

                <Card className="border border-gray-200">
                  <CardContent className="p-6">
                    {trip.locations.length > 0 ? (
                      <div className="h-96 rounded-lg overflow-hidden">
                        <Map itineraries={trip.locations} />
                      </div>
                    ) : (
                      <div className="h-96 bg-gray-100 rounded-lg flex flex-col items-center justify-center text-center p-8">
                        <Globe className="h-20 w-20 text-gray-400 mb-6" />
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                          No locations to display
                        </h3>
                        <p className="text-gray-600 mb-6 max-w-md">
                          Add locations to your trip to see them visualized on
                          this interactive map.
                        </p>
                        <Link href={`/trips/${trip.id}/itinerary/new`}>
                          <Button
                            size="lg"
                            className="bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                          >
                            <Plus className="mr-2 h-5 w-5" />
                            Add Locations
                          </Button>
                        </Link>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
