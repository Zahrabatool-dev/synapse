"use client";

import { useEffect, useState, useCallback } from "react";
import { supabase } from "@/lib/supabase";
import type { Note } from "@/lib/hooks/use-notes";

export function useNote(id: string) {
  const [note, setNote] = useState<Note | null>(null);
  const [loading, setLoading] = useState(true);
  const [notFound, setNotFound] = useState(false);

  const fetchNote = useCallback(async () => {
    setLoading(true);
    const {
      data: { session },
    } = await supabase.auth.getSession();

    if (!session) {
      setLoading(false);
      return;
    }

    const res = await fetch(`/api/notes/${id}`, {
      headers: { Authorization: `Bearer ${session.access_token}` },
    });

    if (res.status === 404) {
      setNotFound(true);
      setLoading(false);
      return;
    }

    if (res.ok) {
      const data = await res.json();
      setNote(data);
    }
    setLoading(false);
  }, [id]);

  useEffect(() => {
    fetchNote();
  }, [fetchNote]);

  return { note, loading, notFound, refetch: fetchNote };
}