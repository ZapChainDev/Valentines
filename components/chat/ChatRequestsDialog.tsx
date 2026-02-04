"use client";

import { useState } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Heart, Loader2, Check, X } from "lucide-react";
import { useAuth } from "@/components/auth/AuthProvider";
import { useChatRequests } from "@/hooks/use-chat-requests";
import { doc, updateDoc } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { useToast } from "@/hooks/use-toast";

interface ChatRequestsDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

export function ChatRequestsDialog({
  open,
  onOpenChange,
}: ChatRequestsDialogProps) {
  const { user } = useAuth();
  const { requests, loading } = useChatRequests(user?.userId || "");
  const { toast } = useToast();
  const [processing, setProcessing] = useState<string | null>(null);

  const handleAccept = async (chatId: string, otherUserNickname: string) => {
    if (!db) return;

    setProcessing(chatId);
    try {
      // Find the chat document
      const { collection, query, where, getDocs } =
        await import("firebase/firestore");
      const chatsRef = collection(db, "chats");
      const q = query(chatsRef, where("chatId", "==", chatId));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const chatDoc = snapshot.docs[0];
        await updateDoc(doc(db, "chats", chatDoc.id), {
          status: "accepted",
        });

        toast({
          title: "Request accepted!",
          description: `You can now chat with ${otherUserNickname}`,
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to accept request",
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  const handleReject = async (chatId: string) => {
    if (!db) return;

    setProcessing(chatId);
    try {
      // Find the chat document
      const { collection, query, where, getDocs } =
        await import("firebase/firestore");
      const chatsRef = collection(db, "chats");
      const q = query(chatsRef, where("chatId", "==", chatId));
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        const chatDoc = snapshot.docs[0];
        await updateDoc(doc(db, "chats", chatDoc.id), {
          status: "rejected",
        });

        toast({
          title: "Request rejected",
          description: "The chat request has been declined",
        });
      }
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to reject request",
        variant: "destructive",
      });
    } finally {
      setProcessing(null);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-rose-700">
            <Heart className="h-5 w-5 text-rose-500" fill="currentColor" />
            Chat Requests
          </DialogTitle>
        </DialogHeader>

        <ScrollArea className="max-h-[400px] pr-4">
          {loading ? (
            <div className="flex items-center justify-center py-8">
              <Loader2 className="h-6 w-6 animate-spin text-rose-400" />
            </div>
          ) : requests.length === 0 ? (
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <Heart className="h-12 w-12 text-rose-200 mb-3" />
              <p className="text-muted-foreground">No pending requests</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Check back later 💕
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {requests.map((request) => (
                <div
                  key={request.chatId}
                  className="flex items-center gap-3 p-4 border border-rose-100 rounded-lg bg-gradient-to-r from-rose-50/50 to-pink-50/50"
                >
                  <Avatar
                    fallback={request.otherUserNickname}
                    className="h-12 w-12"
                  />
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-rose-700 truncate">
                      {request.otherUserNickname}
                    </p>
                    <p className="text-xs text-muted-foreground">
                      wants to chat with you
                    </p>
                  </div>
                  <div className="flex gap-2">
                    <Button
                      size="sm"
                      variant="valentine"
                      onClick={() =>
                        handleAccept(request.chatId, request.otherUserNickname)
                      }
                      disabled={processing === request.chatId}
                      className="h-8 w-8 p-0"
                    >
                      {processing === request.chatId ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : (
                        <Check className="h-4 w-4" />
                      )}
                    </Button>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => handleReject(request.chatId)}
                      disabled={processing === request.chatId}
                      className="h-8 w-8 p-0 border-rose-200"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              ))}
            </div>
          )}
        </ScrollArea>
      </DialogContent>
    </Dialog>
  );
}
