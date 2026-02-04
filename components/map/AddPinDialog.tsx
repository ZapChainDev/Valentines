"use client";

import { useState, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAuth } from "@/components/auth/AuthProvider";
import { useToast } from "@/hooks/use-toast";
import { extractYoutubeId } from "@/lib/utils";
import { db } from "@/lib/firebase/config";
import {
  collection,
  addDoc,
  serverTimestamp,
  doc,
  setDoc,
  updateDoc,
} from "firebase/firestore";
import { Heart, Music, Loader2 } from "lucide-react";
import type { Pin } from "@/types";

const LOVE_STATUSES = [
  "Single and ready to mingle 💫",
  "In a relationship 💕",
  "Engaged 💍",
  "Married 💑",
  "It's complicated 🤷",
  "In love and grateful ❤️",
  "Looking for love 🌹",
  "Happily taken 😊",
  "Forever yours 💖",
  "Love is in the air ✨",
];

interface AddPinDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  latitude: number;
  longitude: number;
  existingPin?: Pin;
}

export function AddPinDialog({
  open,
  onOpenChange,
  latitude,
  longitude,
  existingPin,
}: AddPinDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const isEditing = !!existingPin;
  const [nickname, setNickname] = useState(user?.nickname || "");
  const [status, setStatus] = useState("");
  const [youtubeUrl, setYoutubeUrl] = useState("");
  const [loading, setLoading] = useState(false);

  // Initialize form with existing pin data when editing
  useEffect(() => {
    if (existingPin) {
      setNickname(existingPin.nickname);
      setStatus(existingPin.status);
      setYoutubeUrl(
        existingPin.youtubeId
          ? `https://youtube.com/watch?v=${existingPin.youtubeId}`
          : "",
      );
    } else {
      setNickname(user?.nickname || "");
      setStatus("");
      setYoutubeUrl("");
    }
  }, [existingPin, user, open]);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!user) {
      toast({
        title: "Error",
        description: "You must be logged in to create a pin",
        variant: "destructive",
      });
      return;
    }

    if (!status.trim()) {
      toast({
        title: "Missing status",
        description: "Please enter your love status",
        variant: "destructive",
      });
      return;
    }

    const youtubeId = youtubeUrl ? extractYoutubeId(youtubeUrl) : null;
    if (youtubeUrl && !youtubeId) {
      toast({
        title: "Invalid YouTube URL",
        description: "Please enter a valid YouTube video URL",
        variant: "destructive",
      });
      return;
    }

    setLoading(true);

    try {
      if (!db) {
        throw new Error("Database not initialized");
      }

      // Update user nickname if changed
      if (nickname !== user.nickname) {
        const userRef = doc(db, "users", user.userId);
        await setDoc(
          userRef,
          {
            userId: user.userId,
            nickname,
            createdAt: serverTimestamp(),
          },
          { merge: true },
        );
      }

      if (isEditing && existingPin?.id) {
        // Update existing pin
        const pinRef = doc(db, "pins", existingPin.id);
        await updateDoc(pinRef, {
          nickname: nickname || user.nickname,
          status: status.trim(),
          youtubeId: youtubeId || "",
        });

        toast({
          title: "Pin updated! 💕",
          description: "Your love pin has been updated",
        });
      } else {
        // Create new pin
        const pinsRef = collection(db, "pins");
        await addDoc(pinsRef, {
          userId: user.userId,
          nickname: nickname || user.nickname,
          status: status.trim(),
          youtubeId: youtubeId || "",
          lat: latitude,
          lng: longitude,
          createdAt: serverTimestamp(),
        });

        toast({
          title: "Pin created! 💕",
          description: "Your love pin is now on the map",
        });
      }

      onOpenChange(false);
      setStatus("");
      setYoutubeUrl("");
    } catch (error) {
      console.error("Error creating pin:", error);
      toast({
        title: "Error",
        description: "Failed to create pin. Please try again.",
        variant: "destructive",
      });
    } finally {
      setLoading(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md border-rose-200">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-rose-600">
            <Heart className="h-5 w-5" fill="currentColor" />
            {isEditing ? "Edit Your Love Pin" : "Drop Your Love Pin"}
          </DialogTitle>
          <DialogDescription>
            {isEditing
              ? "Update your love status and song"
              : "Share your love status and a special song with the world"}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4">
          <div className="space-y-2">
            <label className="text-sm font-medium">Your Nickname</label>
            <Input
              placeholder="Enter your nickname"
              value={nickname}
              onChange={(e) => setNickname(e.target.value)}
              maxLength={20}
              className="border-rose-200 focus:border-rose-400"
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Love Status</label>
            <Select value={status} onValueChange={setStatus}>
              <SelectTrigger className="border-rose-200 focus:border-rose-400">
                <SelectValue placeholder="Select your love status" />
              </SelectTrigger>
              <SelectContent>
                {LOVE_STATUSES.map((loveStatus) => (
                  <SelectItem key={loveStatus} value={loveStatus}>
                    {loveStatus}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium flex items-center gap-2">
              <Music className="h-4 w-4 text-pink-500" />
              Your Love Song (optional)
            </label>
            <Input
              placeholder="Paste YouTube URL"
              value={youtubeUrl}
              onChange={(e) => setYoutubeUrl(e.target.value)}
              className="border-rose-200 focus:border-rose-400"
            />
            <p className="text-xs text-muted-foreground">
              Share a song that represents your love
            </p>
          </div>

          <div className="flex gap-3 pt-2">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="flex-1"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              variant="valentine"
              className="flex-1"
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  {isEditing ? "Updating..." : "Creating..."}
                </>
              ) : (
                <>
                  <Heart className="mr-2 h-4 w-4" />
                  {isEditing ? "Update Pin" : "Drop Pin"}
                </>
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  );
}
