import { Color } from "@tiptap/extension-color";
import Highlight from "@tiptap/extension-highlight";
import Link from "@tiptap/extension-link";
import Placeholder from "@tiptap/extension-placeholder";
import Subscript from "@tiptap/extension-subscript";
import Superscript from "@tiptap/extension-superscript";
import TextAlign from "@tiptap/extension-text-align";
import TextStyle from "@tiptap/extension-text-style";
import Typography from "@tiptap/extension-typography";
import Underline from "@tiptap/extension-underline";
import { Editor, EditorContent, JSONContent, useEditor, type Extension } from "@tiptap/react";
import StarterKit from "@tiptap/starter-kit";
import { useEffect } from "react";

import { cn } from "@renderer/lib";

// Import TipTap CSS
import "@renderer/components/tiptap/tiptap.css";
import { EditorToolbar } from "../tiptap/toolbars/editor-toolbar";
import { FloatingToolbar } from "../tiptap/extensions/floating-toolbar";
import { TipTapFloatingMenu } from "../tiptap/extensions/floating-menu";
import { ImageExtension } from "../tiptap/extensions/image";
import { ImagePlaceholder } from "../tiptap/extensions/image-placeholder";
import SearchAndReplace from "../tiptap/extensions/search-and-replace";
import CitationExtension from "../tiptap/extensions/citation";

interface RichTextEditorProps {
  content?: JSONContent;
  onUpdate?: (content: JSONContent) => void;
  editable?: boolean;
  className?: string;
  placeholder?: string;
  onMount?: (editor: Editor) => void;
}

export function RichTextEditor({
  content,
  onUpdate,
  editable = true,
  className,
  placeholder = "Write something...",
  onMount,
}: RichTextEditorProps) {
  // Configure extensions
  const extensions = [
    StarterKit.configure({
      orderedList: {
        HTMLAttributes: {
          class: "list-decimal",
        },
      },
      bulletList: {
        HTMLAttributes: {
          class: "list-disc",
        },
      },
      heading: {
        levels: [1, 2, 3, 4],
      },
    }),
    Placeholder.configure({
      emptyNodeClass: "is-editor-empty",
      placeholder: ({ node }) => {
        if (node.type.name === "heading") {
          return `Heading ${node.attrs.level}`;
        }
        return placeholder;
      },
      includeChildren: false,
    }),
    TextAlign.configure({
      types: ["heading", "paragraph"],
    }),
    TextStyle,
    Subscript,
    Superscript,
    Underline,
    Link,
    Color,
    Highlight.configure({
      multicolor: true,
    }),    ImageExtension,
    ImagePlaceholder,
    SearchAndReplace,
    CitationExtension,
    Typography,
  ];
  // Initialize editor
  const editor = useEditor({
    extensions: extensions as Extension[],
    content: content || { type: "doc", content: [{ type: "paragraph" }] },
    editable,
    editorProps: {
      attributes: {
        class: "max-w-full focus:outline-none",
      },
    },
    onUpdate: ({ editor }) => {
      if (onUpdate) {
        onUpdate(editor.getJSON());
      }
    },
    onCreate: ({ editor }) => {
      // Call onMount callback with the editor instance
      if (onMount) {
        onMount(editor);
      }
    },
  });

  // Update editor content when content prop changes
  useEffect(() => {
    if (editor && content && !editor.isDestroyed) {
      // Only update if content actually changed to avoid loops
      const currentContent = JSON.stringify(editor.getJSON());
      const newContent = JSON.stringify(content);
      
      if (currentContent !== newContent) {
        editor.commands.setContent(content);
      }
    }
  }, [editor, content]);

  // Update editable state when prop changes
  useEffect(() => {
    if (editor && !editor.isDestroyed) {
      editor.setEditable(editable);
    }
  }, [editor, editable]);

  if (!editor) return null;

  return (
    <div
      className={cn(
        "relative max-h-full w-full overflow-hidden border bg-card",
        className
      )}
    >
      {editable && <EditorToolbar editor={editor} />}
      {editable && <FloatingToolbar editor={editor} />}
      {editable && <TipTapFloatingMenu editor={editor} />}
      <EditorContent
        editor={editor}
        className="min-h-[300px] w-full min-w-full cursor-text p-4"
      />
    </div>
  );
}
