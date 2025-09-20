// lib/useGeolocation.ts
"use client";

import { useState, useEffect } from "react";

interface LocationData {
  city?: string;
  state?: string;
  country?: string;
  latitude?: number;
  longitude?: number;
  error?: string;
}

export function useGeolocation() {
  const [location, setLocation] = useState<LocationData | null>(null);

  useEffect(() => {
    const fetchLocation = async (lat: number, lng: number) => {
      try {
        const response = await fetch(
          `https://api.opencagedata.com/geocode/v1/json?q=${lat}+${lng}&key=4e58fbdd9728474ebf4ef6210306986e`
        );
        const data = await response.json();

        if (data?.results?.length > 0) {
          const components = data.results[0].components;
          setLocation({
            city: components.city || components.town || components.village,
            state: components.state,
            country: components.country,
            latitude: lat,
            longitude: lng,
          });
        } else {
          setLocation({ error: "No location found" });
        }
      } catch (error) {
        console.error("Error fetching OpenCage data:", error);
        setLocation({ error: "Failed to fetch location data" });
      }
    };

    if (!navigator.geolocation) {
      setLocation({ error: "Geolocation not supported" });
      return;
    }

    navigator.geolocation.getCurrentPosition(
      (position) => {
        const { latitude, longitude } = position.coords;
        fetchLocation(latitude, longitude);
      },
      (error) => {
        setLocation({ error: error.message });
      }
    );
  }, []);

  return location;
}
