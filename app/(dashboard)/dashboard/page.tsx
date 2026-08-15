"use client";

import Link from "next/link";
import { FileText, PlusCircle, Loader2 } from "lucide-react";
import { useNotes } from "@/lib/hooks/use-notes";
import { NoteCard } from "@/components/shared/note-card";

export default function DashboardPage() {
  const { notes, loading, setNotes } = useNotes();

  function handleDeleted(id: string) {
    setNotes((prev) => prev.filter((n) => n.id !== id));
  }

  function handleRenamed(id: string, newTitle: string) {
    setNotes((prev) =>
      prev.map((n) => (n.id === id ? { ...n, title: newTitle } : n))
    );
  }

  return (
    <div>
      <div className="mb-8 flex items-center justify-between">
        <div>
          <h1 className="text-2xl font-medium tracking-tight text-foreground">
            Your notes
          </h1>
          <p className="mt-1 text-sm text-muted-foreground">
            {loading
              ? "Loading..."
              : `${notes.length} note${notes.length === 1 ? "" : "s"}`}
          </p>
        </div>
        <Link
          href="/notes/new"
          className="flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
        >
          <PlusCircle className="h-4 w-4" />
          New note
        </Link>
      </div>

      {loading ? (
        <div className="flex items-center justify-center py-24">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : notes.length === 0 ? (
        <div className="flex flex-col items-center justify-center rounded-2xl border border-dashed border-border py-24 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft">
            <FileText className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-foreground">No notes yet</h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Start writing your first note — Synapse will help you connect it
            to everything else you write.
          </p>
          <Link
            href="/notes/new"
            className="mt-6 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90"
          >
            <PlusCircle className="h-4 w-4" />
            Create your first note
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {notes.map((note) => (
            <NoteCard
              key={note.id}
              note={note}
              onDeleted={handleDeleted}
              onRenamed={handleRenamed}
            />
          ))}
        </div>
      )}
    </div>
  );
}