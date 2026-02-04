"use client";

import { useState, useEffect } from "react";
import { collection, query, onSnapshot, orderBy } from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import type { Pin } from "@/types";

export function usePins() {
  const [pins, setPins] = useState<Pin[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    const database = db;
    const pinsRef = collection(database, "pins");
    const q = query(pinsRef, orderBy("createdAt", "desc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const pinsData: Pin[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          pinsData.push({
            id: doc.id,
            userId: data.userId,
            nickname: data.nickname,
            status: data.status,
            youtubeId: data.youtubeId,
            lat: data.lat,
            lng: data.lng,
            createdAt: data.createdAt?.toDate() || new Date(),
          });
        });
        setPins(pinsData);
        setLoading(false);
      },
      (err) => {
        console.error("Error fetching pins:", err);
        setError("Failed to load pins");
        setLoading(false);
      },
    );

    return () => unsubscribe();
  }, []);

  return { pins, loading, error };
}
