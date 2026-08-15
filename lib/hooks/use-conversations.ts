"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface Conversation {
  id: string;
  title: string;
  created_at: string;
  updated_at: string;
}

export function useConversations() {
  const [conversations, setConversations] = useState<Conversation[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchConversations = useCallback(async () => {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      setLoading(false);
      return;
    }

    const res = await fetch("/api/ai/conversations", {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (res.ok) {
      setConversations(await res.json());
    }
    setLoading(false);
  }, []);

  useEffect(() => {
    fetchConversations();
  }, [fetchConversations]);

  async function createConversation(): Promise<Conversation | null> {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return null;

    const res = await fetch("/api/ai/conversations", {
      method: "POST",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (!res.ok) return null;
    const newConv = await res.json();
    setConversations((prev) => [newConv, ...prev]);
    return newConv;
  }

  async function renameConversation(id: string, title: string) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    await fetch(`/api/ai/conversations/${id}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ title }),
    });
    setConversations((prev) =>
      prev.map((c) => (c.id === id ? { ...c, title } : c))
    );
  }

  async function deleteConversation(id: string) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    await fetch(`/api/ai/conversations/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${session.access_token}` },
    });
    setConversations((prev) => prev.filter((c) => c.id !== id));
  }

  return {
    conversations,
    loading,
    refetch: fetchConversations,
    createConversation,
    renameConversation,
    deleteConversation,
  };
}