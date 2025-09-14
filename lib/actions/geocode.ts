/** Response structure for geocoding operations */
interface GeocodeResult {
  country: string;
  formattedAddress: string;
}

/** Google Maps API address component structure */
interface AddressComponent {
  long_name: string;
  short_name: string;
  types: string[];
}

/**
 * Reverse geocodes coordinates to extract country and formatted address
 * @param lat - Latitude coordinate
 * @param lng - Longitude coordinate
 * @returns Promise resolving to country name and formatted address
 * @throws Will throw if API request fails or returns invalid data
 */
export async function getCountryFromCoordinates(
  lat: number,
  lng: number
): Promise<GeocodeResult> {
  const apiKey = process.env.NEXT_PUBLIC_GOOGLE_MAPS_API_KEY;

  // Call Google Maps Geocoding API for reverse geocoding
  const response = await fetch(
    `https://maps.googleapis.com/maps/api/geocode/json?latlng=${lat},${lng}&key=${apiKey}`
  );

  const data = await response.json();

  // Extract first result (most accurate match)
  const result = data.results[0];

  // Find country component from address components array
  const countryComponent = result.address_components.find(
    (component: AddressComponent) => component.types.includes("country")
  );

  return {
    country: countryComponent ? countryComponent.long_name : "Unknown",
    formattedAddress: result.formatted_address,
  };
}
