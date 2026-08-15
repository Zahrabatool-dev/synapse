"use client";

import { useState, useCallback, useEffect } from "react";
import { supabase } from "@/lib/supabase";

export interface ChatMessage {
  role: "user" | "model";
  text: string;
  sources?: { id: string; title: string }[];
}

export function useChat(conversationId: string | null) {
  const [messages, setMessages] = useState<ChatMessage[]>([]);
  const [isThinking, setIsThinking] = useState(false);
  const [isLoadingHistory, setIsLoadingHistory] = useState(true);

  useEffect(() => {
    if (!conversationId) {
      setMessages([]);
      setIsLoadingHistory(false);
      return;
    }

    async function loadHistory() {
      setIsLoadingHistory(true);
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) {
        setIsLoadingHistory(false);
        return;
      }

      const res = await fetch(`/api/ai/conversations/${conversationId}`, {
        headers: { Authorization: `Bearer ${session.access_token}` },
      });

      if (res.ok) {
        const data = await res.json();
        setMessages(
          data.map((row: { role: "user" | "model"; content: string; sources?: ChatMessage["sources"] }) => ({
            role: row.role,
            text: row.content,
            sources: row.sources ?? undefined,
          }))
        );
      }
      setIsLoadingHistory(false);
    }
    loadHistory();
  }, [conversationId]);

  const sendMessage = useCallback(
    async (text: string) => {
      if (!conversationId) return;

      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      const userMessage: ChatMessage = { role: "user", text };
      setMessages((prev) => [...prev, userMessage]);
      setIsThinking(true);

      try {
        const res = await fetch("/api/ai/chat", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            Authorization: `Bearer ${session.access_token}`,
          },
          body: JSON.stringify({
            message: text,
            history: messages.map((m) => ({ role: m.role, text: m.text })),
            conversationId,
          }),
        });

        if (!res.ok) throw new Error("Chat request failed");
        const data = await res.json();

        setMessages((prev) => [
          ...prev,
          { role: "model", text: data.reply, sources: data.sources },
        ]);
      } catch {
        setMessages((prev) => [
          ...prev,
          { role: "model", text: "Sorry, something went wrong. Please try again." },
        ]);
      } finally {
        setIsThinking(false);
      }
    },
    [messages, conversationId]
  );

  return { messages, isThinking, isLoadingHistory, sendMessage };
}