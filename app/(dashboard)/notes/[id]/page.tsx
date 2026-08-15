"use client";

import Link from "next/link";
import { useParams } from "next/navigation";
import { Loader2, FileX } from "lucide-react";
import { useNote } from "@/lib/hooks/use-note";
import { NoteEditor } from "@/components/shared/note-editor";

export default function NotePage() {
  const params = useParams<{ id: string }>();
  const { note, loading, notFound } = useNote(params.id);

  if (loading) {
    return (
      <div className="flex min-h-[60vh] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  if (notFound || !note) {
    return (
      <div className="flex min-h-[60vh] flex-col items-center justify-center text-center">
        <FileX className="h-8 w-8 text-muted-foreground" />
        <h2 className="mt-4 text-lg font-medium text-foreground">
          Note not found
        </h2>
        <p className="mt-1 text-sm text-muted-foreground">
          It may have been deleted, or the link is incorrect.
        </p>
        <Link
          href="/dashboard"
          className="mt-6 text-sm text-primary hover:underline"
        >
          Back to notes
        </Link>
      </div>
    );
  }

  return <NoteEditor note={note} />;
}