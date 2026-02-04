import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}

// Extract YouTube video ID from various URL formats
export function extractYoutubeId(url: string): string | null {
  const patterns = [
    /(?:youtube\.com\/watch\?v=|youtu\.be\/|youtube\.com\/embed\/)([^&\n?#]+)/,
    /^([a-zA-Z0-9_-]{11})$/,
  ];

  for (const pattern of patterns) {
    const match = url.match(pattern);
    if (match) {
      return match[1];
    }
  }
  return null;
}

// Format timestamp to readable string
export function formatTimestamp(date: Date): string {
  const now = new Date();
  const diff = now.getTime() - date.getTime();
  const minutes = Math.floor(diff / 60000);
  const hours = Math.floor(diff / 3600000);
  const days = Math.floor(diff / 86400000);

  if (minutes < 1) return "Just now";
  if (minutes < 60) return `${minutes}m ago`;
  if (hours < 24) return `${hours}h ago`;
  if (days < 7) return `${days}d ago`;

  return date.toLocaleDateString();
}

// Generate a unique chat ID from two user IDs
export function generateChatId(userId1: string, userId2: string): string {
  return [userId1, userId2].sort().join("_");
}

// Rate limiting helper
const messageTimes: Map<string, number[]> = new Map();
const RATE_LIMIT_WINDOW = 60000; // 1 minute
const MAX_MESSAGES = 20; // max messages per window

export function checkRateLimit(userId: string): boolean {
  const now = Date.now();
  const userTimes = messageTimes.get(userId) || [];

  // Filter out old timestamps
  const recentTimes = userTimes.filter(
    (time) => now - time < RATE_LIMIT_WINDOW,
  );

  if (recentTimes.length >= MAX_MESSAGES) {
    return false;
  }

  recentTimes.push(now);
  messageTimes.set(userId, recentTimes);
  return true;
}
