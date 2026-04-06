"use client";

import { useTransition } from "react";
import { Button } from "./ui/button";
import { addLocation } from "@/lib/actions/add-location";
import { MapPin, Loader2 } from "lucide-react";

export default function NewLocationClient({ tripId }: { tripId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-linear-to-br from-blue-50 via-indigo-50 to-purple-50 relative overflow-hidden">
      {/* Background decoration */}
      <div className="absolute inset-0 bg-linear-to-br from-blue-400/10 via-purple-400/10 to-pink-400/10" />
      <div className="absolute top-0 left-0 w-72 h-72 bg-blue-400/20 rounded-full blur-3xl -translate-x-1/2 -translate-y-1/2" />
      <div className="absolute bottom-0 right-0 w-72 h-72 bg-purple-400/20 rounded-full blur-3xl translate-x-1/2 translate-y-1/2" />

      <div className="relative z-10 flex items-center justify-center min-h-[calc(100vh-8rem)] p-6">
        <div className="w-full max-w-md mx-auto">
          <div className="bg-white/80 backdrop-blur-xl p-8 rounded-2xl border border-white/20 shadow-xl">
            <div className="text-center mb-8">
              <div className="inline-flex items-center justify-center w-16 h-16 bg-linear-to-br from-blue-500 to-purple-600 rounded-full mb-4">
                <MapPin className="w-8 h-8 text-white" />
              </div>
              <h1 className="text-3xl font-bold bg-linear-to-r from-gray-900 via-blue-800 to-purple-800 bg-clip-text text-transparent mb-2">
                Add New Location
              </h1>
              <p className="text-gray-600">
                Discover and add exciting destinations to your itinerary
              </p>
            </div>

            <form
              className="space-y-6"
              action={(formData: FormData) => {
                startTransition(() => {
                  addLocation(formData, tripId);
                });
              }}
            >
              <div className="space-y-2">
                <label className="flex items-center gap-2 text-sm font-medium text-gray-700">
                  <MapPin className="w-4 h-4 text-blue-500" />
                  Destination Address
                </label>
                <input
                  name="address"
                  type="text"
                  required
                  placeholder="Enter location address..."
                  className="w-full border-2 border-gray-200 px-4 py-3 rounded-xl focus:outline-none focus:border-blue-500 focus:ring-4 focus:ring-blue-500/20 transition-all duration-200 bg-white/70 backdrop-blur-sm"
                />
                <p className="text-xs text-gray-500 mt-1">
                  Be specific for better results (e.g., &ldquo;Eiffel Tower,
                  Paris&rdquo;)
                </p>
              </div>

              <Button
                type="submit"
                disabled={isPending}
                className="w-full bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white py-3 rounded-xl font-medium transition-all duration-200 transform hover:scale-[1.02] disabled:opacity-70 disabled:cursor-not-allowed disabled:transform-none"
              >
                {isPending ? (
                  <div className="flex items-center justify-center gap-2">
                    <Loader2 className="w-4 h-4 animate-spin" />
                    Adding Location...
                  </div>
                ) : (
                  <div className="flex items-center justify-center gap-2">
                    <MapPin className="w-4 h-4" />
                    Add to Itinerary
                  </div>
                )}
              </Button>
            </form>

            <div className="mt-6 pt-6 border-t border-gray-200">
              <div className="text-center text-sm text-gray-600">
                <p className="mb-1">
                  💡 <strong>Pro tip:</strong>
                </p>
                <p>
                  Include landmarks or specific addresses for accurate mapping
                </p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
