"use client";

import { useEffect, useRef, useState, useCallback } from "react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useEditor, EditorContent } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import Placeholder from "@tiptap/extension-placeholder";
import { ArrowLeft, Check, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";
import { useNotes, type Note } from "@/lib/hooks/use-notes";
import { BubbleToolbar } from "@/components/editor/bubble-toolbar";
import { SlashCommand } from "@/components/editor/slash-command";
import TaskList from "@tiptap/extension-task-list";
import TaskItem from "@tiptap/extension-task-item";
import CodeBlockLowlight from "@tiptap/extension-code-block-lowlight";
import { ReactNodeViewRenderer } from "@tiptap/react";
import { CodeBlockView } from "@/components/editor/code-block";
import { createLowlight, common } from "lowlight";
import { VoiceButton } from "@/components/editor/voice-button";
import { ImageUploadButton } from "@/components/editor/image-upload-button";
import { SecureImage } from "@/components/editor/secure-image-extension";
import { NoteLinkMark, NoteLinkSuggestion } from "@/components/editor/note-link-extension";

const lowlight = createLowlight(common);
type SaveStatus = "idle" | "saving" | "saved";

export function NoteEditor({ note }: { note: Note }) {
  const router = useRouter();
  const { notes } = useNotes();
  const [title, setTitle] = useState(note.title);
  const [saveStatus, setSaveStatus] = useState<SaveStatus>("idle");
  const saveTimeout = useRef<ReturnType<typeof setTimeout> | null>(null);
  const skipFirstTitleSave = useRef(true);
  const notesRef = useRef(notes);
  notesRef.current = notes;

  async function createLink(targetNoteId: string) {
    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) return;

    await fetch("/api/notes/links", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${session.access_token}`,
      },
      body: JSON.stringify({
        sourceNoteId: note.id,
        targetNoteId,
      }),
    });
  }

  const editor = useEditor({
    extensions: [
      StarterKit.configure({
        codeBlock: false,
      }),
      Placeholder.configure({ placeholder: "Start writing, or type '/' for commands, '[[' to link notes..." }),
      TaskList,
      TaskItem.configure({ nested: true }),
      SlashCommand,
      CodeBlockLowlight.extend({
        addNodeView() {
          return ReactNodeViewRenderer(CodeBlockView);
        },
      }).configure({ lowlight }),
      SecureImage,
      NoteLinkMark,
      NoteLinkSuggestion.configure({
        getNotes: () =>
          notesRef.current
            .filter((n) => n.id !== note.id)
            .map((n) => ({ id: n.id, title: n.title })),
        onLinkCreated: (targetNoteId: string) => {
          createLink(targetNoteId);
        },
      }),
    ],
    content: (note.content as object) ?? "",
    editorProps: {
      attributes: {
        class: "tiptap min-h-[60vh] text-foreground",
      },
      handleClick: (view, pos, event) => {
        const target = event.target as HTMLElement;
        const linkEl = target.closest("[data-note-id]");
        if (linkEl) {
          const noteId = linkEl.getAttribute("data-note-id");
          if (noteId) {
            router.push(`/notes/${noteId}`);
            return true;
          }
        }
        return false;
      },
    },
    immediatelyRender: false,
  });

  const saveNote = useCallback(
    async (payload: { title?: string; content?: unknown }) => {
      const {
        data: { session },
      } = await supabase.auth.getSession();
      if (!session) return;

      setSaveStatus("saving");
      await fetch(`/api/notes/${note.id}`, {
        method: "PATCH",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify(payload),
      });
      setSaveStatus("saved");
    },
    [note.id]
  );

  const scheduleSave = useCallback(
    (payload: { title?: string; content?: unknown }) => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
      saveTimeout.current = setTimeout(() => saveNote(payload), 800);
    },
    [saveNote]
  );

  useEffect(() => {
    if (skipFirstTitleSave.current) {
      skipFirstTitleSave.current = false;
      return;
    }
    scheduleSave({ title });
  }, [title, scheduleSave]);

  useEffect(() => {
    if (!editor) return;
    function handleUpdate() {
      scheduleSave({ content: editor!.getJSON() });
    }
    editor.on("update", handleUpdate);
    return () => {
      editor.off("update", handleUpdate);
    };
  }, [editor, scheduleSave]);

  useEffect(() => {
    return () => {
      if (saveTimeout.current) clearTimeout(saveTimeout.current);
    };
  }, []);

  return (
    <div className="mx-auto max-w-3xl">
      <div className="mb-6 flex items-center justify-between">
        <Link
          href="/dashboard"
          className="flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Notes
        </Link>
        <div className="flex h-4 items-center gap-1.5 text-xs text-muted-foreground">
          {saveStatus === "saving" && (
            <>
              <Loader2 className="h-3 w-3 animate-spin" />
              Saving...
            </>
          )}
          {saveStatus === "saved" && (
            <>
              <Check className="h-3 w-3" />
              Saved
            </>
          )}
        </div>
      </div>

      <input
        value={title}
        onChange={(e) => setTitle(e.target.value)}
        placeholder="Untitled"
        className="w-full bg-transparent text-3xl font-medium tracking-tight text-foreground outline-none placeholder:text-muted-foreground"
      />

      <div className="mt-4 flex items-center gap-1 border-b border-border pb-3">
        <VoiceButton editor={editor} />
        <ImageUploadButton editor={editor} />
      </div>

      <div className="mt-6">
        <BubbleToolbar editor={editor} />
        <EditorContent editor={editor} />
      </div>
    </div>
  );
}