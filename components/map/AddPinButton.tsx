"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Heart, Plus, Sparkles } from "lucide-react";

interface AddPinButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function AddPinButton({ onClick, disabled }: AddPinButtonProps) {
  const [isHovered, setIsHovered] = useState(false);

  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
      <div className="relative">
        {/* Animated rings */}
        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
          <div className="absolute w-20 h-20 rounded-full border-2 border-rose-300 animate-ping opacity-30" />
          <div className="absolute w-24 h-24 rounded-full border border-pink-200 animate-pulse opacity-20" />
        </div>

        <Button
          variant="valentine"
          size="lg"
          onClick={onClick}
          disabled={disabled}
          onMouseEnter={() => setIsHovered(true)}
          onMouseLeave={() => setIsHovered(false)}
          className="relative rounded-full px-8 py-7 shadow-2xl shadow-rose-500/40 transition-all duration-300 hover:scale-110 hover:shadow-rose-500/60 group overflow-hidden"
        >
          {/* Sparkle effects */}
          <Sparkles
            className={`absolute top-1 right-2 h-3 w-3 text-white/70 transition-all duration-300 ${isHovered ? "opacity-100 animate-pulse" : "opacity-0"}`}
          />
          <Sparkles
            className={`absolute bottom-2 left-3 h-2 w-2 text-white/60 transition-all duration-500 ${isHovered ? "opacity-100 animate-pulse" : "opacity-0"}`}
          />

          <div className="flex items-center gap-2">
            <Heart
              className={`h-5 w-5 transition-transform duration-300 ${isHovered ? "scale-125" : ""}`}
              fill="currentColor"
            />
            <Plus className="h-4 w-4" />
            <span className="font-semibold">Drop Your Love Pin</span>
          </div>
        </Button>
      </div>

      {/* Helper text */}
      {disabled && (
        <p className="text-center text-xs text-rose-400 mt-2 bg-white/80 rounded-full px-3 py-1 backdrop-blur-sm">
          📍 Enable location to drop your pin
        </p>
      )}
    </div>
  );
}
