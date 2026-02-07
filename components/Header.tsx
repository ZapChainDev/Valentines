"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Avatar } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import { useAuth } from "@/components/auth/AuthProvider";
import { useChatRequests } from "@/hooks/use-chat-requests";
import { ChatRequestsDialog } from "@/components/chat/ChatRequestsDialog";
import { HelpButton } from "@/components/HelpButton";
import { Heart, LogOut, MessageCircle } from "lucide-react";

export function Header() {
  const { user, signOut } = useAuth();
  const { requests } = useChatRequests(user?.userId || "");
  const [showRequests, setShowRequests] = useState(false);

  const handleSignOut = async () => {
    try {
      await signOut();
    } catch (error) {
      console.error("Error signing out:", error);
    }
  };

  return (
    <>
      <header className="bg-white/80 backdrop-blur-sm border-b border-rose-100 px-4 py-3 flex items-center justify-between z-10">
        <div className="flex items-center gap-2">
          <Heart className="h-6 w-6 text-rose-500" fill="currentColor" />
          <h1 className="text-xl font-bold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
            HeartMap
          </h1>
        </div>

        <div className="flex items-center gap-3">
          {user && (
            <>
              {/* Help Button */}
              <HelpButton />

              {/* Chat Requests Button */}
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setShowRequests(true)}
                className="relative text-rose-500 hover:text-rose-600 hover:bg-rose-50"
              >
                <MessageCircle className="h-4 w-4" />
                {requests.length > 0 && (
                  <Badge
                    variant="destructive"
                    className="absolute -top-1 -right-1 h-5 w-5 p-0 flex items-center justify-center text-xs bg-rose-500"
                  >
                    {requests.length}
                  </Badge>
                )}
                <span className="ml-2 hidden sm:block">Requests</span>
              </Button>

              <div className="flex items-center gap-2">
                <Avatar fallback={user.nickname} className="h-8 w-8" />
                <span className="text-sm font-medium text-rose-700 hidden sm:block">
                  {user.nickname}
                </span>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleSignOut}
                className="text-rose-500 hover:text-rose-600 hover:bg-rose-50"
              >
                <LogOut className="h-4 w-4" />
                <span className="ml-2 hidden sm:block">Sign out</span>
              </Button>
            </>
          )}
        </div>
      </header>

      <ChatRequestsDialog open={showRequests} onOpenChange={setShowRequests} />
    </>
  );
}
