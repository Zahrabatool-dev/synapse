"use client";

import { EditorDemoCard } from "@/components/shared/bento-cards/editor-demo-card";
import { GraphPreviewCard } from "@/components/shared/bento-cards/graph-preview-card";
import { VoiceDemoCard } from "@/components/shared/bento-cards/voice-demo-card";
import { ChatPreviewCard } from "@/components/shared/bento-cards/chat-preview-card";
import { FlashcardDemoCard } from "@/components/shared/bento-cards/flashcard-demo-card";
import { TemplatesPreviewCard } from "@/components/shared/bento-cards/templates-preview-card";

export function BentoGrid() {
  return (
    <section id="demo" className="border-b border-border/60">
      <div className="mx-auto max-w-6xl px-6 py-24 sm:py-32">
        <div className="mb-14 max-w-2xl">
          <span className="font-mono text-xs uppercase tracking-wider text-primary">
            See it in action
          </span>
          <h2 className="mt-3 text-3xl font-medium tracking-tight text-foreground sm:text-4xl">
            Every note is a{" "}
            <span className="font-display italic text-primary">living</span>{" "}
            piece of your thinking
          </h2>
        </div>

       <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3 lg:grid-rows-2">
          <div className="lg:col-span-2 lg:row-span-2">
            <EditorDemoCard />
          </div>
          <div className="lg:col-span-1 lg:row-span-1">
            <GraphPreviewCard />
          </div>
          <div className="lg:col-span-1 lg:row-span-1">
            <VoiceDemoCard />
          </div>
          <div className="lg:col-span-1 lg:row-span-1">
            <ChatPreviewCard />
          </div>
          <div className="lg:col-span-1 lg:row-span-1">
            <FlashcardDemoCard />
          </div>
          <div className="lg:col-span-1 lg:row-span-1">
            <TemplatesPreviewCard />
          </div>
        </div>
      </div>
    </section>
  );
}