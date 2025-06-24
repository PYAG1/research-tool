import { Mark, mergeAttributes } from "@tiptap/core";

declare module "@tiptap/core" {
  interface Commands<ReturnType> {
    citation: {
      /**
       * Set a citation mark
       */
      setCitation: (attributes: { id: string; type: string; label: string }) => ReturnType;
      /**
       * Toggle a citation mark
       */
      toggleCitation: (attributes: { id: string; type: string; label: string }) => ReturnType;
      /**
       * Unset a citation mark
       */
      unsetCitation: () => ReturnType;
    };
  }
}

export const CitationExtension = Mark.create({
  name: "citation",

  addOptions() {
    return {
      HTMLAttributes: {},
    };
  },

  addAttributes() {
    return {
      id: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-citation-id"),
        renderHTML: (attributes) => {
          if (!attributes.id) {
            return {};
          }

          return {
            "data-citation-id": attributes.id,
          };
        },
      },
      type: {
        default: "website",
        parseHTML: (element) => element.getAttribute("data-citation-type"),
        renderHTML: (attributes) => {
          if (!attributes.type) {
            return {};
          }

          return {
            "data-citation-type": attributes.type,
          };
        },
      },
      label: {
        default: null,
        parseHTML: (element) => element.getAttribute("data-citation-label"),
        renderHTML: (attributes) => {
          if (!attributes.label) {
            return {};
          }

          return {
            "data-citation-label": attributes.label,
          };
        },
      },
    };
  },

  parseHTML() {
    return [
      {
        tag: "span[data-citation-id]",
      },
    ];
  },

  renderHTML({ HTMLAttributes }) {
    return [
      "span",
      mergeAttributes(
        { class: "citation" },
        this.options.HTMLAttributes,
        HTMLAttributes
      ),
      0,
    ];
  },
  addCommands() {
    return {
      setCitation:
        (attributes) =>
        ({ commands }) => {
          return commands.setMark(this.name, attributes);
        },
      toggleCitation:
        (attributes) =>
        ({ commands }) => {
          return commands.toggleMark(this.name, attributes);
        },
      unsetCitation:
        () =>
        ({ commands }) => {
          return commands.unsetMark(this.name);
        },
    };
  },
});

export default CitationExtension;
