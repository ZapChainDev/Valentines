"use client";

import { useAuth } from "@/components/auth/AuthProvider";
import { LoginScreen } from "@/components/auth/LoginScreen";
import { MapView } from "@/components/map/MapView";
import { Header } from "@/components/Header";
import { ChatHeads } from "@/components/chat/ChatHeads";
import { Loader2 } from "lucide-react";

export default function Home() {
  const { user, loading } = useAuth();

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="h-12 w-12 animate-spin text-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading HeartMap...</p>
        </div>
      </div>
    );
  }

  if (!user) {
    return <LoginScreen />;
  }

  return (
    <div className="h-screen flex flex-col">
      <Header />
      <div className="flex-1 relative">
        <MapView />
        <ChatHeads />
      </div>
    </div>
  );
}
