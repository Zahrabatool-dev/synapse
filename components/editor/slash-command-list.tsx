"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import type { Editor, Range } from "@tiptap/core";
import type { LucideIcon } from "lucide-react";

export interface SlashCommandItem {
  title: string;
  icon: LucideIcon;
  command: (props: { editor: Editor; range: Range }) => void;
}

interface SlashCommandListProps {
  items: SlashCommandItem[];
  command: (item: SlashCommandItem) => void;
}

export interface SlashCommandListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

export const SlashCommandList = forwardRef<
  SlashCommandListRef,
  SlashCommandListProps
>(function SlashCommandList({ items, command }, ref) {
  const [selectedIndex, setSelectedIndex] = useState(0);

  useEffect(() => setSelectedIndex(0), [items]);

  useImperativeHandle(ref, () => ({
    onKeyDown: ({ event }: { event: KeyboardEvent }) => {
      if (event.key === "ArrowUp") {
        setSelectedIndex((i) => (i + items.length - 1) % items.length);
        return true;
      }
      if (event.key === "ArrowDown") {
        setSelectedIndex((i) => (i + 1) % items.length);
        return true;
      }
      if (event.key === "Enter") {
        if (items[selectedIndex]) command(items[selectedIndex]);
        return true;
      }
      return false;
    },
  }));

  if (items.length === 0) {
    return (
      <div className="rounded-lg border border-border bg-card p-2 text-sm text-muted-foreground shadow-md">
        No results
      </div>
    );
  }

  return (
    <div className="max-h-72 w-56 overflow-y-auto rounded-lg border border-border bg-card p-1 shadow-md">
      {items.map((item, index) => (
        <button
          key={item.title}
          onMouseDown={(e) => e.preventDefault()}
          onClick={() => command(item)}
          className={`flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
            index === selectedIndex
              ? "bg-accent-soft text-primary"
              : "text-foreground hover:bg-accent-soft/60"
          }`}
        >
          <item.icon className="h-4 w-4" />
          {item.title}
        </button>
      ))}
    </div>
  );
});