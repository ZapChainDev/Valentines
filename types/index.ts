// User type stored in Firestore
export interface User {
  userId: string;
  nickname: string;
  createdAt: Date;
}

// Pin type for map markers
export interface Pin {
  id?: string;
  userId: string;
  nickname: string;
  status: string;
  youtubeId: string;
  lat: number;
  lng: number;
  createdAt: Date;
}

// Chat between two users
export interface Chat {
  chatId: string;
  participants: [string, string];
  status: "pending" | "accepted" | "rejected";
  requestedBy: string; // userId who sent the request
  createdAt: Date;
}

// Message in a chat
export interface Message {
  id?: string;
  senderId: string;
  text: string;
  createdAt: Date;
}

// Auth context type
export interface AuthContextType {
  user: User | null;
  loading: boolean;
  signInWithGoogle: () => Promise<void>;
  signOut: () => Promise<void>;
}

// Map context type
export interface MapContextType {
  selectedPin: Pin | null;
  setSelectedPin: (pin: Pin | null) => void;
  userLocation: { lat: number; lng: number } | null;
  setUserLocation: (location: { lat: number; lng: number } | null) => void;
}
