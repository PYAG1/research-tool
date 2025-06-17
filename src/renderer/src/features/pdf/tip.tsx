import { Button } from "@renderer/components/ui/button";
import { Textarea } from "@renderer/components/ui/textarea";
import { Bookmark, Clipboard, MessageCircle } from "lucide-react";
import { useEffect, useRef, useState } from "react";


interface Props {
  onConfirm: (comment: { text: string; emoji: string }) => void;
  onOpen: () => void;
  onUpdate?: () => void;
  onCopy?: () => void;
  onAskAI?: () => void;
}

export const Tip: React.FC<Props> = ({
  onConfirm,
  onOpen,
  onUpdate,
  onCopy,

}) => {
  const [compact, setCompact] = useState(true);
  const [text, setText] = useState("");
  const [emoji] = useState("");
  const textareaRef = useRef<HTMLTextAreaElement | null>(null);

  useEffect(() => {
    if (onUpdate) {
      onUpdate();
    }
  }, [compact, onUpdate]);

  useEffect(() => {
    if (!compact && textareaRef.current) {
      textareaRef.current.focus();
    }
  }, [compact]);

  const handleSubmit = (event: React.FormEvent) => {
    event.preventDefault();

    onConfirm({ text, emoji });
  };

  return (
    <div>
      {compact ? (
        <div className="bg-white border border-slate-200 shadow-lg">
          <button
            className="p-2 hover:bg-slate-100 rounded text-slate-700"
            onClick={() => {
              onCopy?.();
            }}
            title="Copy"
          >
            <Clipboard size={14} />
          </button>
          <button
            className="p-2 hover:bg-slate-100 rounded text-slate-700"
            onClick={() => {
              setCompact(false);
              onOpen();
            }}
            title="Highlight"
          >
            <Bookmark size={14} />
          </button>
          <button
            className="p-2 hover:bg-slate-100 rounded text-slate-700"
            onClick={() => {
              console.log("applw");
            }}
            title="Ask AI"
          >
            <MessageCircle size={14} />
          </button>
        </div>
      ) : (
        <form className="space-y-2" onSubmit={handleSubmit}>
          <div>
            <Textarea
              placeholder="Enter a comment"
              className="max-w-56 w-56 bg-muted dark:bg-muted/60"
              autoFocus
              value={text}
              onChange={(event) => setText(event.target.value)}
              ref={textareaRef}
            />
            <div></div>
          </div>
          <div className="flex items-center justify-end bg-muted/90 p-[.5px]">
            <Button size="sm" variant="ghost" className="text-xs ">
              Save
            </Button>
          </div>
        </form>
      )}
    </div>
  );
};
