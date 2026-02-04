"use client";

import { useEffect, useState } from "react";
import {
  MapContainer as LeafletMapContainer,
  TileLayer,
  useMap,
} from "react-leaflet";
import L from "leaflet";
import { useGeolocation } from "@/hooks/use-geolocation";
import { usePins } from "@/hooks/use-pins";
import { PinMarker } from "./PinMarker";
import { PinDetailCard } from "./PinDetailCard";
import { AddPinButton } from "./AddPinButton";
import { AddPinDialog } from "./AddPinDialog";
import { useAuth } from "@/components/auth/AuthProvider";
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
      map.setView(center, 13);
    }
  }, [center, map]);

  return null;
}

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
  const [mapCenter, setMapCenter] = useState<[number, number]>([
    40.7128, -74.006,
  ]);

  // Check if user already has a pin
  const userHasPin = pins.some((pin) => pin.userId === user?.userId);

  useEffect(() => {
    if (latitude && longitude) {
      setMapCenter([latitude, longitude]);
    }
  }, [latitude, longitude]);

  const handlePinClick = (pin: Pin) => {
    setSelectedPin(pin);
  };

  const handleCloseDetail = () => {
    setSelectedPin(null);
  };

  return (
    <div className="relative h-full w-full">
      <LeafletMapContainer
        center={mapCenter}
        zoom={3}
        className="h-full w-full z-0"
        scrollWheelZoom={true}
      >
        <TileLayer
          attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
          url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
        />
        <MapController center={mapCenter} />

        {pins.map((pin) => (
          <PinMarker
            key={pin.id}
            pin={pin}
            isOwn={pin.userId === user?.userId}
            onClick={() => handlePinClick(pin)}
          />
        ))}
      </LeafletMapContainer>

      {/* Location error notification */}
      {locationError && (
        <div className="absolute top-4 left-1/2 -translate-x-1/2 z-10 bg-yellow-50 border border-yellow-200 text-yellow-800 px-4 py-2 rounded-lg text-sm shadow-lg">
          {locationError}
        </div>
      )}

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
