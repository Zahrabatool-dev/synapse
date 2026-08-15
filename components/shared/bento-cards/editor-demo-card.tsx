"use client";

import { useState } from "react";
import { Sparkles } from "lucide-react";

export function EditorDemoCard() {
  const [text, setText] = useState(
    "The best ideas rarely arrive fully formed.\n\nThey start as a fragment - a half-sentence, a question, a thing you overheard. Synapse holds that fragment, then quietly connects it to everything else you've written."
  );

  return (
    <div className="group relative flex h-full min-h-[420px] flex-col overflow-hidden rounded-2xl border border-border bg-card p-1.5">
      <div className="flex items-center justify-between border-b border-border/60 px-4 py-3">
        <div className="flex items-center gap-2">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-chart-3/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-chart-2/60" />
        </div>
        <div className="flex items-center gap-1.5 rounded-full bg-accent-soft px-2.5 py-1 text-xs text-primary">
          <Sparkles className="h-3 w-3" />
          <span className="font-mono">Live editor</span>
        </div>
      </div>

      <div className="flex flex-1 flex-col px-6 py-6">
        <p className="mb-4 text-xs font-mono uppercase tracking-wider text-muted-foreground">
          Untitled - Aug 11
        </p>
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="min-h-[220px] flex-1 resize-none bg-transparent text-lg leading-relaxed text-foreground placeholder:text-muted-foreground focus:outline-none"
          placeholder="Start typing..."
        />
        <p className="mt-4 text-xs text-muted-foreground">
          Try editing this - it's a real, working editor. Nothing you type here is saved.
        </p>
      </div>
    </div>
  );
}