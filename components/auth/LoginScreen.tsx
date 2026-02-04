"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { useAuth } from "./AuthProvider";
import {
  Heart,
  MapPin,
  Music,
  MessageCircle,
  Loader2,
  Sparkles,
  Globe,
} from "lucide-react";

export function LoginScreen() {
  const { signInWithGoogle } = useAuth();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleLogin = async () => {
    setLoading(true);
    setError(null);
    try {
      await signInWithGoogle();
    } catch (err) {
      setError("Failed to sign in. Please try again.");
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen relative overflow-hidden">
      {/* Animated Background */}
      <div className="absolute inset-0 bg-gradient-to-br from-rose-50 via-pink-50 to-red-50">
        <div className="absolute inset-0 opacity-30">
          <div className="absolute top-20 left-20 w-72 h-72 bg-rose-300 rounded-full mix-blend-multiply filter blur-xl animate-blob" />
          <div className="absolute top-40 right-20 w-72 h-72 bg-pink-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-2000" />
          <div className="absolute -bottom-8 left-40 w-72 h-72 bg-red-300 rounded-full mix-blend-multiply filter blur-xl animate-blob animation-delay-4000" />
        </div>
      </div>

      {/* Floating Hearts Background */}
      <div className="hearts-bg absolute inset-0" />

      {/* Content */}
      <div className="relative z-10 min-h-screen flex flex-col items-center justify-center p-4">
        {/* Hero Section */}
        <div className="text-center mb-8 max-w-2xl">
          <div className="inline-flex items-center gap-3 mb-6">
            <div className="relative">
              <Heart
                className="h-20 w-20 text-rose-500 animate-pulse-heart"
                fill="currentColor"
              />
              <Sparkles className="absolute -top-2 -right-2 h-6 w-6 text-pink-400 animate-pulse" />
            </div>
          </div>

          <h1 className="text-5xl md:text-6xl font-bold mb-4 bg-gradient-to-r from-rose-600 via-pink-600 to-red-600 bg-clip-text text-transparent">
            HeartMap
          </h1>

          <p className="text-xl md:text-2xl text-gray-700 mb-3 font-medium">
            Share Your Love Story with the World
          </p>

          <p className="text-gray-600 max-w-lg mx-auto">
            Connect hearts across the globe. Drop your pin, share your song, and
            find love on the map. Join thousands spreading love this Valentine&apos;s
            season.
          </p>
        </div>

        {/* Login Card */}
        <Card className="w-full max-w-md border-rose-200 shadow-2xl shadow-rose-500/20 backdrop-blur-sm bg-white/95">
          <CardHeader className="text-center pb-4">
            <CardTitle className="text-2xl font-semibold text-gray-800">
              Get Started
            </CardTitle>
            <CardDescription className="text-base">
              Sign in to begin your journey
            </CardDescription>
          </CardHeader>

          <CardContent className="space-y-6">
            {/* Features Grid */}
            <div className="grid grid-cols-2 gap-3">
              <div className="group p-4 rounded-xl bg-gradient-to-br from-rose-50 to-pink-50 border border-rose-100 hover:border-rose-300 transition-all hover:shadow-md cursor-default">
                <MapPin className="h-7 w-7 text-rose-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-gray-700">
                  Pin Location
                </p>
                <p className="text-xs text-gray-500 mt-1">Drop your mark</p>
              </div>

              <div className="group p-4 rounded-xl bg-gradient-to-br from-pink-50 to-rose-50 border border-pink-100 hover:border-pink-300 transition-all hover:shadow-md cursor-default">
                <Music className="h-7 w-7 text-pink-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-gray-700">Love Song</p>
                <p className="text-xs text-gray-500 mt-1">Share melody</p>
              </div>

              <div className="group p-4 rounded-xl bg-gradient-to-br from-pink-50 to-red-50 border border-pink-100 hover:border-pink-300 transition-all hover:shadow-md cursor-default">
                <Heart className="h-7 w-7 text-pink-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-gray-700">Status</p>
                <p className="text-xs text-gray-500 mt-1">Express yourself</p>
              </div>

              <div className="group p-4 rounded-xl bg-gradient-to-br from-rose-50 to-red-50 border border-rose-100 hover:border-rose-300 transition-all hover:shadow-md cursor-default">
                <MessageCircle className="h-7 w-7 text-rose-500 mx-auto mb-2 group-hover:scale-110 transition-transform" />
                <p className="text-sm font-medium text-gray-700">Chat</p>
                <p className="text-xs text-gray-500 mt-1">Connect hearts</p>
              </div>
            </div>

            {error && (
              <div className="p-3 rounded-lg bg-red-50 border border-red-200 text-red-600 text-sm text-center">
                {error}
              </div>
            )}

            {/* Google Sign In Button */}
            <Button
              variant="valentine"
              size="lg"
              className="w-full text-base font-semibold shadow-lg hover:shadow-xl transition-all"
              onClick={handleLogin}
              disabled={loading}
            >
              {loading ? (
                <>
                  <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                  Signing in...
                </>
              ) : (
                <>
                  <svg className="mr-2 h-5 w-5" viewBox="0 0 24 24">
                    <path
                      fill="currentColor"
                      d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z"
                    />
                    <path
                      fill="currentColor"
                      d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z"
                    />
                    <path
                      fill="currentColor"
                      d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z"
                    />
                  </svg>
                  Continue with Google
                </>
              )}
            </Button>

            <div className="flex items-center gap-2 text-xs text-gray-500 justify-center">
              <Globe className="h-3.5 w-3.5" />
              <p>Join the global community of love</p>
            </div>
          </CardContent>
        </Card>

        {/* Footer */}
        <div className="mt-8 text-center">
          <p className="text-sm text-gray-600">
            Made with{" "}
            <Heart
              className="inline h-4 w-4 text-rose-500 mx-1"
              fill="currentColor"
            />{" "}
            by{" "}
            <span className="font-semibold bg-gradient-to-r from-rose-600 to-pink-600 bg-clip-text text-transparent">
              John
            </span>
          </p>
          <p className="text-xs text-gray-500 mt-2">
            © 2026 HeartMap. Spreading love worldwide.
          </p>
        </div>
      </div>

      <style jsx>{`
        @keyframes blob {
          0% {
            transform: translate(0px, 0px) scale(1);
          }
          33% {
            transform: translate(30px, -50px) scale(1.1);
          }
          66% {
            transform: translate(-20px, 20px) scale(0.9);
          }
          100% {
            transform: translate(0px, 0px) scale(1);
          }
        }
        .animate-blob {
          animation: blob 7s infinite;
        }
        .animation-delay-2000 {
          animation-delay: 2s;
        }
        .animation-delay-4000 {
          animation-delay: 4s;
        }
      `}</style>
    </div>
  );
}
