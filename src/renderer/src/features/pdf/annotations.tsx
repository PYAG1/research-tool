import { generateText } from "ai";
import { Button } from "@renderer/components/ui/button";
import { Textarea } from "@renderer/components/ui/textarea";
import { useHighlights } from "@renderer/context/highlights";
import { RightSidebarTabProps } from "./pdf-sidebar";
import {  useState } from "react";
import { google } from "@renderer/constants";
import { IHighlight } from "react-pdf-highlighter";

export default function AnnotaionCard({ content }: RightSidebarTabProps) {
  const { highlights, handleDeleteHighlight, handleUpdateHighlight } =
    useHighlights();
  const [loading, setLoading] = useState<{ [key: string]: boolean }>({});
  const [comments, setComments] = useState<{ [key: string]: string }>({});

  async function handleGenerateComment(highlightId: string, highlight: string) {
    setLoading((prev) => ({ ...prev, [highlightId]: true }));
    try {
      const { text } = await generateText({
        model: google("gemini-1.5-flash"),
        prompt: `Your an assistant taking into consideration the context ${content}. Generate a intuitive, clear and concise comment for this ${highlight}`,
      });
      setComments((prev) => ({ ...prev, [highlightId]: text }));
    } catch (error) {
      console.log(error);
      throw new Error(String(error));
    } finally {
      setLoading((prev) => ({ ...prev, [highlightId]: false }));
    }
  }

  const handleCommentChange = (highlightId: string, value: string) => {
    setComments((prev) => ({ ...prev, [highlightId]: value }));
  };

  const getCommentValue = (highlight: IHighlight) => {
    return comments[highlight.id] ?? highlight?.comment?.text ?? "";
  };

  return (
    <div>
      {highlights?.length > 0 ? (
        highlights?.map((highlight) => (
          <div
            key={highlight?.id}
            className="w-full max-w-2xl p-4 min-h-fit bg-background "
          >
            <p className="bg-amber-100 dark:bg-amber-400 w-fit text-black text-sm px-1">
              {highlight?.content?.text}
            </p>
            <div className="w-full pb-3 flex items-center justify-between">
              <p className="text-xs">Annotations / Page</p>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteHighlight(highlight.id)}
              >
                Delete
              </Button>
            </div>
            <div>
              <Textarea
                value={getCommentValue(highlight)}
                onChange={(e) =>
                  handleCommentChange(highlight.id, e.target.value)
                }
                placeholder="Your comments"
                className="max-h-24"
              />
              <div className="w-full flex justify-end pt-3 gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={loading[highlight.id]}
                  onClick={() => {
                    handleGenerateComment(
                      highlight.id,
                      highlight?.content?.text ?? ""
                    );
                  }}
                >
                  {loading[highlight.id] ? "Generating..." : "AI"}
                </Button>
                <Button
                  size="sm"
                  onClick={() =>
                    handleUpdateHighlight(
                      highlight.id,
                      highlight?.position,
                      highlight?.content,
                      { text: getCommentValue(highlight) }
                    )
                  }
                >
                  Save
                </Button>
              </div>
            </div>
          </div>
        ))
      ) : (
        <div className="w-full max-w-2xl p-4 min-h-fit bg-background text-center">
          <p className="text-muted-foreground">No annotations found.</p>
        </div>
      )}
    </div>
  );
}
