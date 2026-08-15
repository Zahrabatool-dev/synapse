"use client";

import { useEffect, useRef, useState } from "react";
import { Sparkles, ArrowUp, Loader2 } from "lucide-react";
import { useChat } from "@/lib/hooks/use-chat";
import { useConversations } from "@/lib/hooks/use-conversations";
import { useNotes } from "@/lib/hooks/use-notes";
import { ChatMessage } from "@/components/shared/chat-message";
import { TypingIndicator } from "@/components/shared/typing-indicator";
import { ChatSidebar } from "@/components/shared/chat-sidebar";

export default function ChatPage() {
  const {
    conversations,
    loading: loadingConversations,
    createConversation,
    renameConversation,
    deleteConversation,
    refetch,
  } = useConversations();
  const [activeId, setActiveId] = useState<string | null>(null);
  const { messages, isThinking, isLoadingHistory, sendMessage } = useChat(activeId);
  const { notes } = useNotes();
  const [input, setInput] = useState("");
  const scrollRef = useRef<HTMLDivElement>(null);
  const textareaRef = useRef<HTMLTextAreaElement>(null);

  useEffect(() => {
    if (!loadingConversations && conversations.length > 0 && !activeId) {
      setActiveId(conversations[0].id);
    }
  }, [loadingConversations, conversations, activeId]);

  useEffect(() => {
    scrollRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages, isThinking]);

  async function handleNewChat() {
    const conv = await createConversation();
    if (conv) setActiveId(conv.id);
  }

  async function handleSubmit(text: string) {
    const trimmed = text.trim();
    if (!trimmed || isThinking) return;

    let conversationId = activeId;
    if (!conversationId) {
      const conv = await createConversation();
      if (!conv) return;
      conversationId = conv.id;
      setActiveId(conv.id);
    }

    await sendMessage(trimmed);
    setInput("");
    if (textareaRef.current) textareaRef.current.style.height = "auto";
    refetch();
  }

  function handleDelete(id: string) {
    deleteConversation(id);
    if (activeId === id) {
      const remaining = conversations.filter((c) => c.id !== id);
      setActiveId(remaining[0]?.id ?? null);
    }
  }

  const suggestions = notes.slice(0, 3).map((n) => `What did I write about "${n.title}"?`);

  if (loadingConversations) {
    return (
      <div className="flex h-[calc(100vh-8rem)] items-center justify-center">
        <Loader2 className="h-6 w-6 animate-spin text-primary" />
      </div>
    );
  }

  return (
    <div className="-m-6 flex h-[calc(100vh-4rem)]">
      <ChatSidebar
        conversations={conversations}
        activeId={activeId}
        onSelect={setActiveId}
        onNew={handleNewChat}
        onRename={renameConversation}
        onDelete={handleDelete}
      />

      <div className="mx-auto flex w-full max-w-3xl flex-1 flex-col px-6">
        {isLoadingHistory ? (
          <div className="flex flex-1 items-center justify-center">
            <Loader2 className="h-6 w-6 animate-spin text-primary" />
          </div>
        ) : messages.length === 0 ? (
          <div className="flex flex-1 flex-col items-center justify-center px-4 text-center">
            <div className="mb-4 flex h-14 w-14 items-center justify-center rounded-full bg-accent-soft">
              <Sparkles className="h-6 w-6 text-primary" />
            </div>
            <h1 className="text-2xl font-medium tracking-tight text-foreground">
              Chat with your notes
            </h1>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Ask questions about anything you&apos;ve written — Synapse will
              find the relevant notes and answer using them.
            </p>

            {suggestions.length > 0 && (
              <div className="mt-8 flex w-full max-w-md flex-col gap-2">
                {suggestions.map((s) => (
                  <button
                    key={s}
                    onClick={() => handleSubmit(s)}
                    className="rounded-xl border border-border bg-card px-4 py-2.5 text-left text-sm text-foreground transition-colors hover:border-primary/40"
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>
        ) : (
          <div className="flex-1 space-y-5 overflow-y-auto py-6">
            {messages.map((msg, i) => (
              <ChatMessage key={i} message={msg} />
            ))}
            {isThinking && <TypingIndicator />}
            <div ref={scrollRef} />
          </div>
        )}

        <div className="border-t border-border pt-4 pb-4">
          <div className="flex items-end gap-2 rounded-2xl border border-border bg-card p-2 shadow-sm focus-within:border-primary/40">
            <textarea
              ref={textareaRef}
              value={input}
              onChange={(e) => {
                setInput(e.target.value);
                e.target.style.height = "auto";
                e.target.style.height = `${Math.min(e.target.scrollHeight, 120)}px`;
              }}
              onKeyDown={(e) => {
                if (e.key === "Enter" && !e.shiftKey) {
                  e.preventDefault();
                  handleSubmit(input);
                }
              }}
              placeholder="Ask something about your notes..."
              rows={1}
              className="max-h-[120px] flex-1 resize-none bg-transparent px-2 py-1.5 text-sm text-foreground outline-none placeholder:text-muted-foreground"
            />
            <button
              onClick={() => handleSubmit(input)}
              disabled={!input.trim() || isThinking}
              className="flex h-8 w-8 shrink-0 items-center justify-center rounded-full bg-primary text-primary-foreground transition-opacity hover:opacity-90 disabled:opacity-40"
            >
              <ArrowUp className="h-4 w-4" />
            </button>
          </div>
          <p className="mt-2 text-center text-xs text-muted-foreground">
            Synapse can make mistakes. Verify important information.
          </p>
        </div>
      </div>
    </div>
  );
}