"use client";

import { useState, useEffect } from "react";
import {
  collection,
  query,
  onSnapshot,
  orderBy,
  addDoc,
  serverTimestamp,
  where,
  getDocs,
  limit,
  updateDoc,
  doc,
} from "firebase/firestore";
import { db } from "@/lib/firebase/config";
import { generateChatId, checkRateLimit } from "@/lib/utils";
import type { Message, Chat } from "@/types";

export function useChat(userId1: string, userId2: string) {
  const [messages, setMessages] = useState<Message[]>([]);
  const [chatId, setChatId] = useState<string | null>(null);
  const [chatDocId, setChatDocId] = useState<string | null>(null);
  const [chatStatus, setChatStatus] = useState<
    "pending" | "accepted" | "rejected" | null
  >(null);
  const [requestedBy, setRequestedBy] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  // Initialize or get existing chat
  useEffect(() => {
    if (!db) {
      setLoading(false);
      return;
    }

    const database = db;

    const initChat = async () => {
      const generatedChatId = generateChatId(userId1, userId2);
      setChatId(generatedChatId);

      // Check if chat exists
      const chatsRef = collection(database, "chats");
      const q = query(
        chatsRef,
        where("chatId", "==", generatedChatId),
        limit(1),
      );
      const snapshot = await getDocs(q);

      if (!snapshot.empty) {
        // Chat exists, get its status
        const chatDoc = snapshot.docs[0];
        const chatData = chatDoc.data() as Chat;
        setChatDocId(chatDoc.id);
        setChatStatus(chatData.status || "pending");
        setRequestedBy(chatData.requestedBy || "");
      } else {
        // No chat exists yet
        setChatStatus(null);
      }

      setLoading(false);
    };

    if (userId1 && userId2) {
      initChat();
    }
  }, [userId1, userId2]);

  // Subscribe to messages (only if chat is accepted)
  useEffect(() => {
    if (!chatId || !db || chatStatus !== "accepted") return;

    const database = db;
    const messagesRef = collection(database, "chats", chatId, "messages");
    const q = query(messagesRef, orderBy("createdAt", "asc"));

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const messagesData: Message[] = [];
        snapshot.forEach((doc) => {
          const data = doc.data();
          messagesData.push({
            id: doc.id,
            senderId: data.senderId,
            text: data.text,
            createdAt: data.createdAt?.toDate() || new Date(),
          });
        });
        setMessages(messagesData);
      },
      (err) => {
        console.error("Error fetching messages:", err);
        setError("Failed to load messages");
      },
    );

    return () => unsubscribe();
  }, [chatId, chatStatus]);

  const sendChatRequest = async (requesterId: string) => {
    if (!chatId || !db) return;

    const database = db;
    const chatsRef = collection(database, "chats");

    // Create chat with pending status
    const docRef = await addDoc(chatsRef, {
      chatId,
      participants: [userId1, userId2],
      status: "pending",
      requestedBy: requesterId,
      createdAt: serverTimestamp(),
    });

    setChatDocId(docRef.id);
    setChatStatus("pending");
    setRequestedBy(requesterId);
  };

  const acceptChatRequest = async () => {
    if (!chatDocId || !db) return;

    const database = db;
    const chatRef = doc(database, "chats", chatDocId);

    await updateDoc(chatRef, {
      status: "accepted",
    });

    setChatStatus("accepted");
  };

  const rejectChatRequest = async () => {
    if (!chatDocId || !db) return;

    const database = db;
    const chatRef = doc(database, "chats", chatDocId);

    await updateDoc(chatRef, {
      status: "rejected",
    });

    setChatStatus("rejected");
  };

  const sendMessage = async (senderId: string, text: string) => {
    if (!chatId || !text.trim() || !db || chatStatus !== "accepted") return;

    const database = db;

    // Rate limiting
    if (!checkRateLimit(senderId)) {
      throw new Error("Too many messages. Please wait a moment.");
    }

    const messagesRef = collection(database, "chats", chatId, "messages");
    await addDoc(messagesRef, {
      senderId,
      text: text.trim(),
      createdAt: serverTimestamp(),
    });
  };

  return {
    messages,
    loading,
    error,
    chatStatus,
    requestedBy,
    sendChatRequest,
    acceptChatRequest,
    rejectChatRequest,
    sendMessage,
    chatId,
  };
}
