"use client";

import { useEffect, useState } from "react";
import { NodeViewWrapper, type ReactNodeViewProps } from "@tiptap/react";
import { ImageOff, Loader2 } from "lucide-react";
import { supabase } from "@/lib/supabase";

export function SecureImageView({ node }: ReactNodeViewProps) {
  const path = node.attrs.path as string;
  const alt = (node.attrs.alt as string) || "";
  const [url, setUrl] = useState<string | null>(null);
  const [failed, setFailed] = useState(false);

  useEffect(() => {
    let cancelled = false;

    async function loadSignedUrl() {
      const { data, error } = await supabase.storage
        .from("note-images")
        .createSignedUrl(path, 3600);

      if (cancelled) return;
      if (error || !data) {
        setFailed(true);
        return;
      }
      setUrl(data.signedUrl);
    }

    loadSignedUrl();
    return () => {
      cancelled = true;
    };
  }, [path]);

  return (
    <NodeViewWrapper className="my-3">
      {failed ? (
        <div className="flex h-40 items-center justify-center gap-2 rounded-lg border border-border bg-muted text-sm text-muted-foreground">
          <ImageOff className="h-4 w-4" />
          Couldn&apos;t load image
        </div>
      ) : url ? (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={url}
          alt={alt}
          className="max-h-[500px] rounded-lg border border-border object-contain"
        />
      ) : (
        <div className="flex h-40 items-center justify-center rounded-lg border border-border bg-muted">
          <Loader2 className="h-5 w-5 animate-spin text-muted-foreground" />
        </div>
      )}
    </NodeViewWrapper>
  );
}