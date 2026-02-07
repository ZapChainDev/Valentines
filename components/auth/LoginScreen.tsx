"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { useAuth } from "./AuthProvider";
import { usePinsCount } from "@/hooks/use-pins-count";
import { Heart, Loader2, MapPin, Music, MessageCircle } from "lucide-react";

export function LoginScreen() {
  const { signInWithGoogle } = useAuth();
  const { count: pinsCount, loading: pinsCountLoading } = usePinsCount();
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
    <div className="min-h-screen bg-white">
      {/* Navigation */}
      <nav className="fixed top-0 left-0 right-0 z-50 bg-white/80 backdrop-blur-md border-b border-gray-100">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 py-3 sm:py-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Heart className="h-7 w-7 text-rose-500" fill="currentColor" />
            <span className="text-xl font-bold text-gray-900">HeartMap</span>
          </div>
          <Button
            variant="outline"
            size="sm"
            onClick={handleLogin}
            disabled={loading}
            className="border-rose-200 text-rose-600 hover:bg-rose-50"
          >
            {loading ? <Loader2 className="h-4 w-4 animate-spin" /> : "Sign In"}
          </Button>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="pt-24 sm:pt-32 pb-12 sm:pb-20 px-4 sm:px-6">
        <div className="max-w-6xl mx-auto">
          <div className="grid lg:grid-cols-2 gap-8 lg:gap-12 items-center">
            {/* Left Content */}
            <div className="space-y-8">
              <div className="inline-flex items-center gap-2 bg-rose-50 text-rose-600 px-4 py-2 rounded-full text-sm font-medium">
                <span className="w-2 h-2 bg-rose-500 rounded-full animate-pulse" />
                Valentine&apos;s Special 2026
              </div>

              <h1 className="text-3xl sm:text-5xl lg:text-6xl font-bold text-gray-900 leading-tight">
                Share your love
                <span className="block text-rose-500">with the world</span>
              </h1>

              <p className="text-base sm:text-xl text-gray-600 leading-relaxed max-w-lg">
                Drop your pin on the global map, share your favorite love song,
                and connect with hearts around the world.
              </p>

              {error && (
                <div className="p-4 rounded-xl bg-red-50 border border-red-100 text-red-600 text-sm">
                  {error}
                </div>
              )}

              <div className="flex flex-col sm:flex-row gap-4">
                <Button
                  size="lg"
                  onClick={handleLogin}
                  disabled={loading}
                  className="bg-rose-500 hover:bg-rose-600 text-white px-8 py-6 text-lg rounded-xl shadow-lg shadow-rose-500/25 transition-all hover:shadow-xl hover:shadow-rose-500/30"
                >
                  {loading ? (
                    <>
                      <Loader2 className="mr-2 h-5 w-5 animate-spin" />
                      Connecting...
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
                      Get Started with Google
                    </>
                  )}
                </Button>
              </div>

              {/* Stats */}
              <div className="flex flex-wrap gap-4 sm:gap-8 pt-4">
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    {pinsCountLoading ? "..." : pinsCount.toLocaleString()}
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Love pins dropped
                  </p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    150+
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Countries reached
                  </p>
                </div>
                <div>
                  <p className="text-2xl sm:text-3xl font-bold text-gray-900">
                    98%
                  </p>
                  <p className="text-xs sm:text-sm text-gray-500">
                    Happy hearts
                  </p>
                </div>
              </div>
            </div>

            {/* Right Content - Map Preview */}
            <div className="relative hidden lg:block">
              <div className="relative bg-gradient-to-br from-rose-50 to-pink-50 rounded-3xl p-8 shadow-2xl shadow-rose-500/10">
                {/* Mock Map */}
                <div className="aspect-square rounded-2xl bg-gradient-to-br from-blue-50 to-cyan-50 relative overflow-hidden">
                  {/* Grid pattern */}
                  <div
                    className="absolute inset-0 opacity-20"
                    style={{
                      backgroundImage: `linear-gradient(to right, #e5e7eb 1px, transparent 1px), linear-gradient(to bottom, #e5e7eb 1px, transparent 1px)`,
                      backgroundSize: "40px 40px",
                    }}
                  />

                  {/* Sample pins */}
                  <div className="absolute top-1/4 left-1/3 flex flex-col items-center animate-bounce">
                    <Heart
                      className="h-8 w-8 text-rose-500 drop-shadow-lg"
                      fill="currentColor"
                    />
                    <span className="mt-1 px-2 py-0.5 bg-white rounded-full text-xs font-medium text-rose-600 shadow-md">
                      Maria ❤️
                    </span>
                  </div>

                  <div
                    className="absolute top-1/2 right-1/4 flex flex-col items-center animate-bounce"
                    style={{ animationDelay: "0.5s" }}
                  >
                    <Heart
                      className="h-8 w-8 text-pink-500 drop-shadow-lg"
                      fill="currentColor"
                    />
                    <span className="mt-1 px-2 py-0.5 bg-white rounded-full text-xs font-medium text-pink-600 shadow-md">
                      Juan 💕
                    </span>
                  </div>

                  <div
                    className="absolute bottom-1/3 left-1/2 flex flex-col items-center animate-bounce"
                    style={{ animationDelay: "1s" }}
                  >
                    <Heart
                      className="h-8 w-8 text-red-500 drop-shadow-lg"
                      fill="currentColor"
                    />
                    <span className="mt-1 px-2 py-0.5 bg-white rounded-full text-xs font-medium text-red-600 shadow-md">
                      Sofia 💖
                    </span>
                  </div>

                  {/* Connection lines */}
                  <svg className="absolute inset-0 w-full h-full pointer-events-none">
                    <line
                      x1="33%"
                      y1="30%"
                      x2="75%"
                      y2="55%"
                      stroke="#fda4af"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      className="animate-pulse"
                    />
                    <line
                      x1="50%"
                      y1="67%"
                      x2="75%"
                      y2="55%"
                      stroke="#f9a8d4"
                      strokeWidth="2"
                      strokeDasharray="5,5"
                      className="animate-pulse"
                      style={{ animationDelay: "0.5s" }}
                    />
                  </svg>
                </div>

                {/* Floating UI Elements */}
                <div className="absolute -top-4 -right-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-rose-100 rounded-full flex items-center justify-center">
                      <Music className="h-5 w-5 text-rose-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        Now Playing
                      </p>
                      <p className="text-xs text-gray-500">
                        Perfect - Ed Sheeran
                      </p>
                    </div>
                  </div>
                </div>

                <div className="absolute -bottom-4 -left-4 bg-white rounded-2xl shadow-xl p-4 border border-gray-100">
                  <div className="flex items-center gap-3">
                    <div className="w-10 h-10 bg-pink-100 rounded-full flex items-center justify-center">
                      <MessageCircle className="h-5 w-5 text-pink-500" />
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-900">
                        New message
                      </p>
                      <p className="text-xs text-gray-500">
                        Sofia wants to chat!
                      </p>
                    </div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6 bg-gray-50">
        <div className="max-w-6xl mx-auto">
          <div className="text-center mb-8 sm:mb-16">
            <h2 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-4">
              How HeartMap Works
            </h2>
            <p className="text-base sm:text-lg text-gray-600 max-w-2xl mx-auto">
              Three simple steps to share your love with the world
            </p>
          </div>

          <div className="grid sm:grid-cols-2 md:grid-cols-3 gap-4 sm:gap-8">
            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-14 h-14 bg-rose-100 rounded-2xl flex items-center justify-center mb-6">
                <MapPin className="h-7 w-7 text-rose-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                1. Drop Your Pin
              </h3>
              <p className="text-gray-600">
                Share your location on the global love map. Let others know
                where your heart is.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow">
              <div className="w-12 sm:w-14 h-12 sm:h-14 bg-pink-100 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <Music className="h-6 sm:h-7 w-6 sm:w-7 text-pink-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                2. Share Your Song
              </h3>
              <p className="text-gray-600">
                Attach your favorite love song. Music connects hearts across any
                distance.
              </p>
            </div>

            <div className="bg-white rounded-2xl p-6 sm:p-8 shadow-sm border border-gray-100 hover:shadow-lg transition-shadow sm:col-span-2 md:col-span-1">
              <div className="w-12 sm:w-14 h-12 sm:h-14 bg-red-100 rounded-2xl flex items-center justify-center mb-4 sm:mb-6">
                <MessageCircle className="h-6 sm:h-7 w-6 sm:w-7 text-red-500" />
              </div>
              <h3 className="text-xl font-semibold text-gray-900 mb-3">
                3. Connect & Chat
              </h3>
              <p className="text-gray-600">
                Start conversations with other hearts. Build meaningful
                connections worldwide.
              </p>
            </div>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-12 sm:py-20 px-4 sm:px-6">
        <div className="max-w-4xl mx-auto text-center">
          <Heart
            className="h-12 sm:h-16 w-12 sm:w-16 text-rose-500 mx-auto mb-4 sm:mb-6"
            fill="currentColor"
          />
          <h2 className="text-2xl sm:text-4xl font-bold text-gray-900 mb-4">
            Ready to share your love?
          </h2>
          <p className="text-base sm:text-xl text-gray-600 mb-6 sm:mb-8">
            Join thousands of hearts celebrating Valentine&apos;s 2026
          </p>
          <Button
            size="lg"
            onClick={handleLogin}
            disabled={loading}
            className="bg-rose-500 hover:bg-rose-600 text-white px-10 py-6 text-lg rounded-xl shadow-lg shadow-rose-500/25"
          >
            {loading ? (
              <Loader2 className="h-5 w-5 animate-spin" />
            ) : (
              "Start Your Journey"
            )}
          </Button>
        </div>
      </section>

      {/* Footer */}
      <footer className="py-6 sm:py-8 px-4 sm:px-6 border-t border-gray-100">
        <div className="max-w-6xl mx-auto flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="flex items-center gap-2">
            <Heart className="h-5 w-5 text-rose-500" fill="currentColor" />
            <span className="font-semibold text-gray-900">HeartMap</span>
          </div>
          <p className="text-sm text-gray-500">
            © 2026 HeartMap. Made with love for Valentine&apos;s Day.
          </p>
        </div>
      </footer>
    </div>
  );
}
