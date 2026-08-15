export function extractPlainText(node: unknown): string {
  if (!node || typeof node !== "object") return "";
  const n = node as { text?: string; content?: unknown[] };
  let text = n.text ? n.text : "";
  if (Array.isArray(n.content)) {
    for (const child of n.content) {
      text += extractPlainText(child) + " ";
    }
  }
  return text;
}

export function getPreviewText(content: unknown): string {
  const text = extractPlainText(content).replace(/\s+/g, " ").trim();
  return text.slice(0, 100) || "No content yet";
}