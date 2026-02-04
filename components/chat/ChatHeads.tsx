"use client";

import { useState } from "react";
import { Avatar } from "@/components/ui/avatar";
import { ChatDialog } from "./ChatDialog";
import { useAuth } from "@/components/auth/AuthProvider";
import { useActiveChats } from "@/hooks/use-active-chats";
import { MessageCircle } from "lucide-react";
import type { User } from "@/types";

export function ChatHeads() {
  const { user } = useAuth();
  const { chats, loading } = useActiveChats(user?.userId || "");
  const [selectedUser, setSelectedUser] = useState<User | null>(null);
  const [showChat, setShowChat] = useState(false);

  const handleChatHeadClick = (otherUser: User) => {
    setSelectedUser(otherUser);
    setShowChat(true);
  };

  if (loading || chats.length === 0) {
    return null;
  }

  return (
    <>
      <div className="fixed bottom-4 right-4 z-30 flex flex-col gap-3">
        {chats.map((chat) => (
          <button
            key={chat.chatId}
            onClick={() => handleChatHeadClick(chat.otherUser)}
            className="group relative"
          >
            <div className="relative">
              <Avatar
                fallback={chat.otherUser.nickname}
                className="h-14 w-14 border-2 border-white shadow-lg ring-2 ring-rose-200 transition-transform hover:scale-110 cursor-pointer"
              />
              <div className="absolute -bottom-1 -right-1 h-5 w-5 bg-gradient-to-r from-rose-500 to-pink-500 rounded-full flex items-center justify-center shadow-md">
                <MessageCircle className="h-3 w-3 text-white" />
              </div>
            </div>

            {/* Tooltip */}
            <div className="absolute right-16 top-1/2 -translate-y-1/2 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none">
              <div className="bg-gray-900 text-white text-sm px-3 py-1.5 rounded-lg whitespace-nowrap">
                {chat.otherUser.nickname}
              </div>
            </div>
          </button>
        ))}
      </div>

      {selectedUser && (
        <ChatDialog
          open={showChat}
          onOpenChange={setShowChat}
          otherUser={selectedUser}
        />
      )}
    </>
  );
}
