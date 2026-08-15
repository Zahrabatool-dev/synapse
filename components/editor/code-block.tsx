"use client";

import { NodeViewWrapper, NodeViewContent, type ReactNodeViewProps } from "@tiptap/react";

const LANGUAGES = [
  "javascript",
  "typescript",
  "python",
  "html",
  "css",
  "json",
  "bash",
  "sql",
  "plaintext",
];

export function CodeBlockView({ node, updateAttributes }: ReactNodeViewProps) {
  const language = node.attrs.language || "plaintext";

  return (
    <NodeViewWrapper className="code-block-wrapper">
      <div className="flex items-center justify-between rounded-t-lg border border-b-0 border-border bg-muted px-3 py-1.5">
        <div className="flex items-center gap-1.5">
          <span className="h-2.5 w-2.5 rounded-full bg-destructive/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-chart-3/60" />
          <span className="h-2.5 w-2.5 rounded-full bg-chart-2/60" />
        </div>
        <select
  contentEditable={false}
  value={language}
  onChange={(e) => updateAttributes({ language: e.target.value })}
  className="cursor-pointer rounded border border-border bg-background px-2 py-0.5 text-xs text-muted-foreground outline-none"
>
  {LANGUAGES.map((lang) => (
    <option
      key={lang}
      value={lang}
      style={{ backgroundColor: "hsl(var(--card))", color: "hsl(var(--foreground))" }}
    >
      {lang}
    </option>
  ))}
</select>
      </div>
      <pre className="!mt-0 rounded-t-none">
        <NodeViewContent as={"code" as "div"} />
      </pre>
    </NodeViewWrapper>
  );
}