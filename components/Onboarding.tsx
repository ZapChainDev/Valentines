"use client";

import { useState, useEffect } from "react";
import { Dialog, DialogContent } from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Heart, MapPin, Music, MessageCircle, X } from "lucide-react";

interface OnboardingProps {
  userId: string;
}

const ONBOARDING_STEPS = [
  {
    icon: Heart,
    title: "Welcome to HeartMap! 💕",
    description:
      "Share your love with the world by dropping a pin on the map, adding your favorite love song, and connecting with other hearts.",
    color: "text-rose-500",
  },
  {
    icon: MapPin,
    title: "Drop Your Pin",
    description:
      "Click the + button to place your love status on the map. Share where your heart is and let the world know!",
    color: "text-pink-500",
  },
  {
    icon: Music,
    title: "Add a Love Song",
    description:
      "Attach a YouTube song that captures your feelings. Everyone who clicks your pin can listen to your special tune!",
    color: "text-red-500",
  },
  {
    icon: MessageCircle,
    title: "Chat with Hearts",
    description:
      "Click on any pin to see their story and start chatting. Make new connections and spread the love!",
    color: "text-rose-600",
  },
];

export function Onboarding({ userId }: OnboardingProps) {
  const [isOpen, setIsOpen] = useState(false);
  const [currentStep, setCurrentStep] = useState(0);

  useEffect(() => {
    if (!userId) return;

    const hasSeenOnboarding = localStorage.getItem(`onboarding_${userId}`);
    if (!hasSeenOnboarding) {
      setIsOpen(true);
    }
  }, [userId]);

  const handleNext = () => {
    if (currentStep < ONBOARDING_STEPS.length - 1) {
      setCurrentStep(currentStep + 1);
    } else {
      handleComplete();
    }
  };

  const handleSkip = () => {
    handleComplete();
  };

  const handleComplete = () => {
    localStorage.setItem(`onboarding_${userId}`, "true");
    setIsOpen(false);
    setCurrentStep(0);
  };

  const step = ONBOARDING_STEPS[currentStep];
  const Icon = step.icon;
  const isLastStep = currentStep === ONBOARDING_STEPS.length - 1;

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogContent className="sm:max-w-md">
        <button
          onClick={handleSkip}
          className="absolute right-4 top-4 rounded-sm opacity-70 ring-offset-background transition-opacity hover:opacity-100 disabled:pointer-events-none"
        >
          <X className="h-4 w-4" />
          <span className="sr-only">Close</span>
        </button>

        <div className="flex flex-col items-center text-center space-y-6 py-6">
          {/* Icon */}
          <div className="relative">
            <div
              className={`absolute inset-0 ${step.color} opacity-20 blur-2xl rounded-full`}
            />
            <div className="relative bg-gradient-to-br from-rose-50 to-pink-50 p-6 rounded-full">
              <Icon className={`h-12 w-12 ${step.color}`} strokeWidth={1.5} />
            </div>
          </div>

          {/* Content */}
          <div className="space-y-3 px-4">
            <h2 className="text-2xl font-bold text-gray-900">{step.title}</h2>
            <p className="text-gray-600 leading-relaxed">{step.description}</p>
          </div>

          {/* Progress Dots */}
          <div className="flex gap-2">
            {ONBOARDING_STEPS.map((_, index) => (
              <button
                key={index}
                onClick={() => setCurrentStep(index)}
                className={`h-2 rounded-full transition-all ${
                  index === currentStep
                    ? "w-8 bg-rose-500"
                    : "w-2 bg-gray-300 hover:bg-gray-400"
                }`}
              />
            ))}
          </div>

          {/* Actions */}
          <div className="flex gap-3 w-full pt-2">
            <Button variant="outline" onClick={handleSkip} className="flex-1">
              Skip
            </Button>
            <Button
              onClick={handleNext}
              className="flex-1 bg-rose-500 hover:bg-rose-600"
            >
              {isLastStep ? "Get Started! 🚀" : "Next"}
            </Button>
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
}
