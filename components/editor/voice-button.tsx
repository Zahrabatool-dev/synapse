"use client";

import { useState } from "react";
import { Mic, Square, Sparkles, Loader2, X } from "lucide-react";
import type { Editor } from "@tiptap/core";
import { useVoiceRecorder } from "@/lib/hooks/use-voice-recorder";
import { supabase } from "@/lib/supabase";
import { toast } from "sonner";

export function VoiceButton({ editor }: { editor: Editor | null }) {
  const { isRecording, interimText, isSupported, startRecording, stopRecording } =
    useVoiceRecorder();
  const [lastTranscript, setLastTranscript] = useState("");
  const [isCleaningUp, setIsCleaningUp] = useState(false);
  const [showPrimer, setShowPrimer] = useState(false);
  const [hasAskedBefore, setHasAskedBefore] = useState(false);

  if (!isSupported) return null;

 async function beginRecording() {
    if (!editor) return;
    setLastTranscript("");
    const {
      data: { user },
    } = await supabase.auth.getUser();
    const lang = user?.user_metadata?.voice_lang || "en-US";
    startRecording((finalText) => {
      setLastTranscript(finalText);
    }, lang);
  }

  function handleToggle() {
    if (isRecording) {
      stopRecording();
      return;
    }

    if (!hasAskedBefore) {
      setShowPrimer(true);
      return;
    }

    beginRecording();
  }

  function confirmPrimer() {
    setShowPrimer(false);
    setHasAskedBefore(true);
    beginRecording();
  }

  function insertTranscript() {
    if (!editor || !lastTranscript) return;
    editor.chain().focus().insertContent(lastTranscript + " ").run();
    setLastTranscript("");
  }

  async function cleanUpWithAI() {
    if (!lastTranscript) return;
    setIsCleaningUp(true);

    const {
      data: { session },
    } = await supabase.auth.getSession();
    if (!session) {
      setIsCleaningUp(false);
      return;
    }

    try {
      const res = await fetch("/api/ai/voice-cleanup", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${session.access_token}`,
        },
        body: JSON.stringify({ text: lastTranscript }),
      });

      if (!res.ok) throw new Error("Cleanup failed");
      const { cleaned } = await res.json();

      editor?.chain().focus().insertContent(cleaned + " ").run();
      setLastTranscript("");
      toast.success("Cleaned up and added");
    } catch {
      toast.error("Couldn't clean up — inserting as-is");
      insertTranscript();
    } finally {
      setIsCleaningUp(false);
    }
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={handleToggle}
        className={`flex h-8 w-8 items-center justify-center rounded-md transition-colors ${
          isRecording
            ? "bg-destructive/15 text-destructive"
            : "text-muted-foreground hover:bg-accent-soft hover:text-foreground"
        }`}
        title={isRecording ? "Stop recording" : "Record voice note"}
      >
        {isRecording ? (
          <div className="relative flex h-3.5 w-3.5 items-center justify-center">
            <span className="absolute h-3.5 w-3.5 animate-ping rounded-full bg-destructive/50" />
            <Square className="h-3 w-3 fill-current" />
          </div>
        ) : (
          <Mic className="h-4 w-4" />
        )}
      </button>

      {showPrimer && (
        <div className="absolute left-0 top-10 z-20 w-72 rounded-lg border border-border bg-card p-4 shadow-lg">
          <div className="flex items-start justify-between gap-2">
            <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full bg-accent-soft">
              <Mic className="h-4 w-4 text-primary" />
            </div>
            <button
              onClick={() => setShowPrimer(false)}
              className="text-muted-foreground hover:text-foreground"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
          <h4 className="mt-2.5 text-sm font-medium text-foreground">
            Speak your note
          </h4>
          <p className="mt-1 text-xs text-muted-foreground">
            Synapse will transcribe what you say in real time. Your browser
            will ask for microphone access next. This stays on your device
            until you choose to add it to the note.
          </p>
          <button
            onClick={confirmPrimer}
            className="mt-3 w-full rounded-md bg-primary py-1.5 text-xs font-medium text-primary-foreground hover:opacity-90"
          >
            Continue
          </button>
        </div>
      )}

      {(isRecording || lastTranscript) && (
        <div className="absolute left-0 top-10 z-20 w-80 rounded-lg border border-border bg-card p-3 shadow-lg">
          <p className="min-h-[3em] text-sm text-foreground">
            {lastTranscript}
            <span className="text-muted-foreground">{interimText}</span>
            {isRecording && !lastTranscript && !interimText && (
              <span className="text-muted-foreground">Listening...</span>
            )}
          </p>
          {!isRecording && lastTranscript && (
            <div className="mt-2 flex gap-2">
              <button
                onClick={cleanUpWithAI}
                disabled={isCleaningUp}
                className="flex items-center gap-1.5 rounded-md bg-primary px-2.5 py-1 text-xs font-medium text-primary-foreground disabled:opacity-60"
              >
                {isCleaningUp ? (
                  <Loader2 className="h-3 w-3 animate-spin" />
                ) : (
                  <Sparkles className="h-3 w-3" />
                )}
                Clean up with AI
              </button>
              <button
                onClick={insertTranscript}
                className="rounded-md border border-border px-2.5 py-1 text-xs text-muted-foreground hover:text-foreground"
              >
                Insert as-is
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  );
}