"use client";

import { useState, useEffect } from "react";
import { X } from "lucide-react";

interface FloatingTipProps {
  targetId: string;
  message: string;
  delay?: number;
}

export function FloatingTip({
  targetId,
  message,
  delay = 1000,
}: FloatingTipProps) {
  const [isVisible, setIsVisible] = useState(false);
  const [hasBeenShown, setHasBeenShown] = useState(false);

  useEffect(() => {
    // Check if this tip has been dismissed before
    const dismissed = localStorage.getItem(`tip_dismissed_${targetId}`);
    if (dismissed) {
      setHasBeenShown(true);
      return;
    }

    // Show tip after delay
    const timer = setTimeout(() => {
      setIsVisible(true);
    }, delay);

    return () => clearTimeout(timer);
  }, [targetId, delay]);

  const handleDismiss = () => {
    setIsVisible(false);
    localStorage.setItem(`tip_dismissed_${targetId}`, "true");
    setHasBeenShown(true);
  };

  if (!isVisible || hasBeenShown) return null;

  return (
    <div className="absolute bottom-full mb-3 left-1/2 -translate-x-1/2 z-50 animate-in fade-in slide-in-from-bottom-2 duration-500">
      <div className="relative bg-rose-600 text-white px-4 py-3 rounded-lg shadow-lg max-w-xs">
        <button
          onClick={handleDismiss}
          className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md hover:bg-gray-100 transition-colors"
        >
          <X className="h-3 w-3 text-rose-600" />
        </button>

        <p className="text-sm pr-4">{message}</p>

        {/* Arrow pointing down */}
        <div className="absolute top-full left-1/2 -translate-x-1/2 w-0 h-0 border-l-8 border-l-transparent border-r-8 border-r-transparent border-t-8 border-t-rose-600" />
      </div>
    </div>
  );
}
