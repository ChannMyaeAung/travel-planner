"use client";

import { Location, Trip } from "@/app/generated/prisma";
import Image from "next/image";
import { Calendar, MapPin, Plus, ArrowLeft, Clock, Globe, Pencil } from "lucide-react";
import Link from "next/link";
import { Button } from "./ui/button";
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
  today.setHours(0, 0, 0, 0);
  const isUpcoming = new Date(trip.startDate) > today;
  const isActive =
    new Date(trip.startDate) <= today && new Date(trip.endDate) >= today;
  const isCompleted = new Date(trip.endDate) < today;

  const statusLabel = isUpcoming
    ? { text: "Upcoming", classes: "bg-emerald-50 text-emerald-700 border-emerald-200" }
    : isActive
    ? { text: "Active", classes: "bg-blue-50 text-blue-700 border-blue-200" }
    : isCompleted
    ? { text: "Completed", classes: "bg-slate-100 text-slate-600 border-slate-200" }
    : null;

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-5xl mx-auto px-4 sm:px-6 py-4 flex items-center justify-between">
          <Link href="/trips">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-500 hover:text-slate-900 -ml-2"
            >
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Back to Trips
            </Button>
          </Link>
          <Link href={`/trips/${trip.id}/edit`}>
            <Button
              variant="outline"
              size="sm"
              className="text-slate-600 border-slate-200 hover:border-slate-300 hover:bg-slate-50"
            >
              <Pencil className="h-3.5 w-3.5 mr-1.5" />
              Edit Trip
            </Button>
          </Link>
        </div>
      </div>

      <div className="max-w-5xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        {/* Hero */}
        <div className="relative rounded-2xl overflow-hidden shadow-sm animate-fade-in-up">
          {trip.imageUrl ? (
            <>
              <div className="relative h-56 md:h-80 w-full">
                <Image
                  src={trip.imageUrl}
                  alt={trip.title}
                  fill
                  priority
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-linear-to-t from-black/65 via-black/20 to-transparent" />
              </div>
              <div className="absolute bottom-0 left-0 right-0 p-6">
                <h1 className="text-2xl md:text-4xl font-bold text-white mb-2 leading-tight">
                  {trip.title}
                </h1>
                <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                  <span className="flex items-center gap-1.5">
                    <Calendar className="h-4 w-4" />
                    {trip.startDate.toLocaleDateString()} – {trip.endDate.toLocaleDateString()}
                  </span>
                  <span className="flex items-center gap-1.5">
                    <Clock className="h-4 w-4" />
                    {tripDuration} {tripDuration === 1 ? "day" : "days"}
                  </span>
                </div>
              </div>
            </>
          ) : (
            <div className="bg-linear-to-br from-blue-600 to-indigo-700 p-8 md:p-12">
              <h1 className="text-2xl md:text-4xl font-bold text-white mb-3 leading-tight">
                {trip.title}
              </h1>
              <div className="flex flex-wrap items-center gap-4 text-sm text-white/80">
                <span className="flex items-center gap-1.5">
                  <Calendar className="h-4 w-4" />
                  {trip.startDate.toLocaleDateString()} – {trip.endDate.toLocaleDateString()}
                </span>
                <span className="flex items-center gap-1.5">
                  <Clock className="h-4 w-4" />
                  {tripDuration} {tripDuration === 1 ? "day" : "days"}
                </span>
              </div>
            </div>
          )}

          {statusLabel && (
            <div className="absolute top-4 right-4">
              <span
                className={`text-xs font-medium px-2.5 py-1 rounded-full border backdrop-blur-sm bg-white/80 ${statusLabel.classes}`}
              >
                {statusLabel.text}
              </span>
            </div>
          )}
        </div>

        {/* Stats row */}
        <div className="grid grid-cols-4 gap-3 animate-fade-in-up animation-delay-75">
          {[
            { icon: MapPin, value: trip.locations.length, label: trip.locations.length === 1 ? "Location" : "Locations", color: "text-blue-600", bg: "bg-blue-50" },
            { icon: Clock, value: tripDuration, label: tripDuration === 1 ? "Day" : "Days", color: "text-emerald-600", bg: "bg-emerald-50" },
            { icon: Globe, value: uniqueCountries.size, label: uniqueCountries.size === 1 ? "Country" : "Countries", color: "text-purple-600", bg: "bg-purple-50" },
          ].map(({ icon: Icon, value, label, color, bg }) => (
            <div key={label} className="bg-white rounded-xl border border-slate-200 p-4 text-center shadow-sm">
              <div className={`inline-flex items-center justify-center w-8 h-8 ${bg} rounded-lg mb-2`}>
                <Icon className={`h-4 w-4 ${color}`} />
              </div>
              <div className="text-2xl font-bold text-slate-900">{value}</div>
              <div className="text-xs text-slate-500">{label}</div>
            </div>
          ))}

          <div className="bg-white rounded-xl border border-slate-200 p-4 flex items-center justify-center shadow-sm">
            <Link href={`/trips/${trip.id}/itinerary/new`} className="w-full">
              <Button className="w-full bg-blue-600 hover:bg-blue-700 text-white text-sm shadow-sm hover:shadow-md transition-all duration-200">
                <Plus className="h-4 w-4 mr-1.5" />
                Add Location
              </Button>
            </Link>
          </div>
        </div>

        {/* Tabs */}
        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm animate-fade-in-up animation-delay-100">
          <Tabs value={activeTab} onValueChange={setActiveTab}>
            <div className="px-6 pt-5">
              <TabsList className="bg-slate-100 p-1 rounded-lg">
                <TabsTrigger
                  value="overview"
                  className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-500 transition-all duration-150"
                >
                  Overview
                </TabsTrigger>
                <TabsTrigger
                  value="itinerary"
                  className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-500 transition-all duration-150"
                >
                  Itinerary
                </TabsTrigger>
                <TabsTrigger
                  value="map"
                  className="rounded-md text-sm font-medium data-[state=active]:bg-white data-[state=active]:text-slate-900 data-[state=active]:shadow-sm text-slate-500 transition-all duration-150"
                >
                  Map View
                </TabsTrigger>
              </TabsList>
            </div>

            {/* Overview */}
            <TabsContent value="overview" className="p-6 space-y-6">
              <div className="grid md:grid-cols-2 gap-6">
                {/* Details card */}
                <div className="space-y-4">
                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-5 space-y-4">
                    <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <Calendar className="h-4 w-4 text-slate-400" />
                      Trip Details
                    </h3>
                    <div className="space-y-3 text-sm">
                      <div className="flex justify-between">
                        <span className="text-slate-500">Duration</span>
                        <span className="font-medium text-slate-900">
                          {tripDuration} {tripDuration === 1 ? "day" : "days"}
                        </span>
                      </div>
                      <div className="h-px bg-slate-200" />
                      <div className="flex justify-between">
                        <span className="text-slate-500">Start</span>
                        <span className="font-medium text-slate-900">
                          {trip.startDate.toLocaleDateString(undefined, { dateStyle: "medium" })}
                        </span>
                      </div>
                      <div className="h-px bg-slate-200" />
                      <div className="flex justify-between">
                        <span className="text-slate-500">End</span>
                        <span className="font-medium text-slate-900">
                          {trip.endDate.toLocaleDateString(undefined, { dateStyle: "medium" })}
                        </span>
                      </div>
                      <div className="h-px bg-slate-200" />
                      <div className="flex justify-between">
                        <span className="text-slate-500">Locations</span>
                        <span className="font-medium text-slate-900">
                          {trip.locations.length} planned
                        </span>
                      </div>
                    </div>
                  </div>

                  <div className="bg-slate-50 rounded-xl border border-slate-200 p-5">
                    <h3 className="text-sm font-semibold text-slate-700 mb-3">Description</h3>
                    <p className="text-sm text-slate-600 leading-relaxed">
                      {trip.description || "No description provided for this trip."}
                    </p>
                  </div>
                </div>

                {/* Map preview */}
                <div className="bg-slate-50 rounded-xl border border-slate-200 overflow-hidden">
                  <div className="px-5 py-4 border-b border-slate-200">
                    <h3 className="text-sm font-semibold text-slate-700 flex items-center gap-2">
                      <MapPin className="h-4 w-4 text-slate-400" />
                      Map Preview
                    </h3>
                  </div>
                  {trip.locations.length > 0 ? (
                    <div className="h-72">
                      <Map itineraries={trip.locations} />
                    </div>
                  ) : (
                    <div className="h-72 flex flex-col items-center justify-center text-center p-6">
                      <MapPin className="h-10 w-10 text-slate-300 mb-3" />
                      <p className="text-sm text-slate-500 mb-4">No locations added yet</p>
                      <Link href={`/trips/${trip.id}/itinerary/new`}>
                        <Button variant="outline" size="sm">
                          <Plus className="mr-1.5 h-3.5 w-3.5" />
                          Add First Location
                        </Button>
                      </Link>
                    </div>
                  )}
                </div>
              </div>
            </TabsContent>

            {/* Itinerary */}
            <TabsContent value="itinerary" className="p-6 space-y-5">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-semibold text-slate-900">Your Itinerary</h2>
                <Link href={`/trips/${trip.id}/itinerary/new`}>
                  <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white shadow-sm">
                    <Plus className="mr-1.5 h-3.5 w-3.5" />
                    Add Location
                  </Button>
                </Link>
              </div>

              {trip.locations.length === 0 ? (
                <div className="bg-slate-50 rounded-xl border border-slate-200 py-16 text-center">
                  <Calendar className="h-10 w-10 text-slate-300 mx-auto mb-3" />
                  <h3 className="text-sm font-semibold text-slate-900 mb-1">Itinerary is empty</h3>
                  <p className="text-sm text-slate-500 mb-5 max-w-xs mx-auto">
                    Start building your trip by adding destinations.
                  </p>
                  <Link href={`/trips/${trip.id}/itinerary/new`}>
                    <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                      <Plus className="mr-1.5 h-3.5 w-3.5" />
                      Add First Location
                    </Button>
                  </Link>
                </div>
              ) : (
                <SortableItinerary locations={trip.locations} tripId={trip.id} />
              )}
            </TabsContent>

            {/* Map */}
            <TabsContent value="map" className="p-6 space-y-5">
              <div className="flex justify-between items-center">
                <h2 className="text-base font-semibold text-slate-900">Interactive Map</h2>
                <span className="text-xs text-slate-500">
                  {trip.locations.length} {trip.locations.length === 1 ? "location" : "locations"} plotted
                </span>
              </div>

              <div className="rounded-xl border border-slate-200 overflow-hidden">
                {trip.locations.length > 0 ? (
                  <div className="h-120">
                    <Map itineraries={trip.locations} />
                  </div>
                ) : (
                  <div className="h-120 bg-slate-50 flex flex-col items-center justify-center text-center p-8">
                    <Globe className="h-12 w-12 text-slate-300 mb-4" />
                    <h3 className="text-sm font-semibold text-slate-900 mb-1">No locations to display</h3>
                    <p className="text-sm text-slate-500 mb-5 max-w-sm">
                      Add locations to your trip to see them on the map.
                    </p>
                    <Link href={`/trips/${trip.id}/itinerary/new`}>
                      <Button size="sm" className="bg-blue-600 hover:bg-blue-700 text-white">
                        <Plus className="mr-1.5 h-3.5 w-3.5" />
                        Add Locations
                      </Button>
                    </Link>
                  </div>
                )}
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
}
