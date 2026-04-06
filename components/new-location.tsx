"use client";

import { useTransition } from "react";
import { Button } from "./ui/button";
import { addLocation } from "@/lib/actions/add-location";
import { MapPin, Loader2 } from "lucide-react";
import { cn } from "@/lib/utils";

export default function NewLocationClient({ tripId }: { tripId: string }) {
  const [isPending, startTransition] = useTransition();

  return (
    <div className="min-h-[calc(100vh-8rem)] bg-slate-50 flex items-center justify-center p-6">
      <div className="w-full max-w-md animate-fade-in-up">
        {/* Icon + heading */}
        <div className="text-center mb-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-50 rounded-xl mb-4">
            <MapPin className="w-6 h-6 text-blue-600" />
          </div>
          <h1 className="text-xl font-bold text-slate-900 mb-1">Add New Location</h1>
          <p className="text-sm text-slate-500">
            Search for a place and add it to your itinerary
          </p>
        </div>

        <div className="bg-white rounded-2xl border border-slate-200 shadow-sm p-6 space-y-5">
          <form
            className="space-y-4"
            action={(formData: FormData) => {
              startTransition(() => {
                addLocation(formData, tripId);
              });
            }}
          >
            <div className="space-y-2">
              <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
                <MapPin className="w-4 h-4 text-slate-400" />
                Destination Address
              </label>
              <input
                name="address"
                type="text"
                required
                placeholder='e.g. "Eiffel Tower, Paris"'
                className={cn(
                  "w-full border border-slate-200 px-4 py-2.5 rounded-lg text-slate-900",
                  "placeholder:text-slate-400 text-sm",
                  "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                  "transition-all duration-150"
                )}
              />
              <p className="text-xs text-slate-400">
                Be specific for better geocoding results.
              </p>
            </div>

            <Button
              type="submit"
              disabled={isPending}
              className="w-full bg-blue-600 hover:bg-blue-700 text-white py-2.5 rounded-lg font-medium shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-60"
            >
              {isPending ? (
                <span className="flex items-center justify-center gap-2">
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Adding…
                </span>
              ) : (
                <span className="flex items-center justify-center gap-2">
                  <MapPin className="w-4 h-4" />
                  Add to Itinerary
                </span>
              )}
            </Button>
          </form>
        </div>
      </div>
    </div>
  );
}
