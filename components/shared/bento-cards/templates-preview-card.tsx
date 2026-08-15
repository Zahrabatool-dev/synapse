"use client";

import { LayoutTemplate } from "lucide-react";

const TEMPLATES = ["Meeting notes", "Daily journal", "Project brief", "Reading list"];

export function TemplatesPreviewCard() {
  return (
    <div className="flex h-full min-h-[200px] flex-col overflow-hidden rounded-2xl border border-border bg-card p-5">
      <div className="mb-3 flex items-center gap-2 text-sm text-muted-foreground">
        <LayoutTemplate className="h-4 w-4" />
        <span>Templates</span>
      </div>

      <div className="flex flex-1 flex-col justify-center gap-2">
        {TEMPLATES.map((template) => (
          <div
            key={template}
            className="cursor-default rounded-lg border border-border/80 bg-background/60 px-3.5 py-2.5 text-sm text-foreground transition-all hover:translate-x-1 hover:border-primary/40"
          >
            {template}
          </div>
        ))}
      </div>

      <p className="mt-3 text-xs text-muted-foreground">
        Start from a template, not a blank page.
      </p>
    </div>
  );
}