"use client";

import { useState } from "react";
import { GraduationCap, Sparkles, Loader2, FileText, ChevronLeft } from "lucide-react";
import { useNotes } from "@/lib/hooks/use-notes";
import { useFlashcards } from "@/lib/hooks/use-flashcards";
import { StudySession } from "@/components/shared/study-session";
import { toast } from "sonner";

type ViewState = "picker" | "loading-cards" | "empty-cards" | "session";

export default function StudyPage() {
  const { notes, loading: notesLoading } = useNotes();
  const {
    flashcards,
    generating,
    fetchFlashcards,
    generateFlashcards,
    setFlashcards,
  } = useFlashcards();
  const [selectedNoteId, setSelectedNoteId] = useState<string | null>(null);
  const [view, setView] = useState<ViewState>("picker");

  async function handleSelectNote(noteId: string) {
    setSelectedNoteId(noteId);
    setView("loading-cards");
    await fetchFlashcards(noteId);
    setView("empty-cards");
  }

  async function handleGenerate() {
    if (!selectedNoteId) return;
    const { error } = await generateFlashcards(selectedNoteId);
    if (error) {
      toast.error(error);
      return;
    }
    setView("session");
  }

  function handleBack() {
    setSelectedNoteId(null);
    setFlashcards([]);
    setView("picker");
  }

  const selectedNote = notes.find((n) => n.id === selectedNoteId);

  // Jab flashcards fetch complete hon aur cards mil jayein, seedha session mein jump karo
  if (view === "empty-cards" && flashcards.length > 0) {
    setView("session");
  }

  if (view === "session" && flashcards.length > 0) {
    return (
      <div>
        <button
          onClick={handleBack}
          className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Choose a different note
        </button>
        <h1 className="mb-6 text-center text-lg font-medium text-foreground">
          {selectedNote?.title}
        </h1>
        <StudySession
          key={selectedNoteId}
          cards={flashcards}
          onRestart={() => setView("session")}
        />
      </div>
    );
  }

  if (view === "loading-cards") {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (view === "empty-cards" && selectedNote) {
    return (
      <div className="mx-auto max-w-md">
        <button
          onClick={handleBack}
          className="mb-6 flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ChevronLeft className="h-4 w-4" />
          Choose a different note
        </button>

        <div className="flex flex-col items-center rounded-2xl border border-dashed border-border py-16 text-center">
          <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft">
            <Sparkles className="h-6 w-6 text-primary" />
          </div>
          <h3 className="text-lg font-medium text-foreground">
            No flashcards yet
          </h3>
          <p className="mt-1 max-w-xs text-sm text-muted-foreground">
            Generate flashcards from &quot;{selectedNote.title}&quot; using AI
          </p>
          <button
            onClick={handleGenerate}
            disabled={generating}
            className="mt-6 flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-60"
          >
            {generating ? (
              <>
                <Loader2 className="h-4 w-4 animate-spin" />
                Generating...
              </>
            ) : (
              <>
                <Sparkles className="h-4 w-4" />
                Generate Flashcards
              </>
            )}
          </button>
        </div>
      </div>
    );
  }

  // Default: note picker
  return (
    <div>
      <div className="mb-8 text-center">
        <div className="mx-auto mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft">
          <GraduationCap className="h-6 w-6 text-primary" />
        </div>
        <h1 className="text-2xl font-medium tracking-tight text-foreground">
          Study Mode
        </h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Pick a note to turn into flashcards
        </p>
      </div>

      {notesLoading ? (
        <div className="flex justify-center py-12">
          <Loader2 className="h-6 w-6 animate-spin text-primary" />
        </div>
      ) : notes.length === 0 ? (
        <p className="text-center text-sm text-muted-foreground">
          You don&apos;t have any notes yet.
        </p>
      ) : (
        <div className="mx-auto grid max-w-2xl grid-cols-1 gap-3 sm:grid-cols-2">
          {notes.map((note) => (
            <button
              key={note.id}
              onClick={() => handleSelectNote(note.id)}
              className="flex items-center gap-3 rounded-xl border border-border bg-card p-4 text-left transition-colors hover:border-primary/40"
            >
              <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-accent-soft">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <span className="line-clamp-1 text-sm font-medium text-foreground">
                {note.title}
              </span>
            </button>
          ))}
        </div>
      )}
    </div>
  );
}