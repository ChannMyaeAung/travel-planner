"use client";
import { useEffect, useRef, useState } from "react";
import dynamic from "next/dynamic";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import {
  MapPin,
  Globe as GlobeIcon,
  TrendingUp,
  Users,
  ArrowLeft,
  RotateCcw,
  Play,
  Pause,
} from "lucide-react";
import Link from "next/link";

// Dynamically import Globe component to avoid SSR issues
const Globe = dynamic(() => import("react-globe.gl"), {
  ssr: false,
  loading: () => (
    <div className="flex flex-col items-center justify-center h-full space-y-4">
      <div className="animate-spin rounded-full h-16 w-16 border-4 border-blue-500 border-t-transparent" />
      <p className="text-gray-600 font-medium">Loading your travel globe...</p>
    </div>
  ),
});

export interface TransformedLocation {
  lat: number;
  lng: number;
  name: string;
  country: string;
}

export default function GlobePage() {
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const globeRef = useRef<any>(null);

  const [visitedCountries, setVisitedCountries] = useState<Set<string>>(
    new Set()
  );
  const [locations, setLocations] = useState<TransformedLocation[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isRotating, setIsRotating] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchLocations = async () => {
      try {
        const response = await fetch("/api/trips");

        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`);
        }

        const contentType = response.headers.get("content-type");
        if (!contentType || !contentType.includes("application/json")) {
          throw new Error("Response is not JSON");
        }

        const data = await response.json();
        setLocations(data);

        const countries = new Set<string>(
          data.map((loc: TransformedLocation) => loc.country)
        );
        setVisitedCountries(countries);
      } catch (err) {
        console.error("Error fetching locations:", err);
        setError("Failed to load travel data");
      } finally {
        setIsLoading(false);
      }
    };

    fetchLocations();
  }, []);

  useEffect(() => {
    if (globeRef.current) {
      globeRef.current.controls().autoRotate = isRotating;
      globeRef.current.controls().autoRotateSpeed = 0.8;
    }
  }, [isRotating]);

  // Enable auto-rotation when globe loads
  useEffect(() => {
    if (globeRef.current && !isLoading) {
      const timer = setTimeout(() => {
        if (globeRef.current) {
          globeRef.current.controls().autoRotate = true;
          globeRef.current.controls().autoRotateSpeed = 0.8;
        }
      }, 1000); // Small delay to ensure globe is fully loaded

      return () => clearTimeout(timer);
    }
  }, [isLoading]);

  const toggleRotation = () => {
    setIsRotating(!isRotating);
  };

  const resetView = () => {
    if (globeRef.current) {
      globeRef.current.pointOfView({ altitude: 2 });
    }
  };

  if (error) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-red-50 to-pink-50 flex items-center justify-center">
        <Card className="w-full max-w-md mx-4">
          <CardContent className="text-center py-8">
            <GlobeIcon className="h-16 w-16 mx-auto mb-4 text-red-500" />
            <h2 className="text-2xl font-bold text-gray-900 mb-2">
              Unable to Load Globe
            </h2>
            <p className="text-gray-600 mb-6">{error}</p>
            <Button onClick={() => window.location.reload()}>Try Again</Button>
          </CardContent>
        </Card>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-blue-900 to-indigo-900">
      {/* Header */}
      <div className="bg-white/10 backdrop-blur-lg border-b border-white/20">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <Link href="/trips">
                <Button
                  variant="ghost"
                  className="flex items-center space-x-2 text-white hover:bg-white/10"
                >
                  <ArrowLeft className="h-4 w-4" />
                  <span>Back to Trips</span>
                </Button>
              </Link>
              <div className="h-6 w-px bg-white/30" />
              <div>
                <h1 className="text-2xl font-bold text-white">
                  Your Travel Globe
                </h1>
                <p className="text-blue-200">
                  Explore your journey around the world
                </p>
              </div>
            </div>

            {/* Globe Controls */}
            {!isLoading && (
              <div className="flex items-center space-x-2">
                <Button
                  variant="outline"
                  size="sm"
                  onClick={toggleRotation}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  {isRotating ? (
                    <Pause className="h-4 w-4" />
                  ) : (
                    <Play className="h-4 w-4" />
                  )}
                  {isRotating ? "Pause" : "Rotate"}
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={resetView}
                  className="bg-white/10 border-white/30 text-white hover:bg-white/20"
                >
                  <RotateCcw className="h-4 w-4" />
                  Reset
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-4 gap-8">
          {/* Stats Overview */}
          <div className="xl:col-span-1 space-y-6">
            <div className="grid grid-cols-1 sm:grid-cols-3 xl:grid-cols-1 gap-4">
              <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <MapPin className="h-8 w-8 mx-auto mb-2 text-red-400" />
                  <div className="text-2xl font-bold">{locations.length}</div>
                  <div className="text-sm text-blue-200">Places Visited</div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <GlobeIcon className="h-8 w-8 mx-auto mb-2 text-green-400" />
                  <div className="text-2xl font-bold">
                    {visitedCountries.size}
                  </div>
                  <div className="text-sm text-blue-200">Countries</div>
                </CardContent>
              </Card>

              <Card className="bg-white/10 backdrop-blur-lg border-white/20 text-white">
                <CardContent className="p-6 text-center">
                  <TrendingUp className="h-8 w-8 mx-auto mb-2 text-purple-400" />
                  <div className="text-2xl font-bold">
                    {((visitedCountries.size / 195) * 100).toFixed(1)}%
                  </div>
                  <div className="text-sm text-blue-200">World Explored</div>
                </CardContent>
              </Card>
            </div>

            {/* Countries List */}
            <Card className="bg-white/10 backdrop-blur-lg border-white/20">
              <CardHeader>
                <CardTitle className="flex items-center space-x-2 text-white">
                  <Users className="h-5 w-5" />
                  <span>Countries Visited</span>
                </CardTitle>
              </CardHeader>
              <CardContent>
                {isLoading ? (
                  <div className="flex items-center justify-center py-8">
                    <div className="animate-spin rounded-full h-8 w-8 border-2 border-white border-t-transparent" />
                  </div>
                ) : locations.length === 0 ? (
                  <div className="text-center py-8">
                    <GlobeIcon className="h-12 w-12 mx-auto mb-4 text-white/50" />
                    <p className="text-white/70 mb-4">
                      No travels recorded yet
                    </p>
                    <Link href="/trips/new">
                      <Button
                        size="sm"
                        className="bg-blue-600 hover:bg-blue-700"
                      >
                        Plan Your First Trip
                      </Button>
                    </Link>
                  </div>
                ) : (
                  <div className="space-y-2 max-h-80 overflow-y-auto pr-2">
                    {Array.from(visitedCountries)
                      .sort()
                      .map((country, key) => (
                        <div
                          key={key}
                          className="flex items-center gap-3 p-3 rounded-lg hover:bg-white/10 transition-colors border border-white/10"
                        >
                          <div className="w-2 h-2 bg-red-400 rounded-full animate-pulse" />
                          <span className="font-medium text-white">
                            {country}
                          </span>
                        </div>
                      ))}
                  </div>
                )}
              </CardContent>
            </Card>
          </div>

          {/* Globe Visualization */}
          <div className="xl:col-span-3">
            <Card className="bg-white/5 backdrop-blur-lg border-white/20 overflow-hidden">
              <CardHeader>
                <CardTitle className="text-white text-center text-xl">
                  Interactive Travel Globe
                </CardTitle>
                <p className="text-blue-200 text-center text-sm">
                  {locations.length > 0
                    ? "Click and drag to explore • Scroll to zoom"
                    : "Start planning trips to see your journey visualized"}
                </p>
              </CardHeader>
              <CardContent className="p-0">
                <div className="h-[600px] w-full relative flex items-center justify-center">
                  {isLoading ? (
                    <div className="flex flex-col items-center justify-center h-full space-y-6">
                      <div className="relative">
                        <div className="animate-spin rounded-full h-20 w-20 border-4 border-blue-400 border-t-transparent" />
                        <GlobeIcon className="h-8 w-8 absolute top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 text-blue-400" />
                      </div>
                      <div className="text-center">
                        <p className="text-white font-medium mb-2">
                          Preparing your travel globe...
                        </p>
                        <p className="text-blue-200 text-sm">
                          This may take a moment
                        </p>
                      </div>
                    </div>
                  ) : (
                    <div className="w-full h-full flex items-center justify-center">
                      <Globe
                        ref={globeRef}
                        globeImageUrl="//unpkg.com/three-globe/example/img/earth-blue-marble.jpg"
                        bumpImageUrl="//unpkg.com/three-globe/example/img/earth-topology.png"
                        backgroundColor="rgba(0,0,0,0)"
                        pointColor={() => "#EF4444"}
                        // eslint-disable-next-line @typescript-eslint/no-explicit-any
                        pointLabel={(d: any) => `
                          <div style="
                            background: rgba(0,0,0,0.8); 
                            color: white; 
                            padding: 8px 12px; 
                            border-radius: 6px; 
                            font-size: 12px;
                            max-width: 200px;
                          ">
                            <strong>${d.name}</strong><br/>
                            📍 ${d.country}
                          </div>
                        `}
                        pointsData={locations}
                        pointRadius={0.8}
                        pointAltitude={0.15}
                        pointsMerge={true}
                        width={undefined}
                        height={600}
                        atmosphereColor="#3B82F6"
                        atmosphereAltitude={0.25}
                      />
                    </div>
                  )}
                </div>
              </CardContent>
            </Card>

            {/* Additional Info */}
            {!isLoading && locations.length > 0 && (
              <div className="mt-6 grid grid-cols-1 md:grid-cols-2 gap-4">
                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-white mb-2">
                      🌟 Travel Achievements
                    </h3>
                    <ul className="space-y-1 text-sm text-blue-200">
                      <li>
                        • Explored {visitedCountries.size} different countries
                      </li>
                      <li>• Visited {locations.length} unique locations</li>
                      <li>
                        • {((visitedCountries.size / 195) * 100).toFixed(1)}% of
                        the world discovered
                      </li>
                    </ul>
                  </CardContent>
                </Card>

                <Card className="bg-white/10 backdrop-blur-lg border-white/20">
                  <CardContent className="p-4">
                    <h3 className="font-semibold text-white mb-2">
                      🎯 Keep Exploring
                    </h3>
                    <p className="text-sm text-blue-200 mb-3">
                      There&apos;s still so much to discover! Plan your next
                      adventure.
                    </p>
                    <Link href="/trips/new">
                      <Button
                        size="sm"
                        className="bg-gradient-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700"
                      >
                        Plan Next Trip
                      </Button>
                    </Link>
                  </CardContent>
                </Card>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
