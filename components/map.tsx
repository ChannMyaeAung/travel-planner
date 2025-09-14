"use client";
import { Location } from "@/app/generated/prisma";
import { GoogleMap, Marker, useLoadScript } from "@react-google-maps/api";
import { MapPin, Loader2, AlertCircle } from "lucide-react";

interface MapProps {
  itineraries: Location[];
}

export default function Map({ itineraries }: MapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  if (loadError) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-red-50 to-orange-50 rounded-xl border-2 border-red-200 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-red-100 rounded-full mb-4">
            <AlertCircle className="w-6 h-6 text-red-600" />
          </div>
          <h3 className="text-lg font-semibold text-red-800 mb-2">
            Map Loading Error
          </h3>
          <p className="text-red-600 text-sm">
            Unable to load Google Maps. Please check your API key.
          </p>
        </div>
      </div>
    );
  }

  if (!isLoaded) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-blue-100 rounded-full mb-4">
            <Loader2 className="w-6 h-6 text-blue-600 animate-spin" />
          </div>
          <h3 className="text-lg font-semibold text-blue-800 mb-2">
            Loading Map
          </h3>
          <p className="text-blue-600 text-sm">
            Preparing your travel visualization...
          </p>
        </div>
      </div>
    );
  }

  if (itineraries.length === 0) {
    return (
      <div className="w-full h-full bg-gradient-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-gray-200 flex items-center justify-center">
        <div className="text-center p-6">
          <div className="inline-flex items-center justify-center w-12 h-12 bg-gray-100 rounded-full mb-4">
            <MapPin className="w-6 h-6 text-gray-600" />
          </div>
          <h3 className="text-lg font-semibold text-gray-800 mb-2">
            No Locations Yet
          </h3>
          <p className="text-gray-600 text-sm">
            Add destinations to see them plotted on the map
          </p>
        </div>
      </div>
    );
  }

  const center =
    itineraries.length > 0
      ? { lat: itineraries[0].lat, lng: itineraries[0].lng }
      : { lat: 0, lng: 0 };

  return (
    <div className="w-full h-full rounded-xl overflow-hidden border-2 border-gray-200 shadow-xl">
      <GoogleMap
        mapContainerStyle={{ width: "100%", height: "100%" }}
        zoom={8}
        center={center}
        options={{
          disableDefaultUI: false,
          zoomControl: true,
          mapTypeControl: true,
          scaleControl: true,
          streetViewControl: true,
          rotateControl: true,
          fullscreenControl: true,
        }}
      >
        {itineraries.map((location) => (
          <Marker
            key={location.id}
            position={{ lat: location.lat, lng: location.lng }}
            title={`${location.locationTitle} (Day ${location.order + 1})`}
          />
        ))}
      </GoogleMap>
    </div>
  );
}
