"use client";

import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { createTrip } from "@/lib/actions/create-trip";
import { UploadButton } from "@/lib/upload-thing";
import { cn } from "@/lib/utils";
import {
  ArrowLeft,
  Calendar,
  FileText,
  Camera,
  Plane,
  Upload,
} from "lucide-react";
import Image from "next/image";
import Link from "next/link";
import React, { useState, useTransition } from "react";

export default function NewTrip() {
  const [isPending, startTransition] = useTransition();
  const [imageUrl, setImageUrl] = useState<string | null>(null);

  return (
    <div className="min-h-screen bg-linear-to-br from-blue-50 via-white to-purple-50">
      {/* Header */}
      <div className="bg-white border-b border-gray-200">
        <div className="container mx-auto px-4 py-6">
          <div className="flex items-center space-x-4">
            <Link href="/trips">
              <Button
                variant="ghost"
                className="flex items-center space-x-2 text-gray-600 hover:text-gray-900"
              >
                <ArrowLeft className="h-4 w-4" />
                <span>Back to Trips</span>
              </Button>
            </Link>
            <div className="h-6 w-px bg-gray-300" />
            <div>
              <h1 className="text-2xl font-bold text-gray-900">
                Create New Trip
              </h1>
              <p className="text-gray-600">Plan your next adventure</p>
            </div>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 py-8">
        <div className="max-w-2xl mx-auto">
          <Card className="bg-white border-0 shadow-xl">
            <CardHeader className="pb-6">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 bg-linear-to-br from-blue-500 to-purple-600 rounded-lg flex items-center justify-center">
                  <Plane className="h-5 w-5 text-white" />
                </div>
                <div>
                  <CardTitle className="text-xl">Trip Details</CardTitle>
                  <p className="text-sm text-gray-600">
                    Fill in the details for your upcoming journey
                  </p>
                </div>
              </div>
            </CardHeader>

            <CardContent>
              <form
                className="space-y-8"
                action={(formData: FormData) => {
                  if (imageUrl) {
                    formData.append("imageUrl", imageUrl);
                  }
                  startTransition(() => {
                    createTrip(formData);
                  });
                }}
              >
                {/* Trip Title */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                    <FileText className="h-4 w-4" />
                    <span>Trip Title</span>
                  </label>
                  <input
                    type="text"
                    name="title"
                    placeholder="e.g., Cherry Blossom Season in Japan"
                    className={cn(
                      "w-full border border-gray-300 px-4 py-3 rounded-lg",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                      "transition-colors duration-200 placeholder-gray-400"
                    )}
                    required
                  />
                </div>

                {/* Trip Description */}
                <div className="space-y-2">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                    <FileText className="h-4 w-4" />
                    <span>Description</span>
                  </label>
                  <textarea
                    name="description"
                    rows={4}
                    placeholder="Describe your trip plans, goals, or what you're excited about..."
                    className={cn(
                      "w-full border border-gray-300 px-4 py-3 rounded-lg",
                      "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                      "transition-colors duration-200 placeholder-gray-400 resize-none"
                    )}
                    required
                  />
                </div>

                {/* Date Range */}
                <div className="space-y-4">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                    <Calendar className="h-4 w-4" />
                    <span>Travel Dates</span>
                  </label>

                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                        Start Date
                      </label>
                      <input
                        type="date"
                        name="startDate"
                        className={cn(
                          "w-full border border-gray-300 px-4 py-3 rounded-lg",
                          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                          "transition-colors duration-200"
                        )}
                        required
                      />
                    </div>

                    <div className="space-y-2">
                      <label className="text-xs font-medium text-gray-600 uppercase tracking-wide">
                        End Date
                      </label>
                      <input
                        type="date"
                        name="endDate"
                        className={cn(
                          "w-full border border-gray-300 px-4 py-3 rounded-lg",
                          "focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-blue-500",
                          "transition-colors duration-200"
                        )}
                        required
                      />
                    </div>
                  </div>
                </div>

                {/* Trip Image */}
                <div className="space-y-4">
                  <label className="flex items-center space-x-2 text-sm font-semibold text-gray-700">
                    <Camera className="h-4 w-4" />
                    <span>Trip Cover Image</span>
                    <span className="text-xs text-gray-500 font-normal">
                      (Optional)
                    </span>
                  </label>

                  {imageUrl ? (
                    <div className="relative">
                      <Image
                        src={imageUrl}
                        alt="Trip Preview"
                        className="w-full h-48 object-cover rounded-lg shadow-md"
                        width={600}
                        height={200}
                      />
                      <Button
                        type="button"
                        variant="secondary"
                        size="sm"
                        className="absolute top-2 right-2 bg-white/90 hover:bg-white"
                        onClick={() => setImageUrl(null)}
                      >
                        Remove
                      </Button>
                    </div>
                  ) : (
                    <div className="border-2 border-dashed border-gray-300 rounded-lg p-8">
                      <div className="text-center">
                        <Upload className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                        <div className="space-y-2">
                          <UploadButton
                            endpoint="imageUploader"
                            onClientUploadComplete={(res) => {
                              if (res && res[0].ufsUrl) {
                                setImageUrl(res[0].ufsUrl);
                              }
                            }}
                            onUploadError={(error: Error) => {
                              console.error("Upload error:", error);
                            }}
                            appearance={{
                              button:
                                "bg-blue-600 hover:bg-blue-700 text-white px-6 py-2 rounded-lg text-sm font-medium",
                              allowedContent: "text-xs text-gray-500 mt-2",
                            }}
                          />
                        </div>
                      </div>
                    </div>
                  )}
                </div>

                {/* Submit Button */}
                <div className="pt-6 border-t border-gray-200">
                  <Button
                    type="submit"
                    disabled={isPending}
                    className="w-full py-3 bg-linear-to-r from-blue-600 to-purple-600 hover:from-blue-700 hover:to-purple-700 text-white font-semibold rounded-lg shadow-lg hover:shadow-xl transition-all duration-200"
                    size="lg"
                  >
                    {isPending ? (
                      <div className="flex items-center space-x-2">
                        <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin" />
                        <span>Creating Your Trip...</span>
                      </div>
                    ) : (
                      <div className="flex items-center space-x-2">
                        <Plane className="h-5 w-5" />
                        <span>Create Trip</span>
                      </div>
                    )}
                  </Button>
                </div>
              </form>
            </CardContent>
          </Card>

          {/* Tips Card */}
          <Card className="mt-8 bg-linear-to-br from-blue-50 to-purple-50 border-0">
            <CardContent className="p-6">
              <h3 className="font-semibold text-gray-900 mb-3">
                💡 Planning Tips
              </h3>
              <ul className="space-y-2 text-sm text-gray-700">
                <li>
                  • Choose a descriptive title that captures the essence of your
                  trip
                </li>
                <li>
                  • Add details about your goals, must-see places, or special
                  occasions
                </li>
                <li>
                  • Upload a cover image to make your trip more visually
                  appealing
                </li>
                <li>• You can always edit these details later</li>
              </ul>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}
