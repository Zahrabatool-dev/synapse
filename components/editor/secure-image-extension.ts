import { Node, mergeAttributes, ReactNodeViewRenderer } from "@tiptap/react";
import { SecureImageView } from "./secure-image";

export const SecureImage = Node.create({
  name: "secureImage",
  group: "block",
  atom: true,

  addAttributes() {
    return {
      path: { default: null },
      alt: { default: "" },
    };
  },

  parseHTML() {
    return [{ tag: "secure-image" }];
  },

  renderHTML({ HTMLAttributes }) {
    return ["secure-image", mergeAttributes(HTMLAttributes)];
  },

  addNodeView() {
    return ReactNodeViewRenderer(SecureImageView);
  },
});