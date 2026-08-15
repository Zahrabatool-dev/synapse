import Link from "next/link";
import { Sparkles, FileText } from "lucide-react";
import type { ChatMessage as ChatMessageType } from "@/lib/hooks/use-chat";

export function ChatMessage({ message }: { message: ChatMessageType }) {
  const isUser = message.role === "user";

  return (
    <div
      className={`flex gap-3 ${isUser ? "flex-row-reverse" : "flex-row"} animate-in fade-in slide-in-from-bottom-2 duration-300`}
    >
      <div
        className={`flex h-7 w-7 shrink-0 items-center justify-center rounded-full ${
          isUser ? "bg-primary text-primary-foreground" : "bg-accent-soft text-primary"
        }`}
      >
        {isUser ? (
          <span className="text-xs font-medium">You</span>
        ) : (
          <Sparkles className="h-3.5 w-3.5" />
        )}
      </div>

      <div className={`flex max-w-[75%] flex-col gap-2 ${isUser ? "items-end" : "items-start"}`}>
        <div
          className={`rounded-2xl px-4 py-2.5 text-sm leading-relaxed ${
            isUser
              ? "rounded-tr-sm bg-primary text-primary-foreground"
              : "rounded-tl-sm bg-card text-foreground border border-border"
          }`}
        >
          {message.text}
        </div>

        {!isUser && message.sources && message.sources.length > 0 && (
          <div className="flex flex-wrap gap-1.5">
            {message.sources.map((source) => (
              <Link
                key={source.id}
                href={`/notes/${source.id}`}
                className="flex items-center gap-1.5 rounded-full border border-border bg-accent-soft/40 px-2.5 py-1 text-xs text-muted-foreground transition-colors hover:border-primary/40 hover:text-primary"
              >
                <FileText className="h-3 w-3" />
                {source.title}
              </Link>
            ))}
          </div>
        )}
      </div>
    </div>
  );
}