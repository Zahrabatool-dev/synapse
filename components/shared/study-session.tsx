"use client";

import { useEffect, useState, useCallback } from "react";
import { ArrowLeft, ArrowRight, Check, RotateCcw, Trophy } from "lucide-react";
import { StudyCard } from "@/components/shared/study-card";
import type { Flashcard } from "@/lib/hooks/use-flashcards";

interface StudySessionProps {
  cards: Flashcard[];
  onRestart: () => void;
}

export function StudySession({ cards, onRestart }: StudySessionProps) {
  const [index, setIndex] = useState(0);
  const [flipped, setFlipped] = useState(false);
  const [knownIds, setKnownIds] = useState<Set<string>>(new Set());
  const [reviewedIds, setReviewedIds] = useState<Set<string>>(new Set());

  const current = cards[index];
  const isLastCard = index === cards.length - 1;
  const isComplete = reviewedIds.size === cards.length && cards.length > 0;

  const goNext = useCallback(() => {
    if (!current) return;
    setReviewedIds((prev) => new Set(prev).add(current.id));
    if (!isLastCard) {
      setIndex((i) => i + 1);
      setFlipped(false);
    } else {
      setIndex((i) => i + 1);
    }
  }, [current, isLastCard]);

  const goPrev = useCallback(() => {
    if (index > 0) {
      setIndex((i) => i - 1);
      setFlipped(false);
    }
  }, [index]);

  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === " ") {
        e.preventDefault();
        setFlipped((f) => !f);
      }
      if (e.key === "ArrowRight") goNext();
      if (e.key === "ArrowLeft") goPrev();
    }
    window.addEventListener("keydown", handleKey);
    return () => window.removeEventListener("keydown", handleKey);
  }, [goNext, goPrev]);

  function markKnown(known: boolean) {
    if (!current) return;
    setKnownIds((prev) => {
      const next = new Set(prev);
      if (known) next.add(current.id);
      else next.delete(current.id);
      return next;
    });
    goNext();
  }

  if (isComplete) {
    const percent = Math.round((knownIds.size / cards.length) * 100);
    return (
      <div className="flex flex-col items-center justify-center py-16 text-center">
        <div className="mb-4 flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft">
          <Trophy className="h-7 w-7 text-primary" />
        </div>
        <h2 className="text-2xl font-medium tracking-tight text-foreground">
          Session complete
        </h2>
        <p className="mt-2 text-sm text-muted-foreground">
          You knew {knownIds.size} out of {cards.length} cards
        </p>

        <div className="mt-6 h-2 w-64 overflow-hidden rounded-full bg-muted">
          <div
            className="h-full rounded-full bg-primary transition-all duration-700"
            style={{ width: `${percent}%` }}
          />
        </div>
        <p className="mt-2 text-xs text-muted-foreground">{percent}% mastered</p>

        <button
          onClick={onRestart}
          className="mt-8 flex items-center gap-2 rounded-lg bg-primary px-4 py-2 text-sm font-medium text-primary-foreground hover:opacity-90"
        >
          <RotateCcw className="h-4 w-4" />
          Study again
        </button>
      </div>
    );
  }

  return (
    <div className="mx-auto max-w-xl">
      <div className="mb-4 flex items-center justify-between text-xs text-muted-foreground">
        <span>
          Card {index + 1} of {cards.length}
        </span>
        <span>{reviewedIds.size} reviewed</span>
      </div>

      <div className="mb-6 h-1.5 w-full overflow-hidden rounded-full bg-muted">
        <div
          className="h-full rounded-full bg-primary transition-all duration-300"
          style={{ width: `${(reviewedIds.size / cards.length) * 100}%` }}
        />
      </div>

      {current && (
        <StudyCard card={current} flipped={flipped} onFlip={() => setFlipped((f) => !f)} />
      )}

      {flipped ? (
        <div className="mt-6 flex justify-center gap-3">
          <button
            onClick={() => markKnown(false)}
            className="flex items-center gap-2 rounded-lg border border-border px-5 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:border-destructive/40 hover:text-destructive"
          >
            Still learning
          </button>
          <button
            onClick={() => markKnown(true)}
            className="flex items-center gap-2 rounded-lg bg-primary px-5 py-2.5 text-sm font-medium text-primary-foreground hover:opacity-90"
          >
            <Check className="h-4 w-4" />
            I knew this
          </button>
        </div>
      ) : (
        <div className="mt-6 flex items-center justify-between">
          <button
            onClick={goPrev}
            disabled={index === 0}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground disabled:opacity-30"
          >
            <ArrowLeft className="h-4 w-4" />
            Previous
          </button>
          <span className="text-xs text-muted-foreground">
            Press space to flip
          </span>
          <button
            onClick={goNext}
            className="flex items-center gap-1.5 rounded-lg px-3 py-2 text-sm text-muted-foreground transition-colors hover:text-foreground"
          >
            Skip
            <ArrowRight className="h-4 w-4" />
          </button>
        </div>
      )}
    </div>
  );
}