"use client";

import { useEffect, useState } from "react";
import { MapPin, Sparkles } from "lucide-react";

interface EmptyStateHintProps {
  hasUserPin: boolean;
  totalPins: number;
}

export function EmptyStateHint({ hasUserPin, totalPins }: EmptyStateHintProps) {
  const [showHint, setShowHint] = useState(false);

  useEffect(() => {
    // Show hint if user hasn't dropped a pin yet and there are no pins visible
    if (!hasUserPin && totalPins === 0) {
      const timer = setTimeout(() => setShowHint(true), 2000);
      return () => clearTimeout(timer);
    } else {
      setShowHint(false);
    }
  }, [hasUserPin, totalPins]);

  if (!showHint) return null;

  return (
    <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 pointer-events-none z-10">
      <div className="bg-white/95 backdrop-blur-sm rounded-2xl shadow-2xl p-8 max-w-md mx-4 border-2 border-rose-200 animate-in fade-in zoom-in duration-500">
        <div className="flex flex-col items-center text-center space-y-4">
          <div className="relative">
            <div className="absolute inset-0 bg-rose-500 opacity-20 blur-2xl rounded-full" />
            <div className="relative bg-gradient-to-br from-rose-100 to-pink-100 p-4 rounded-full">
              <MapPin className="h-12 w-12 text-rose-600" strokeWidth={1.5} />
            </div>
          </div>

          <div className="space-y-2">
            <h3 className="text-xl font-bold text-gray-900 flex items-center gap-2 justify-center">
              Drop Your First Pin!{" "}
              <Sparkles className="h-5 w-5 text-yellow-500" />
            </h3>
            <p className="text-gray-600">
              Click the <strong className="text-rose-600">+ button</strong>{" "}
              below to place your love on the map and share your story with the
              world!
            </p>
          </div>

          <div className="flex items-center gap-2 text-sm text-gray-500">
            <div className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
            Start spreading love now
          </div>
        </div>
      </div>
    </div>
  );
}
