"use client";

import { useState, useRef, useEffect } from "react";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Avatar } from "@/components/ui/avatar";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAuth } from "@/components/auth/AuthProvider";
import { useChat } from "@/hooks/use-chat";
import { useToast } from "@/hooks/use-toast";
import { formatTimestamp } from "@/lib/utils";
import { Send, Loader2, Heart } from "lucide-react";
import type { User } from "@/types";

interface ChatDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  otherUser: User;
}

export function ChatDialog({ open, onOpenChange, otherUser }: ChatDialogProps) {
  const { user } = useAuth();
  const { toast } = useToast();
  const [message, setMessage] = useState("");
  const [sending, setSending] = useState(false);
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    messages,
    loading,
    error,
    chatStatus,
    requestedBy,
    sendChatRequest,
    acceptChatRequest,
    rejectChatRequest,
    sendMessage,
  } = useChat(user?.userId || "", otherUser.userId);

  // Scroll to bottom when new messages arrive
  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  const handleSend = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!message.trim() || !user) return;

    setSending(true);
    try {
      await sendMessage(user.userId, message);
      setMessage("");
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to send message",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleSendRequest = async () => {
    if (!user) return;

    setSending(true);
    try {
      await sendChatRequest(user.userId);
      toast({
        title: "Request sent!",
        description: `Your chat request has been sent to ${otherUser.nickname}`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to send request",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleAcceptRequest = async () => {
    setSending(true);
    try {
      await acceptChatRequest();
      toast({
        title: "Request accepted!",
        description: `You can now chat with ${otherUser.nickname}`,
      });
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to accept request",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  const handleRejectRequest = async () => {
    setSending(true);
    try {
      await rejectChatRequest();
      toast({
        title: "Request rejected",
        description: "The chat request has been declined",
      });
      onOpenChange(false);
    } catch (err: any) {
      toast({
        title: "Error",
        description: err.message || "Failed to reject request",
        variant: "destructive",
      });
    } finally {
      setSending(false);
    }
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="w-full max-w-[95vw] sm:max-w-md h-[85vh] sm:h-[600px] max-h-[85vh] sm:max-h-[80vh] flex flex-col p-0 border-rose-200">
        {/* Header */}
        <DialogHeader className="p-3 sm:p-4 border-b bg-gradient-to-r from-rose-50 to-pink-50">
          <DialogTitle className="flex items-center gap-2 sm:gap-3">
            <Avatar
              fallback={otherUser.nickname}
              className="h-8 w-8 sm:h-10 sm:w-10"
            />
            <div>
              <span className="text-rose-700">{otherUser.nickname}</span>
              <p className="text-xs font-normal text-muted-foreground">
                Click to view profile
              </p>
            </div>
          </DialogTitle>
        </DialogHeader>

        {/* Messages */}
        <ScrollArea className="flex-1 p-3 sm:p-4 chat-messages">
          {loading ? (
            <div className="flex items-center justify-center h-full">
              <Loader2 className="h-6 w-6 animate-spin text-rose-400" />
            </div>
          ) : error ? (
            <div className="flex items-center justify-center h-full text-destructive">
              {error}
            </div>
          ) : chatStatus === null ? (
            // No chat request sent yet
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <Heart
                className="h-16 w-16 text-rose-200 mb-4"
                fill="currentColor"
              />
              <h3 className="text-lg font-semibold text-rose-700 mb-2">
                Send a chat request
              </h3>
              <p className="text-muted-foreground mb-6">
                Send {otherUser.nickname} a request to start chatting 💕
              </p>
              <Button
                variant="valentine"
                onClick={handleSendRequest}
                disabled={sending}
                className="w-full max-w-xs"
              >
                {sending ? (
                  <>
                    <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                    Sending...
                  </>
                ) : (
                  <>
                    <Heart className="mr-2 h-4 w-4" />
                    Send Chat Request
                  </>
                )}
              </Button>
            </div>
          ) : chatStatus === "pending" && requestedBy === user?.userId ? (
            // Current user sent the request, waiting for response
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <Loader2 className="h-16 w-16 text-rose-400 mb-4 animate-spin" />
              <h3 className="text-lg font-semibold text-rose-700 mb-2">
                Request sent!
              </h3>
              <p className="text-muted-foreground">
                Waiting for {otherUser.nickname} to accept your chat request
              </p>
            </div>
          ) : chatStatus === "pending" && requestedBy !== user?.userId ? (
            // Other user sent the request, show accept/reject buttons
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <Heart
                className="h-16 w-16 text-rose-400 mb-4 animate-pulse"
                fill="currentColor"
              />
              <h3 className="text-lg font-semibold text-rose-700 mb-2">
                Chat Request
              </h3>
              <p className="text-muted-foreground mb-6">
                {otherUser.nickname} wants to chat with you! 💕
              </p>
              <div className="flex gap-3 w-full max-w-xs">
                <Button
                  variant="valentine"
                  onClick={handleAcceptRequest}
                  disabled={sending}
                  className="flex-1"
                >
                  {sending ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    "Accept"
                  )}
                </Button>
                <Button
                  variant="outline"
                  onClick={handleRejectRequest}
                  disabled={sending}
                  className="flex-1 border-rose-200"
                >
                  Decline
                </Button>
              </div>
            </div>
          ) : chatStatus === "rejected" ? (
            // Chat request was rejected
            <div className="flex flex-col items-center justify-center h-full text-center p-6">
              <div className="h-16 w-16 rounded-full bg-gray-100 flex items-center justify-center mb-4">
                <Heart className="h-8 w-8 text-gray-400" />
              </div>
              <h3 className="text-lg font-semibold text-gray-700 mb-2">
                Request declined
              </h3>
              <p className="text-muted-foreground">
                The chat request was declined
              </p>
            </div>
          ) : messages.length === 0 ? (
            <div className="flex flex-col items-center justify-center h-full text-center">
              <Heart
                className="h-12 w-12 text-rose-200 mb-3"
                fill="currentColor"
              />
              <p className="text-muted-foreground">Start the conversation!</p>
              <p className="text-sm text-muted-foreground/70 mt-1">
                Say hi to {otherUser.nickname} 💕
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {messages.map((msg) => {
                const isOwn = msg.senderId === user?.userId;
                return (
                  <div
                    key={msg.id}
                    className={`flex ${isOwn ? "justify-end" : "justify-start"}`}
                  >
                    <div
                      className={`max-w-[80%] rounded-2xl px-4 py-2 ${
                        isOwn
                          ? "bg-gradient-to-r from-rose-500 to-pink-500 text-white rounded-br-md"
                          : "bg-gray-100 text-gray-900 rounded-bl-md"
                      }`}
                    >
                      <p className="text-sm whitespace-pre-wrap break-words">
                        {msg.text}
                      </p>
                      <p
                        className={`text-xs mt-1 ${
                          isOwn ? "text-rose-100" : "text-gray-400"
                        }`}
                      >
                        {formatTimestamp(msg.createdAt)}
                      </p>
                    </div>
                  </div>
                );
              })}
              <div ref={messagesEndRef} />
            </div>
          )}
        </ScrollArea>

        {/* Input */}
        {chatStatus === "accepted" && (
          <form
            onSubmit={handleSend}
            className="p-3 sm:p-4 border-t bg-white flex gap-2"
          >
            <Input
              value={message}
              onChange={(e) => setMessage(e.target.value)}
              placeholder="Type a message..."
              maxLength={500}
              className="flex-1 border-rose-200 focus:border-rose-400"
              disabled={sending}
            />
            <Button
              type="submit"
              variant="valentine"
              size="icon"
              disabled={sending || !message.trim()}
            >
              {sending ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <Send className="h-4 w-4" />
              )}
            </Button>
          </form>
        )}
      </DialogContent>
    </Dialog>
  );
}
