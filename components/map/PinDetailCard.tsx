"use client";

import { useState } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Avatar } from "@/components/ui/avatar";
import { YouTubePlayer } from "./YouTubePlayer";
import { AddPinDialog } from "./AddPinDialog";
import { ChatDialog } from "@/components/chat/ChatDialog";
import { X, MessageCircle, Music, MapPin, Clock, Pencil } from "lucide-react";
import { formatTimestamp } from "@/lib/utils";
import { useAuth } from "@/components/auth/AuthProvider";
import type { Pin } from "@/types";

interface PinDetailCardProps {
  pin: Pin;
  onClose: () => void;
  isOwn: boolean;
}

export function PinDetailCard({ pin, onClose, isOwn }: PinDetailCardProps) {
  const [showChat, setShowChat] = useState(false);
  const [showEditDialog, setShowEditDialog] = useState(false);
  const { user } = useAuth();

  return (
    <>
      <div className="absolute bottom-4 left-4 right-4 md:left-auto md:right-4 md:w-96 z-20">
        <Card className="border-rose-200 shadow-xl overflow-hidden">
          <CardHeader className="pb-3 bg-gradient-to-r from-rose-50 to-pink-50 relative">
            <button
              onClick={onClose}
              className="absolute top-3 right-3 p-1 rounded-full hover:bg-rose-100 transition-colors"
            >
              <X className="h-5 w-5 text-rose-500" />
            </button>

            <div className="flex items-center gap-3">
              <Avatar fallback={pin.nickname} className="h-12 w-12" />
              <div className="flex-1">
                <CardTitle className="text-lg text-rose-700 flex items-center gap-2">
                  {pin.nickname}
                  {isOwn && (
                    <Badge variant="love" className="text-xs">
                      You
                    </Badge>
                  )}
                </CardTitle>
                <div className="flex items-center gap-1 text-xs text-muted-foreground mt-1">
                  <Clock className="h-3 w-3" />
                  {formatTimestamp(pin.createdAt)}
                </div>
              </div>
            </div>
          </CardHeader>

          <CardContent className="space-y-4 pt-4">
            {/* Status */}
            <div className="flex items-start gap-2">
              <MapPin className="h-4 w-4 text-rose-400 mt-0.5 flex-shrink-0" />
              <p className="text-sm leading-relaxed">{pin.status}</p>
            </div>

            {/* YouTube Player */}
            {pin.youtubeId && (
              <div className="space-y-2">
                <div className="flex items-center gap-2 text-sm text-muted-foreground">
                  <Music className="h-4 w-4 text-pink-400" />
                  <span>Love Song</span>
                </div>
                <YouTubePlayer videoId={pin.youtubeId} />
              </div>
            )}

            {/* Chat Button */}
            {!isOwn && user && (
              <Button
                variant="valentine"
                className="w-full"
                onClick={() => setShowChat(true)}
              >
                <MessageCircle className="mr-2 h-4 w-4" />
                Chat with {pin.nickname}
              </Button>
            )}

            {/* Edit Button */}
            {isOwn && (
              <Button
                variant="outline"
                className="w-full border-rose-200 text-rose-600 hover:bg-rose-50"
                onClick={() => setShowEditDialog(true)}
              >
                <Pencil className="mr-2 h-4 w-4" />
                Edit Pin
              </Button>
            )}
          </CardContent>
        </Card>
      </div>

      {/* Chat Dialog */}
      {showChat && user && (
        <ChatDialog
          open={showChat}
          onOpenChange={setShowChat}
          otherUser={{
            userId: pin.userId,
            nickname: pin.nickname,
            createdAt: pin.createdAt,
          }}
        />
      )}

      {/* Edit Dialog */}
      {showEditDialog && (
        <AddPinDialog
          open={showEditDialog}
          onOpenChange={setShowEditDialog}
          latitude={pin.lat}
          longitude={pin.lng}
          existingPin={pin}
        />
      )}
    </>
  );
}
