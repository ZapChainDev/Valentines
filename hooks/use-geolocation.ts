"use client";

import { useState, useEffect } from "react";

interface GeolocationState {
  latitude: number | null;
  longitude: number | null;
  error: string | null;
  loading: boolean;
}

export function useGeolocation() {
  const [state, setState] = useState<GeolocationState>(() => {
    // Try to restore previous location from localStorage
    if (typeof window !== "undefined") {
      const saved = localStorage.getItem("userLocation");
      if (saved) {
        try {
          const { latitude, longitude } = JSON.parse(saved);
          return {
            latitude,
            longitude,
            error: null,
            loading: true, // Still loading to get fresh location
          };
        } catch (e) {
          // Invalid saved data, ignore
        }
      }
    }
    return {
      latitude: null,
      longitude: null,
      error: null,
      loading: true,
    };
  });

  useEffect(() => {
    if (!navigator.geolocation) {
      setState((prev) => ({
        ...prev,
        error: "Geolocation is not supported by your browser",
        loading: false,
      }));
      return;
    }

    const successHandler = (position: GeolocationPosition) => {
      const newState = {
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
        error: null,
        loading: false,
      };
      setState(newState);

      // Save location to localStorage
      if (typeof window !== "undefined") {
        localStorage.setItem(
          "userLocation",
          JSON.stringify({
            latitude: newState.latitude,
            longitude: newState.longitude,
          }),
        );
      }
    };

    const errorHandler = (error: GeolocationPositionError) => {
      let errorMessage = "Unknown error occurred";
      switch (error.code) {
        case error.PERMISSION_DENIED:
          errorMessage = "Location permission denied. Using default location.";
          break;
        case error.POSITION_UNAVAILABLE:
          errorMessage = "Location information unavailable.";
          break;
        case error.TIMEOUT:
          errorMessage = "Location request timed out.";
          break;
      }
      setState((prev) => ({
        ...prev,
        error: errorMessage,
        loading: false,
        // Default to a central location if geolocation fails
        latitude: 40.7128,
        longitude: -74.006,
      }));
    };

    navigator.geolocation.getCurrentPosition(successHandler, errorHandler, {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 300000, // 5 minutes
    });
  }, []);

  return state;
}
