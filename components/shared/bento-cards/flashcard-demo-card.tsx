"use client";

import { Layers } from "lucide-react";

export function FlashcardDemoCard() {
  return (
    <div className="flex h-full min-h-[200px] flex-col overflow-hidden rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
        <Layers className="h-4 w-4" />
        <span>Study Mode</span>
      </div>

      <div className="group flex flex-1 items-center justify-center [perspective:1000px]">
        <div className="relative h-24 w-full max-w-[200px] transition-transform duration-500 [transform-style:preserve-3d] group-hover:[transform:rotateY(180deg)]">
          <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-border bg-accent-soft px-4 text-center text-sm text-primary [backface-visibility:hidden]">
            What connects two notes?
          </div>
          <div className="absolute inset-0 flex items-center justify-center rounded-xl border border-primary/40 bg-primary px-4 text-center text-sm text-primary-foreground [backface-visibility:hidden] [transform:rotateY(180deg)]">
            A shared idea, tag, or link
          </div>
        </div>
      </div>

      <p className="text-center text-xs text-muted-foreground">Hover to flip</p>
    </div>
  );
}