"use client";

import {
  forwardRef,
  useEffect,
  useImperativeHandle,
  useState,
} from "react";
import { FileText } from "lucide-react";

export interface NoteLinkItem {
  id: string;
  title: string;
}

interface NoteLinkListProps {
  items: NoteLinkItem[];
  command: (item: NoteLinkItem) => void;
}

export interface NoteLinkListRef {
  onKeyDown: (props: { event: KeyboardEvent }) => boolean;
}

export const NoteLinkList = forwardRef<NoteLinkListRef, NoteLinkListProps>(
  function NoteLinkList({ items, command }, ref) {
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
          No matching notes
        </div>
      );
    }

    return (
      <div className="max-h-72 w-64 overflow-y-auto rounded-lg border border-border bg-card p-1 shadow-md">
        {items.map((item, index) => (
          <button
            key={item.id}
            onMouseDown={(e) => e.preventDefault()}
            onClick={() => command(item)}
            className={`flex w-full items-center gap-2.5 rounded-md px-2 py-1.5 text-left text-sm transition-colors ${
              index === selectedIndex
                ? "bg-accent-soft text-primary"
                : "text-foreground hover:bg-accent-soft/60"
            }`}
          >
            <FileText className="h-3.5 w-3.5 shrink-0" />
            <span className="line-clamp-1">{item.title}</span>
          </button>
        ))}
      </div>
    );
  }
);