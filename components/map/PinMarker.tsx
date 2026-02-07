"use client";

import { Marker, Popup } from "react-leaflet";
import L from "leaflet";
import type { Pin } from "@/types";

interface PinMarkerProps {
  pin: Pin;
  isOwn: boolean;
  onClick: () => void;
}

// Get icon config based on status
const getIconConfig = (status: string, isOwn: boolean) => {
  const baseColor = isOwn ? "#be123c" : "#e11d48";

  const configs: Record<string, { svg: string; color: string }> = {
    "Single and ready to mingle 💫": {
      color: "#8b5cf6",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z"/></svg>`,
    },
    "In a relationship 💕": {
      color: "#ec4899",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
    },
    "Engaged 💍": {
      color: "#f59e0b",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2L9 9 2 12l7 3 3 7 3-7 7-3-7-3z"/></svg>`,
    },
    "Married 💑": {
      color: "#ef4444",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M16.5 3c-1.74 0-3.41.81-4.5 2.09C10.91 3.81 9.24 3 7.5 3 4.42 3 2 5.42 2 8.5c0 3.78 3.4 6.86 8.55 11.54L12 21.35l1.45-1.32C18.6 15.36 22 12.28 22 8.5 22 5.42 19.58 3 16.5 3zm-4.4 15.55l-.1.1-.1-.1C7.14 14.24 4 11.39 4 8.5 4 6.5 5.5 5 7.5 5c1.54 0 3.04.99 3.57 2.36h1.87C13.46 5.99 14.96 5 16.5 5c2 0 3.5 1.5 3.5 3.5 0 2.89-3.14 5.74-7.9 10.05z"/></svg>`,
    },
    "It's complicated 🤷": {
      color: "#6b7280",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm1 17h-2v-2h2v2zm0-4h-2V7h2v8z"/></svg>`,
    },
    "In love and grateful ❤️": {
      color: "#dc2626",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
    },
    "Looking for love 🌹": {
      color: "#f472b6",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M15.5 14h-.79l-.28-.27C15.41 12.59 16 11.11 16 9.5 16 5.91 13.09 3 9.5 3S3 5.91 3 9.5 5.91 16 9.5 16c1.61 0 3.09-.59 4.23-1.57l.27.28v.79l5 4.99L20.49 19l-4.99-5zm-6 0C7.01 14 5 11.99 5 9.5S7.01 5 9.5 5 14 7.01 14 9.5 11.99 14 9.5 14z"/></svg>`,
    },
    "Happily taken 😊": {
      color: "#fb923c",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8zm3.5-9c.83 0 1.5-.67 1.5-1.5S16.33 8 15.5 8 14 8.67 14 9.5s.67 1.5 1.5 1.5zm-7 0c.83 0 1.5-.67 1.5-1.5S9.33 8 8.5 8 7 8.67 7 9.5 7.67 11 8.5 11zm3.5 6.5c2.33 0 4.31-1.46 5.11-3.5H6.89c.8 2.04 2.78 3.5 5.11 3.5z"/></svg>`,
    },
    "Forever yours 💖": {
      color: "#a855f7",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
    },
    "Love is in the air ✨": {
      color: "#06b6d4",
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 2l2.4 7.4h7.6l-6 4.6 2.3 7-6.3-4.6-6.3 4.6 2.3-7-6-4.6h7.6z"/></svg>`,
    },
  };

  const config = configs[status];
  if (!config) {
    // Default heart icon
    return {
      color: baseColor,
      svg: `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor"><path d="M12 21.35l-1.45-1.32C5.4 15.36 2 12.28 2 8.5 2 5.42 4.42 3 7.5 3c1.74 0 3.41.81 4.5 2.09C13.09 3.81 14.76 3 16.5 3 19.58 3 22 5.42 22 8.5c0 3.78-3.4 6.86-8.55 11.54L12 21.35z"/></svg>`,
    };
  }

  return config;
};

// Create custom icon based on status with text
const createStatusIcon = (status: string, nickname: string, isOwn: boolean) => {
  const { color, svg } = getIconConfig(status, isOwn);

  // Extract emoji from status - use simple approach to avoid regex unicode flag
  const emojiMatch = status.match(
    /[\uD800-\uDBFF][\uDC00-\uDFFF]|[\u2600-\u27BF]/,
  );
  const emoji = emojiMatch ? emojiMatch[0] : "💕";

  const ownStyle = isOwn ? "animation: pulse 2s infinite;" : "";
  const glowEffect = isOwn ? `box-shadow: 0 0 20px ${color}40;` : "";

  return L.divIcon({
    className: "custom-marker",
    html: `
      <style>
        @keyframes pulse {
          0%, 100% { transform: scale(1); }
          50% { transform: scale(1.1); }
        }
        @keyframes bounce {
          0%, 100% { transform: translateY(0); }
          50% { transform: translateY(-5px); }
        }
        .heart-marker-container {
          transition: all 0.3s ease;
          cursor: pointer;
        }
        .heart-marker-container:hover {
          transform: scale(1.15) !important;
        }
        .heart-marker-container:hover .marker-label {
          background: ${color} !important;
          color: white !important;
        }
      </style>
      <div class="heart-marker-container" style="display: flex; flex-direction: column; align-items: center; gap: 2px; ${ownStyle}">
        <div class="heart-marker" style="color: ${color}; filter: drop-shadow(0 3px 6px rgba(0,0,0,0.4)); width: 36px; height: 36px; transition: all 0.3s ease;">
          ${svg}
        </div>
        <div class="marker-label" style="
          background: white;
          padding: 3px 8px;
          border-radius: 6px;
          font-size: 11px;
          font-weight: 600;
          color: ${color};
          box-shadow: 0 2px 8px rgba(0,0,0,0.2);
          white-space: nowrap;
          border: 2px solid ${color};
          transition: all 0.3s ease;
          ${glowEffect}
        ">
          ${emoji} ${nickname}
        </div>
      </div>
    `,
    iconSize: [120, 70],
    iconAnchor: [60, 70],
    popupAnchor: [0, -70],
  });
};

export function PinMarker({ pin, isOwn, onClick }: PinMarkerProps) {
  const icon = createStatusIcon(pin.status, pin.nickname, isOwn);

  return (
    <Marker
      position={[pin.lat, pin.lng]}
      icon={icon}
      eventHandlers={{
        click: onClick,
      }}
    >
      <Popup>
        <div className="text-center p-2 min-w-[150px]">
          <p className="font-bold text-rose-600 text-base">{pin.nickname}</p>
          <p className="text-sm text-gray-600 mt-1 mb-2">{pin.status}</p>
          <button
            onClick={onClick}
            className="bg-gradient-to-r from-rose-500 to-pink-500 text-white px-4 py-1.5 rounded-full text-xs font-medium hover:from-rose-600 hover:to-pink-600 transition-all shadow-md"
          >
            💕 View Profile
          </button>
        </div>
      </Popup>
    </Marker>
  );
}
