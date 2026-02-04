"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  where,
  onSnapshot,
  getDocs,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Chat } from "@/types";

interface ChatRequestWithUser extends Chat {
  otherUserId: string;
  otherUserNickname: string;
}

export function useChatRequests(userId: string) {
  const [requests, setRequests] = useState<ChatRequestWithUser[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !db) {
      setLoading(false);
      return;
    }

    const database = db;
    const chatsRef = collection(database, "chats");

    // Query for chats where user is a participant and status is pending and they didn't request it
    const q = query(
      chatsRef,
      where("participants", "array-contains", userId),
      where("status", "==", "pending"),
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const requestsData: ChatRequestWithUser[] = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data() as Chat;

        // Only include requests sent TO this user (not BY this user)
        if (data.requestedBy !== userId) {
          const otherUserId =
            data.participants.find((id) => id !== userId) || "";

          // Get the other user's nickname
          const userRef = collection(database, "users");
          const userQuery = query(userRef, where("userId", "==", otherUserId));
          const userSnap = await getDocs(userQuery);

          let otherUserNickname = "Someone";
          if (!userSnap.empty) {
            otherUserNickname = userSnap.docs[0].data().nickname || "Someone";
          }

          requestsData.push({
            ...data,
            otherUserId,
            otherUserNickname,
          });
        }
      }

      setRequests(requestsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { requests, loading };
}
