"use client";

import React, { useEffect, useState, useCallback } from "react";
import {
  MapContainer as LeafletMapContainer,
  TileLayer,
  useMap,
  useMapEvents,
  ZoomControl,
  Circle,
} from "react-leaflet";
import L from "leaflet";
import { useGeolocation } from "@/hooks/use-geolocation";
import { usePins } from "@/hooks/use-pins";
import { PinMarker } from "./PinMarker";
import { PinDetailCard } from "./PinDetailCard";
import { AddPinButton } from "./AddPinButton";
import { AddPinDialog } from "./AddPinDialog";
import { EmptyStateHint } from "./EmptyStateHint";
import { useAuth } from "@/components/auth/AuthProvider";
import { MapPin, Navigation, Minus, Plus, Layers, Heart } from "lucide-react";
import type { Pin } from "@/types";

// Fix Leaflet default icon issue
delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl:
    "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

function MapController({ center }: { center: [number, number] }) {
  const map = useMap();

  useEffect(() => {
    if (center[0] !== 0 && center[1] !== 0) {
      map.flyTo(center, 14, { duration: 1.5 });
    }
  }, [center, map]);

  return null;
}

// Interactive map controls component
function MapControls({
  onZoomIn,
  onZoomOut,
  onLocate,
  onToggleStyle,
  currentStyle,
  pinsCount,
  isLocating,
}: {
  onZoomIn: () => void;
  onZoomOut: () => void;
  onLocate: () => void;
  onToggleStyle: () => void;
  currentStyle: string;
  pinsCount: number;
  isLocating: boolean;
}) {
  return (
    <div className="absolute right-2 sm:right-4 top-2 sm:top-4 z-10 flex flex-col gap-1.5 sm:gap-2">
      {/* Pin counter */}
      <div className="bg-white rounded-full px-2 sm:px-3 py-1.5 sm:py-2 shadow-lg border border-rose-100 flex items-center gap-1.5 sm:gap-2">
        <Heart className="h-3 sm:h-4 w-3 sm:w-4 text-rose-500" fill="#f43f5e" />
        <span className="text-xs sm:text-sm font-semibold text-rose-600">
          {pinsCount}
        </span>
      </div>

      {/* Zoom controls */}
      <div className="bg-white rounded-lg sm:rounded-xl shadow-lg border border-rose-100 overflow-hidden">
        <button
          onClick={onZoomIn}
          className="p-2 sm:p-3 hover:bg-rose-50 transition-colors border-b border-rose-100 block w-full"
          title="Zoom in"
        >
          <Plus className="h-4 sm:h-5 w-4 sm:w-5 text-rose-600 mx-auto" />
        </button>
        <button
          onClick={onZoomOut}
          className="p-2 sm:p-3 hover:bg-rose-50 transition-colors block w-full"
          title="Zoom out"
        >
          <Minus className="h-4 sm:h-5 w-4 sm:w-5 text-rose-600 mx-auto" />
        </button>
      </div>

      {/* Location button */}
      <button
        onClick={onLocate}
        className={`p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl shadow-lg border border-rose-100 hover:bg-rose-50 transition-all ${isLocating ? "animate-pulse" : ""}`}
        title="Go to my location"
      >
        <Navigation
          className={`h-4 sm:h-5 w-4 sm:w-5 text-rose-600 ${isLocating ? "animate-spin" : ""}`}
        />
      </button>

      {/* Map style toggle */}
      <button
        onClick={onToggleStyle}
        className="p-2 sm:p-3 bg-white rounded-lg sm:rounded-xl shadow-lg border border-rose-100 hover:bg-rose-50 transition-colors"
        title="Change map style"
      >
        <Layers className="h-4 sm:h-5 w-4 sm:w-5 text-rose-600" />
      </button>
    </div>
  );
}

// Map event handler component
function MapEventHandler({
  onMapClick,
  mapRef,
}: {
  onMapClick: (lat: number, lng: number) => void;
  mapRef: React.MutableRefObject<L.Map | null>;
}) {
  const map = useMapEvents({
    click: (e) => {
      onMapClick(e.latlng.lat, e.latlng.lng);
    },
  });

  useEffect(() => {
    mapRef.current = map;
  }, [map, mapRef]);

  return null;
}

const MAP_STYLES = {
  default: {
    url: "https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png",
    attribution:
      '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
  },
  satellite: {
    url: "https://server.arcgisonline.com/ArcGIS/rest/services/World_Imagery/MapServer/tile/{z}/{y}/{x}",
    attribution: "&copy; Esri",
  },
  topo: {
    url: "https://{s}.tile.opentopomap.org/{z}/{x}/{y}.png",
    attribution: "&copy; OpenTopoMap",
  },
};

export default function MapContainer() {
  const {
    latitude,
    longitude,
    loading: locationLoading,
    error: locationError,
  } = useGeolocation();
  const { pins, loading: pinsLoading } = usePins();
  const { user } = useAuth();
  const [selectedPin, setSelectedPin] = useState<Pin | null>(null);
  const [showAddDialog, setShowAddDialog] = useState(false);
  const [mapStyle, setMapStyle] = useState<keyof typeof MAP_STYLES>("default");
  const [isLocating, setIsLocating] = useState(false);
  const [userLocationVisible, setUserLocationVisible] = useState(false);
  const mapRef = React.useRef<L.Map | null>(null);

  // Default to Catbalogan, Philippines where dummy data is located
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    11.7756, 124.886,
  ]);

  // Check if user already has a pin
  const userHasPin = pins.some((pin) => pin.userId === user?.userId);

  useEffect(() => {
    if (latitude && longitude) {
      setMapCenter([latitude, longitude]);
      setUserLocationVisible(true);
    }
  }, [latitude, longitude]);

  const handlePinClick = (pin: Pin) => {
    setSelectedPin(pin);
    // Fly to the pin location
    if (mapRef.current) {
      mapRef.current.flyTo([pin.lat, pin.lng], 15, { duration: 1 });
    }
  };

  const handleCloseDetail = () => {
    setSelectedPin(null);
  };

  const handleZoomIn = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.zoomIn(1, { animate: true });
    }
  }, []);

  const handleZoomOut = useCallback(() => {
    if (mapRef.current) {
      mapRef.current.zoomOut(1, { animate: true });
    }
  }, []);

  const handleLocate = useCallback(() => {
    if (latitude && longitude && mapRef.current) {
      setIsLocating(true);
      mapRef.current.flyTo([latitude, longitude], 15, { duration: 1.5 });
      setTimeout(() => setIsLocating(false), 1500);
    }
  }, [latitude, longitude]);

  const handleToggleStyle = useCallback(() => {
    const styles = Object.keys(MAP_STYLES) as (keyof typeof MAP_STYLES)[];
    const currentIndex = styles.indexOf(mapStyle);
    const nextIndex = (currentIndex + 1) % styles.length;
    setMapStyle(styles[nextIndex]);
  }, [mapStyle]);

  const handleMapClick = useCallback(
    (lat: number, lng: number) => {
      // Close pin detail if clicking elsewhere on the map
      if (selectedPin) {
        setSelectedPin(null);
      }
    },
    [selectedPin],
  );

  const currentTileStyle = MAP_STYLES[mapStyle];

  return (
    <div className="relative h-full w-full overflow-hidden">
      <LeafletMapContainer
        center={mapCenter}
        zoom={13}
        className="h-full w-full z-0"
        scrollWheelZoom={true}
        zoomControl={false}
        doubleClickZoom={true}
      >
        <TileLayer
          attribution={currentTileStyle.attribution}
          url={currentTileStyle.url}
          key={mapStyle}
        />
        <MapController center={mapCenter} />
        <MapEventHandler onMapClick={handleMapClick} mapRef={mapRef} />

        {/* User location indicator */}
        {userLocationVisible && latitude && longitude && (
          <Circle
            center={[latitude, longitude]}
            radius={50}
            pathOptions={{
              color: "#3b82f6",
              fillColor: "#3b82f6",
              fillOpacity: 0.3,
              weight: 2,
            }}
          />
        )}

        {pins.map((pin, index) => (
          <PinMarker
            key={pin.id}
            pin={pin}
            isOwn={pin.userId === user?.userId}
            onClick={() => handlePinClick(pin)}
          />
        ))}
      </LeafletMapContainer>

      {/* Custom Map Controls */}
      <MapControls
        onZoomIn={handleZoomIn}
        onZoomOut={handleZoomOut}
        onLocate={handleLocate}
        onToggleStyle={handleToggleStyle}
        currentStyle={mapStyle}
        pinsCount={pins.length}
        isLocating={isLocating}
      />

      {/* Location error notification */}
      {locationError && (
        <div className="absolute top-2 sm:top-4 left-2 sm:left-4 z-10 bg-yellow-50 border border-yellow-200 text-yellow-800 px-3 sm:px-4 py-1.5 sm:py-2 rounded-lg text-xs sm:text-sm shadow-lg max-w-[200px] sm:max-w-xs">
          <div className="flex items-center gap-2">
            <MapPin className="h-4 w-4 flex-shrink-0" />
            <span>{locationError}</span>
          </div>
        </div>
      )}

      {/* Loading indicator */}
      {pinsLoading && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-white border border-rose-200 text-rose-600 px-4 py-2 rounded-full text-sm shadow-lg flex items-center gap-2">
          <Heart className="h-4 w-4 animate-pulse" fill="#f43f5e" />
          <span>Loading love pins...</span>
        </div>
      )}

      {/* Empty State Hint */}
      <EmptyStateHint hasUserPin={userHasPin} totalPins={pins.length} />

      {/* Add Pin Button */}
      {!userHasPin && (
        <AddPinButton
          onClick={() => setShowAddDialog(true)}
          disabled={!latitude || !longitude}
        />
      )}

      {/* Pin Detail Card */}
      {selectedPin && (
        <PinDetailCard
          pin={selectedPin}
          onClose={handleCloseDetail}
          isOwn={selectedPin.userId === user?.userId}
        />
      )}

      {/* Add Pin Dialog */}
      <AddPinDialog
        open={showAddDialog}
        onOpenChange={setShowAddDialog}
        latitude={latitude || 0}
        longitude={longitude || 0}
      />
    </div>
  );
}
