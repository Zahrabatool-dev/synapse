"use client";

import { RotateCw } from "lucide-react";
import type { Flashcard } from "@/lib/hooks/use-flashcards";

interface StudyCardProps {
  card: Flashcard;
  flipped: boolean;
  onFlip: () => void;
}

export function StudyCard({ card, flipped, onFlip }: StudyCardProps) {
  return (
    <button
      onClick={onFlip}
      className="group w-full [perspective:1600px]"
      aria-label="Flip card"
    >
      <div
        className={`relative h-72 w-full transition-transform duration-500 [transform-style:preserve-3d] sm:h-80 ${
          flipped ? "[transform:rotateY(180deg)]" : ""
        }`}
      >
        {/* Front */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-border bg-card p-8 text-center [backface-visibility:hidden]">
          <span className="mb-4 rounded-full bg-accent-soft px-3 py-1 text-xs font-medium text-primary">
            Question
          </span>
          <p className="text-lg font-medium leading-relaxed text-foreground sm:text-xl">
            {card.question}
          </p>
          <span className="mt-6 flex items-center gap-1.5 text-xs text-muted-foreground opacity-0 transition-opacity group-hover:opacity-100">
            <RotateCw className="h-3 w-3" />
            Click to reveal answer
          </span>
        </div>

        {/* Back */}
        <div className="absolute inset-0 flex flex-col items-center justify-center rounded-3xl border border-primary/40 bg-primary p-8 text-center [backface-visibility:hidden] [transform:rotateY(180deg)]">
          <span className="mb-4 rounded-full bg-primary-foreground/15 px-3 py-1 text-xs font-medium text-primary-foreground">
            Answer
          </span>
          <p className="text-lg font-medium leading-relaxed text-primary-foreground sm:text-xl">
            {card.answer}
          </p>
        </div>
      </div>
    </button>
  );
}