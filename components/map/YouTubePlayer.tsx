"use client";

import { useState, useEffect } from "react";

interface YouTubePlayerProps {
  videoId: string;
}

export function YouTubePlayer({ videoId }: YouTubePlayerProps) {
  const [isPlaying, setIsPlaying] = useState(false);

  // Stop playing when video ID changes
  useEffect(() => {
    setIsPlaying(true);
  }, [videoId]);

  if (!videoId) return null;

  return (
    <div className="relative w-full aspect-video rounded-lg overflow-hidden bg-gray-100">
      {isPlaying ? (
        <iframe
          src={`https://www.youtube.com/embed/${videoId}?autoplay=1&rel=0`}
          title="YouTube video player"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
          allowFullScreen
          className="absolute inset-0 w-full h-full"
        />
      ) : (
        <button
          onClick={() => setIsPlaying(true)}
          className="absolute inset-0 w-full h-full flex items-center justify-center bg-gradient-to-br from-rose-100 to-pink-100 hover:from-rose-200 hover:to-pink-200 transition-colors"
        >
          <div className="flex flex-col items-center gap-2">
            <div className="w-16 h-16 rounded-full bg-gradient-to-r from-rose-500 to-pink-500 flex items-center justify-center shadow-lg">
              <svg
                className="w-6 h-6 text-white ml-1"
                fill="currentColor"
                viewBox="0 0 24 24"
              >
                <path d="M8 5v14l11-7z" />
              </svg>
            </div>
            <span className="text-sm text-rose-600 font-medium">Play Song</span>
          </div>
        </button>
      )}
    </div>
  );
}
