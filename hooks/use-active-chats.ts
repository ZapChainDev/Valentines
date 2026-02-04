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
import type { User } from "@/types";

interface ActiveChat {
  chatId: string;
  otherUser: User;
}

export function useActiveChats(userId: string) {
  const [chats, setChats] = useState<ActiveChat[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!userId || !db) {
      setLoading(false);
      return;
    }

    const database = db;
    const chatsRef = collection(database, "chats");

    // Query for accepted chats where user is a participant
    const q = query(
      chatsRef,
      where("participants", "array-contains", userId),
      where("status", "==", "accepted"),
    );

    const unsubscribe = onSnapshot(q, async (snapshot) => {
      const chatsData: ActiveChat[] = [];

      for (const docSnap of snapshot.docs) {
        const data = docSnap.data();
        const otherUserId =
          data.participants.find((id: string) => id !== userId) || "";

        // Get the other user's info
        const userRef = collection(database, "users");
        const userQuery = query(userRef, where("userId", "==", otherUserId));
        const userSnap = await getDocs(userQuery);

        if (!userSnap.empty) {
          const userData = userSnap.docs[0].data();
          chatsData.push({
            chatId: data.chatId,
            otherUser: {
              userId: otherUserId,
              nickname: userData.nickname || "Unknown",
              createdAt: userData.createdAt?.toDate() || new Date(),
            },
          });
        }
      }

      setChats(chatsData);
      setLoading(false);
    });

    return () => unsubscribe();
  }, [userId]);

  return { chats, loading };
}
