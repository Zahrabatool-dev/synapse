"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import { Search as SearchIcon, FileText, Loader2 } from "lucide-react";
import { useNotes } from "@/lib/hooks/use-notes";
import { extractPlainText, getPreviewText } from "@/lib/note-text";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

export default function SearchPage() {
  const { notes, loading } = useNotes();
  const [query, setQuery] = useState("");

  const results = useMemo(() => {
    const q = query.trim().toLowerCase();
    if (!q) return [];
    return notes.filter((note) => {
      const haystack =
        note.title.toLowerCase() +
        " " +
        extractPlainText(note.content).toLowerCase();
      return haystack.includes(q);
    });
  }, [notes, query]);

  return (
    <div className="mx-auto max-w-2xl">
      <h1 className="text-2xl font-medium tracking-tight text-foreground">
        Search
      </h1>
      <p className="mt-1 text-sm text-muted-foreground">
        Search across all your notes
      </p>

      <div className="mt-6 flex items-center gap-2.5 rounded-xl border border-border bg-card px-4 py-3 focus-within:border-primary/40">
        <SearchIcon className="h-4 w-4 text-muted-foreground" />
        <input
          autoFocus
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search by title or content..."
          className="flex-1 bg-transparent text-sm text-foreground outline-none placeholder:text-muted-foreground"
        />
      </div>

      <div className="mt-6">
        {loading ? (
          <div className="flex justify-center py-12">
            <Loader2 className="h-5 w-5 animate-spin text-primary" />
          </div>
        ) : query.trim() === "" ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            Start typing to search your notes
          </p>
        ) : results.length === 0 ? (
          <p className="py-12 text-center text-sm text-muted-foreground">
            No notes found for &quot;{query}&quot;
          </p>
        ) : (
          <div className="space-y-2">
            {results.map((note) => (
              <Link
                key={note.id}
                href={`/notes/${note.id}`}
                className="flex items-start gap-3 rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40"
              >
                <div className="mt-0.5 flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-accent-soft">
                  <FileText className="h-4 w-4 text-primary" />
                </div>
                <div className="min-w-0 flex-1">
                  <h3 className="line-clamp-1 text-sm font-medium text-foreground">
                    {note.title}
                  </h3>
                  <p className="mt-0.5 line-clamp-1 text-xs text-muted-foreground">
                    {getPreviewText(note.content)}
                  </p>
                </div>
                <span className="shrink-0 text-xs text-muted-foreground">
                  {formatDate(note.updated_at)}
                </span>
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}