"use client";

import { BubbleMenu } from "@tiptap/react/menus";
import type { Editor } from "@tiptap/react";
import {
  Bold,
  Italic,
  Strikethrough,
  Code,
  Heading1,
  Heading2,
} from "lucide-react";

export function BubbleToolbar({ editor }: { editor: Editor | null }) {
  if (!editor) return null;

  const buttons = [
    {
      icon: Bold,
      isActive: () => editor.isActive("bold"),
      onClick: () => editor.chain().focus().toggleBold().run(),
    },
    {
      icon: Italic,
      isActive: () => editor.isActive("italic"),
      onClick: () => editor.chain().focus().toggleItalic().run(),
    },
    {
      icon: Strikethrough,
      isActive: () => editor.isActive("strike"),
      onClick: () => editor.chain().focus().toggleStrike().run(),
    },
    {
      icon: Code,
      isActive: () => editor.isActive("code"),
      onClick: () => editor.chain().focus().toggleCode().run(),
    },
    {
      icon: Heading1,
      isActive: () => editor.isActive("heading", { level: 1 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 1 }).run(),
    },
    {
      icon: Heading2,
      isActive: () => editor.isActive("heading", { level: 2 }),
      onClick: () => editor.chain().focus().toggleHeading({ level: 2 }).run(),
    },
  ];

  return (
    <BubbleMenu
      editor={editor}
      options={{ placement: "top" }}
      shouldShow={({ state }) => !state.selection.empty}
    >
      <div className="flex items-center gap-0.5 rounded-lg border border-border bg-card p-1 shadow-md">
        {buttons.map((btn, i) => (
          <button
            key={i}
            onClick={btn.onClick}
            className={`rounded-md p-1.5 transition-colors ${
              btn.isActive()
                ? "bg-accent-soft text-primary"
                : "text-muted-foreground hover:bg-accent-soft/60 hover:text-foreground"
            }`}
          >
            <btn.icon className="h-3.5 w-3.5" />
          </button>
        ))}
      </div>
    </BubbleMenu>
  );
}