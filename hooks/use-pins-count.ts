"use client";

import { useState, useEffect } from "react";
import { collection, getCountFromServer } from "firebase/firestore";
import { db } from "@/lib/firebase/config";

export function usePinsCount() {
  const [count, setCount] = useState<number>(0);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    const fetchCount = async () => {
      try {
        if (!db) return;
        const pinsRef = collection(db, "pins");
        const snapshot = await getCountFromServer(pinsRef);
        setCount(snapshot.data().count);
      } catch (err) {
        console.error("Error fetching pins count:", err);
        // Fallback to 0 if error
        setCount(0);
      } finally {
        setLoading(false);
      }
    };

    fetchCount();
  }, []);

  return { count, loading };
}
