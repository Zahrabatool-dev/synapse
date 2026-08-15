"use client";

import { useState } from "react";
import { Mic, Square } from "lucide-react";

export function VoiceDemoCard() {
  const [isRecording, setIsRecording] = useState(false);

  return (
    <div className="relative flex h-full min-h-[200px] flex-col items-center justify-center gap-4 overflow-hidden rounded-2xl border border-border bg-card p-5">
      <div className="absolute left-5 top-5 flex items-center gap-2 text-sm text-muted-foreground">
        <Mic className="h-4 w-4" />
        <span>Voice to Note</span>
      </div>

      <button
        onClick={() => setIsRecording((prev) => !prev)}
        className="group relative flex h-16 w-16 items-center justify-center rounded-full bg-accent-soft transition-colors hover:bg-accent-soft/80"
        aria-pressed={isRecording}
        aria-label={isRecording ? "Stop recording" : "Start recording"}
      >
        {isRecording && (
          <>
            <span className="absolute inset-0 animate-ping rounded-full bg-primary/40" />
            <span className="absolute -inset-2 animate-pulse rounded-full bg-primary/10" />
          </>
        )}
        <span className="relative flex h-11 w-11 items-center justify-center rounded-full bg-primary text-primary-foreground">
          {isRecording ? (
            <Square className="h-4 w-4 fill-current" />
          ) : (
            <Mic className="h-5 w-5" />
          )}
        </span>
      </button>

      <p className="text-center text-xs text-muted-foreground">
        {isRecording ? "Listening..." : "Try saying something"}
      </p>
    </div>
  );
}