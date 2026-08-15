"use client";

import { useEffect, useState } from "react";
import { Sparkles } from "lucide-react";

interface Message {
  role: "user" | "ai";
  text: string;
}

const CONVERSATION: Message[] = [
  { role: "user", text: "What did I write about the Q3 launch?" },
  {
    role: "ai",
    text: "You noted the launch depends on the pricing review finishing first — from your Aug 3 note.",
  },
];

export function ChatPreviewCard() {
  const [visibleCount, setVisibleCount] = useState(0);

  useEffect(() => {
    if (visibleCount >= CONVERSATION.length) {
      const resetTimer = setTimeout(() => setVisibleCount(0), 2200);
      return () => clearTimeout(resetTimer);
    }
    const timer = setTimeout(
      () => setVisibleCount((prev) => prev + 1),
      visibleCount === 0 ? 500 : 1400
    );
    return () => clearTimeout(timer);
  }, [visibleCount]);

  return (
    <div className="flex h-full min-h-[200px] flex-col overflow-hidden rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Sparkles className="h-4 w-4" />
        <span>Chat with your notes</span>
      </div>

      <div className="flex flex-1 flex-col justify-end gap-2.5">
        {CONVERSATION.slice(0, visibleCount).map((msg, i) => (
          <div
            key={i}
            className={`animate-in fade-in slide-in-from-bottom-1 max-w-[90%] rounded-xl px-3.5 py-2 text-xs leading-relaxed duration-300 ${
              msg.role === "user"
                ? "self-end bg-primary text-primary-foreground"
                : "self-start bg-accent-soft text-primary"
            }`}
          >
            {msg.text}
          </div>
        ))}
        {visibleCount === 1 && (
          <div className="self-start rounded-xl bg-accent-soft px-3.5 py-2.5">
            <span className="flex gap-1">
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.3s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary [animation-delay:-0.15s]" />
              <span className="h-1.5 w-1.5 animate-bounce rounded-full bg-primary" />
            </span>
          </div>
        )}
      </div>
    </div>
  );
}