"use client";

import { useState, useRef } from "react";
import Link from "next/link";
import { MoreVertical, Pencil, Trash2, Loader2 } from "lucide-react";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";
import type { Note } from "@/lib/hooks/use-notes";

function formatDate(dateStr: string) {
  return new Date(dateStr).toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
    year: "numeric",
  });
}

function extractPlainText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { text?: string; content?: unknown[] };
  let text = n.text ? n.text : "";
  if (Array.isArray(n.content)) {
    for (const child of n.content) {
      text += extractPlainText(child) + " ";
    }
  }
  return text;
}

function getPreviewText(content: unknown): string {
  const text = extractPlainText(content).replace(/\s+/g, " ").trim();
  return text.slice(0, 100) || "No content yet";
}
interface NoteCardProps {
  note: Note;
  onDeleted: (id: string) => void;
  onRenamed: (id: string, newTitle: string) => void;
}

export function NoteCard({ note, onDeleted, onRenamed }: NoteCardProps) {
  const [isRenaming, setIsRenaming] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  const [showDeleteDialog, setShowDeleteDialog] = useState(false);
  const [titleValue, setTitleValue] = useState(note.title);
  const inputRef = useRef<HTMLInputElement>(null);

  async function getAuthHeader() {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    return session ? { Authorization: `Bearer ${session.access_token}` } : null;
  }

  async function handleRenameSubmit() {
    setIsRenaming(false);
    const trimmed = titleValue.trim();

    if (!trimmed || trimmed === note.title) {
      setTitleValue(note.title);
      return;
    }

    const authHeader = await getAuthHeader();
    if (!authHeader) return;

    const res = await fetch(`/api/notes/${note.id}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json", ...authHeader },
      body: JSON.stringify({ title: trimmed }),
    });

    if (res.ok) {
      onRenamed(note.id, trimmed);
      toast.success("Note renamed");
    } else {
      setTitleValue(note.title);
      toast.error("Couldn't rename note");
    }
  }

  async function handleDelete() {
    setIsDeleting(true);
    const authHeader = await getAuthHeader();
    if (!authHeader) {
      setIsDeleting(false);
      return;
    }

    const res = await fetch(`/api/notes/${note.id}`, {
      method: "DELETE",
      headers: authHeader,
    });

    if (res.ok) {
      onDeleted(note.id);
      toast.success("Note deleted");
    } else {
      setIsDeleting(false);
      toast.error("Couldn't delete note");
    }
  }

  return (
    <div className="group relative flex flex-col rounded-xl border border-border bg-card p-4 transition-colors hover:border-primary/40">
      <div className="flex items-start justify-between gap-2">
        {isRenaming ? (
          <input
            ref={inputRef}
            value={titleValue}
            onChange={(e) => setTitleValue(e.target.value)}
            onBlur={handleRenameSubmit}
            onKeyDown={(e) => {
              if (e.key === "Enter") inputRef.current?.blur();
              if (e.key === "Escape") {
                setTitleValue(note.title);
                setIsRenaming(false);
              }
            }}
            autoFocus
            onClick={(e) => e.preventDefault()}
            className="w-full rounded border border-primary/40 bg-background px-1.5 py-0.5 text-sm font-medium text-foreground outline-none"
          />
        ) : (
          <Link href={`/notes/${note.id}`} className="min-w-0 flex-1">
            <h3 className="line-clamp-1 font-medium text-foreground group-hover:text-primary">
              {titleValue}
            </h3>
          </Link>
        )}

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <button
              onClick={(e) => e.preventDefault()}
              className="shrink-0 rounded-md p-1 text-muted-foreground opacity-0 transition-opacity hover:bg-accent-soft hover:text-foreground group-hover:opacity-100"
            >
              {isDeleting ? (
                <Loader2 className="h-4 w-4 animate-spin" />
              ) : (
                <MoreVertical className="h-4 w-4" />
              )}
            </button>
          </DropdownMenuTrigger>
          <DropdownMenuContent
  align="end"
  onCloseAutoFocus={(e) => e.preventDefault()}
>
            <DropdownMenuItem
              onSelect={() => {
                setTimeout(() => {
                  setIsRenaming(true);
                  setTimeout(() => inputRef.current?.focus(), 50);
                }, 0);
              }}
            >
              <Pencil className="mr-2 h-4 w-4" />
              Rename
            </DropdownMenuItem>
            <DropdownMenuItem
              onSelect={() => setShowDeleteDialog(true)}
              className="text-destructive"
            >
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>

      <Link href={`/notes/${note.id}`}>
        <p className="mt-2 line-clamp-2 text-sm text-muted-foreground">
          {getPreviewText(note.content)}
        </p>
        <p className="mt-3 text-xs text-muted-foreground">
          {formatDate(note.updated_at)}
        </p>
      </Link>

      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete &quot;{note.title}&quot;?</AlertDialogTitle>
            <AlertDialogDescription>
              This can&apos;t be undone. The note will be permanently deleted.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleDelete}
              className="bg-destructive text-white hover:bg-destructive/90"
            >
              Delete
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
}