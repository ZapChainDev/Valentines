"use client";

import { Button } from "@/components/ui/button";
import { Heart, Plus } from "lucide-react";

interface AddPinButtonProps {
  onClick: () => void;
  disabled?: boolean;
}

export function AddPinButton({ onClick, disabled }: AddPinButtonProps) {
  return (
    <div className="absolute bottom-6 left-1/2 -translate-x-1/2 z-10">
      <Button
        variant="valentine"
        size="lg"
        onClick={onClick}
        disabled={disabled}
        className="rounded-full px-6 py-6 shadow-lg shadow-rose-500/30 animate-float"
      >
        <Heart className="mr-2 h-5 w-5" fill="currentColor" />
        <Plus className="h-4 w-4 mr-1" />
        Drop Your Pin
      </Button>
    </div>
  );
}
