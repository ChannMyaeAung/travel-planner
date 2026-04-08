"use client";

import { updateTrip } from "@/lib/actions/update-trip";
import { deleteTrip } from "@/lib/actions/delete-trip";
import { UploadButton } from "@/lib/upload-thing";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { ArrowLeft, Calendar, FileText, Camera, Save, Trash2, X, AlertTriangle } from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import { useState, useTransition } from "react";

interface Trip {
  id: string;
  title: string;
  description: string | null;
  startDate: Date;
  endDate: Date;
  imageUrl: string | null;
}

export default function EditTripForm({ trip }: { trip: Trip }) {
  const [isPending, startTransition] = useTransition();
  const [isDeleting, startDeleteTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState<string | null>(trip.imageUrl);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  const toDateInput = (d: Date) => new Date(d).toISOString().split("T")[0];

  return (
    <div className="min-h-screen bg-slate-50">
      {/* Top bar */}
      <div className="bg-white border-b border-slate-200">
        <div className="max-w-2xl mx-auto px-4 sm:px-6 py-4 flex items-center gap-4">
          <Link href={`/trips/${trip.id}`}>
            <Button variant="ghost" size="sm" className="text-slate-500 hover:text-slate-900 -ml-2">
              <ArrowLeft className="h-4 w-4 mr-1.5" />
              Back
            </Button>
          </Link>
          <div className="h-4 w-px bg-slate-200" />
          <div>
            <h1 className="text-base font-semibold text-slate-900">Edit Trip</h1>
            <p className="text-xs text-slate-500 truncate max-w-xs">{trip.title}</p>
          </div>
        </div>
      </div>

      <div className="max-w-2xl mx-auto px-4 sm:px-6 py-8 space-y-6">
        <form
          className="space-y-6 animate-fade-in-up"
          action={(formData: FormData) => {
            if (imageUrl) formData.set("imageUrl", imageUrl);
            startTransition(() => updateTrip(trip.id, formData));
          }}
        >
          {/* Title */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-sm">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <FileText className="h-4 w-4 text-slate-400" />
              Trip Title <span className="text-red-400">*</span>
            </label>
            <input
              type="text"
              name="title"
              defaultValue={trip.title}
              required
              className={cn(
                "w-full border border-slate-200 px-4 py-2.5 rounded-lg text-slate-900",
                "placeholder:text-slate-400 text-sm",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                "transition-all duration-150"
              )}
            />
          </div>

          {/* Description */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-sm">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <FileText className="h-4 w-4 text-slate-400" />
              Description <span className="text-red-400">*</span>
            </label>
            <textarea
              name="description"
              rows={4}
              defaultValue={trip.description ?? ""}
              required
              className={cn(
                "w-full border border-slate-200 px-4 py-2.5 rounded-lg text-slate-900",
                "placeholder:text-slate-400 text-sm resize-none",
                "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                "transition-all duration-150"
              )}
            />
          </div>

          {/* Dates */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-sm">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Calendar className="h-4 w-4 text-slate-400" />
              Travel Dates <span className="text-red-400">*</span>
            </label>
            <div className="grid grid-cols-2 gap-3">
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">Start</p>
                <input
                  type="date"
                  name="startDate"
                  defaultValue={toDateInput(trip.startDate)}
                  required
                  className={cn(
                    "w-full border border-slate-200 px-3 py-2.5 rounded-lg text-slate-900 text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                    "transition-all duration-150"
                  )}
                />
              </div>
              <div className="space-y-1.5">
                <p className="text-xs text-slate-500 font-medium uppercase tracking-wide">End</p>
                <input
                  type="date"
                  name="endDate"
                  defaultValue={toDateInput(trip.endDate)}
                  required
                  className={cn(
                    "w-full border border-slate-200 px-3 py-2.5 rounded-lg text-slate-900 text-sm",
                    "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                    "transition-all duration-150"
                  )}
                />
              </div>
            </div>
          </div>

          {/* Cover image */}
          <div className="bg-white rounded-xl border border-slate-200 p-5 space-y-3 shadow-sm">
            <label className="flex items-center gap-2 text-sm font-medium text-slate-700">
              <Camera className="h-4 w-4 text-slate-400" />
              Cover Image
              <span className="text-xs font-normal text-slate-400">(optional)</span>
            </label>

            {imageUrl ? (
              <div className="relative rounded-lg overflow-hidden">
                <Image
                  src={imageUrl}
                  alt="Cover preview"
                  width={600}
                  height={200}
                  className="w-full h-44 object-cover"
                />
                <button
                  type="button"
                  onClick={() => setImageUrl(null)}
                  className="absolute top-2 right-2 p-1.5 bg-black/50 hover:bg-black/70 rounded-lg text-white transition-colors duration-150"
                >
                  <X className="h-3.5 w-3.5" />
                </button>
              </div>
            ) : (
              <div className="border-2 border-dashed border-slate-200 rounded-lg p-6 text-center hover:border-blue-300 transition-colors duration-200">
                <Camera className="h-8 w-8 text-slate-300 mx-auto mb-3" />
                <UploadButton
                  endpoint="imageUploader"
                  onClientUploadComplete={(res) => {
                    if (res?.[0]?.ufsUrl) setImageUrl(res[0].ufsUrl);
                  }}
                  onUploadError={(error: Error) => console.error("Upload error:", error)}
                  appearance={{
                    button: "bg-blue-600 hover:bg-blue-700 text-white text-sm px-4 py-2 rounded-lg font-medium transition-colors duration-150",
                    allowedContent: "text-xs text-slate-400 mt-1",
                  }}
                />
              </div>
            )}
          </div>

          {/* Save */}
          <Button
            type="submit"
            disabled={isPending}
            className="w-full bg-blue-600 hover:bg-blue-700 text-white py-3 rounded-xl font-medium shadow-sm hover:shadow-md transition-all duration-200 disabled:opacity-60"
            size="lg"
          >
            {isPending ? (
              <span className="flex items-center justify-center gap-2">
                <span className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                Saving…
              </span>
            ) : (
              <span className="flex items-center justify-center gap-2">
                <Save className="h-4 w-4" />
                Save Changes
              </span>
            )}
          </Button>
        </form>

        {/* Danger zone */}
        <div className="bg-white rounded-xl border border-red-100 p-5 shadow-sm animate-fade-in-up animation-delay-100">
          <h3 className="text-sm font-semibold text-red-600 flex items-center gap-2 mb-3">
            <AlertTriangle className="h-4 w-4" />
            Danger Zone
          </h3>

          {!showDeleteConfirm ? (
            <div className="flex items-center justify-between">
              <div>
                <p className="text-sm text-slate-700 font-medium">Delete this trip</p>
                <p className="text-xs text-slate-400 mt-0.5">
                  Permanently removes the trip and all its locations.
                </p>
              </div>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={() => setShowDeleteConfirm(true)}
                className="border-red-200 text-red-600 hover:bg-red-50 hover:border-red-300"
              >
                <Trash2 className="h-3.5 w-3.5 mr-1.5" />
                Delete
              </Button>
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-sm text-slate-700">
                Are you sure? This cannot be undone.
              </p>
              <div className="flex gap-2">
                <Button
                  type="button"
                  size="sm"
                  disabled={isDeleting}
                  onClick={() => startDeleteTransition(() => deleteTrip(trip.id))}
                  className="bg-red-600 hover:bg-red-700 text-white disabled:opacity-60"
                >
                  {isDeleting ? (
                    <span className="flex items-center gap-1.5">
                      <span className="w-3.5 h-3.5 border-2 border-white/40 border-t-white rounded-full animate-spin" />
                      Deleting…
                    </span>
                  ) : (
                    "Yes, delete trip"
                  )}
                </Button>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => setShowDeleteConfirm(false)}
                >
                  Cancel
                </Button>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
