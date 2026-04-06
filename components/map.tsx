"use client";
import { Location } from "@/app/generated/prisma";
import {
  GoogleMap,
  useLoadScript,
  OverlayViewF,
  OverlayView,
} from "@react-google-maps/api";
import { MapPin, Loader2, AlertCircle } from "lucide-react";

interface MapProps {
  itineraries: Location[];
}

// Custom pin rendered as a React element via OverlayViewF — avoids the
// deprecated google.maps.Marker without requiring a Google Cloud Map ID.
function CustomPin({ title }: { title: string }) {
  return (
    <div
      title={title}
      style={{ transform: "translate(-50%, -100%)", pointerEvents: "auto" }}
      className="cursor-pointer group"
    >
      <svg
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 24 24"
        width="36"
        height="36"
        className="drop-shadow-md group-hover:scale-110 transition-transform duration-150"
      >
        <path
          d="M12 2C8.13 2 5 5.13 5 9c0 5.25 7 13 7 13s7-7.75 7-13c0-3.87-3.13-7-7-7z"
          fill="#EF4444"
        />
        <circle cx="12" cy="9" r="2.5" fill="white" />
      </svg>
    </div>
  );
}

export default function Map({ itineraries }: MapProps) {
  const { isLoaded, loadError } = useLoadScript({
    googleMapsApiKey: process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY!,
  });

  if (loadError) {
    return (
      <div className="w-full h-full bg-linear-to-br from-red-50 to-orange-50 rounded-xl border-2 border-red-200 flex items-center justify-center">
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
      <div className="w-full h-full bg-linear-to-br from-blue-50 to-purple-50 rounded-xl border-2 border-blue-200 flex items-center justify-center">
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
      <div className="w-full h-full bg-linear-to-br from-gray-50 to-blue-50 rounded-xl border-2 border-gray-200 flex items-center justify-center">
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

  const center = { lat: itineraries[0].lat, lng: itineraries[0].lng };

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
          <OverlayViewF
            key={location.id}
            position={{ lat: location.lat, lng: location.lng }}
            mapPaneName={OverlayView.OVERLAY_MOUSE_TARGET}
          >
            <CustomPin
              title={`${location.locationTitle} (Stop ${location.order + 1})`}
            />
          </OverlayViewF>
        ))}
      </GoogleMap>
    </div>
  );
}
