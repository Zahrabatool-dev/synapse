"use client";

import { useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";

export interface Flashcard {
  id: string;
  note_id: string;
  question: string;
  answer: string;
  created_at: string;
}

export function useFlashcards() {
  const [flashcards, setFlashcards] = useState<Flashcard[]>([]);
  const [loading, setLoading] = useState(false);
  const [generating, setGenerating] = useState(false);

  const fetchFlashcards = useCallback(async (noteId: string) => {
    setLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      setLoading(false);
      return;
    }

    const res = await fetch(`/api/ai/flashcards?noteId=${noteId}`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (res.ok) {
      setFlashcards(await res.json());
    }
    setLoading(false);
  }, []);

  const generateFlashcards = useCallback(async (noteId: string) => {
    setGenerating(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      setGenerating(false);
      return { error: "Not logged in" };
    }

    const res = await fetch("/api/ai/flashcards", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({ noteId }),
    });

    setGenerating(false);

    if (!res.ok) {
      const data = await res.json().catch(() => ({}));
      return { error: data.error || "Failed to generate flashcards" };
    }

    const newCards = await res.json();
    setFlashcards(newCards);
    return { error: null };
  }, []);

  return { flashcards, loading, generating, fetchFlashcards, generateFlashcards, setFlashcards };
}