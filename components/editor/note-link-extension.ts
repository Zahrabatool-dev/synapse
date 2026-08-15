import { Extension, Mark, mergeAttributes } from "@tiptap/core";
import { PluginKey } from "@tiptap/pm/state";
import Suggestion from "@tiptap/suggestion";
import { ReactRenderer } from "@tiptap/react";
import tippy, { type Instance as TippyInstance } from "tippy.js";
import { NoteLinkList, type NoteLinkItem, type NoteLinkListRef } from "./note-link-list";

export const NoteLinkMark = Mark.create({
  name: "noteLink",

  addAttributes() {
    return {
      noteId: { default: null },
    };
  },

  parseHTML() {
    return [{ tag: "span[data-note-link]" }];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(HTMLAttributes, {
        "data-note-link": "",
        "data-note-id": HTMLAttributes.noteId,
        class: "note-link",
      }),
      0,
    ];
  },
});

interface NoteLinkOptions {
  getNotes: () => NoteLinkItem[];
  onLinkCreated: (targetNoteId: string) => void;
}

interface NoteLinkListProps {
  items: NoteLinkItem[];
  command: (item: NoteLinkItem) => void;
}

export const NoteLinkSuggestion = Extension.create<NoteLinkOptions>({
  name: "noteLinkSuggestion",

  addOptions() {
    return {
      getNotes: () => [],
      onLinkCreated: () => {},
    };
  },

  addProseMirrorPlugins() {
    const { getNotes, onLinkCreated } = this.options;

    return [
      Suggestion({
        editor: this.editor,
        pluginKey: new PluginKey("noteLinkSuggestion"),
        char: "[[",
        items: ({ query }: { query: string }) =>
          getNotes()
            .filter((n) => n.title.toLowerCase().includes(query.toLowerCase()))
            .slice(0, 8),
        command: ({ editor, range, props }) => {
          const item = props as NoteLinkItem;
          editor
            .chain()
            .focus()
            .deleteRange(range)
            .insertContent({
              type: "text",
              text: item.title,
              marks: [{ type: "noteLink", attrs: { noteId: item.id } }],
            })
            .insertContent(" ")
            .run();
          onLinkCreated(item.id);
        },
        render: () => {
          let component: ReactRenderer<NoteLinkListRef, NoteLinkListProps>;
          let popup: TippyInstance[];

          return {
            onStart: (props) => {
              component = new ReactRenderer(NoteLinkList, {
                props,
                editor: props.editor,
              });
              if (!props.clientRect) return;
              popup = tippy("body", {
                getReferenceClientRect: props.clientRect as () => DOMRect,
                appendTo: () => document.body,
                content: component.element,
                showOnCreate: true,
                interactive: true,
                trigger: "manual",
                placement: "bottom-start",
              });
            },
            onUpdate(props) {
              component.updateProps(props);
              if (!props.clientRect) return;
              popup[0].setProps({
                getReferenceClientRect: props.clientRect as () => DOMRect,
              });
            },
            onKeyDown(props) {
              if (props.event.key === "Escape") {
                popup[0].hide();
                return true;
              }
              return component.ref?.onKeyDown(props) ?? false;
            },
            onExit() {
              popup[0].destroy();
              component.destroy();
            },
          };
        },
      }),
    ];
  },
});