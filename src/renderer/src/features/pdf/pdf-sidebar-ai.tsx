import { useChat } from "@ai-sdk/react";
import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import { Clock, Send, Square } from "lucide-react";
import moment from "moment";
import { useEffect, useRef } from "react";
import ReactMarkdown from "react-markdown";
import { Button } from "@renderer/components/ui/button";
import { useAuth } from "@renderer/context/auth";
import { cn } from "@renderer/lib";
import {
  AddChatMessage,
  CreateChatSession,
  GetChatMessages,
  GetChatSession,
} from "@renderer/services/rpc/chat-session";
import { toast } from "sonner";
import { RightSidebarTabProps } from "./pdf-sidebar";

export default function PdfSidebarAi({
  content,
  paperId,
}: RightSidebarTabProps) {
  const { session } = useAuth();
  const queryClient = useQueryClient();
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const {
    data: chatSession,
    isLoading: isSessionLoading,
    isError: isSessionError,
    error: sessionError,
  } = useQuery({
    queryKey: ["pdf-ai-chat", paperId],
    queryFn: () =>
      GetChatSession({
        paper_id: paperId,
        user_id: session?.user.id!,
      }),
  });

  const { data: chatMessages, isLoading: isMessagesLoading } = useQuery({
    queryKey: ["pdf-ai-chat-messages", chatSession?.id],
    queryFn: () => GetChatMessages(chatSession?.id!),
    enabled: !!chatSession?.id,
  });

  const { mutate: createSession } = useMutation({
    mutationFn: CreateChatSession,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["pdf-ai-chat", paperId] });
    },
    onError: (error) => {
      toast.error(
        `Failed to create chat session: ${error.message || "Unknown error"}`
      );
    },
  });

  const { mutate: storeChat } = useMutation({
    mutationFn: AddChatMessage,
    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["pdf-ai-chat-messages", chatSession?.id],
      });
    },
  });

  useEffect(() => {
    if (!isSessionLoading && !chatSession?.id) {
      createSession({
        user_id: session?.user.id ?? "",
        paper_id: paperId,
      });
    }
  }, [isSessionLoading, chatSession, createSession, session, paperId]);

  const { messages, input, handleInputChange, handleSubmit, status, stop } =
    useChat({
      id: chatSession?.id ?? "",
      initialMessages: (chatMessages || []).map((msg) => ({
        id: msg.id,
        role: (msg.role ?? "user") as "user" | "assistant",
        content: msg.content ?? "",
        createdAt: msg.created_at ? new Date(msg.created_at) : undefined,
      })),
      sendExtraMessageFields: true,
      api: `${import.meta.env.VITE_SUPABASE_API_URL}/functions/v1/ai-chat`,
      headers: {
        Authorization: `Bearer ${session?.access_token ?? ""}`,
      },
      body: {
        paperContent: content,
        paperId: paperId,
      },
      onFinish(message) {
        const currentUserMessages = messages[messages.length - 2];
        storeChat({
          session_id: chatSession?.id!,
          role: currentUserMessages?.role || "user",
          content: currentUserMessages?.content || "",
          parts: currentUserMessages?.parts || [],
        });
        storeChat({
          session_id: chatSession?.id!,
          role: message.role,
          content: message.content,
          parts: message.parts,
        });
      },
    });

  const isProcessing = status === "submitted" || status === "streaming";

  useEffect(() => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  }, [messages]);

  if (isSessionLoading || isMessagesLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <div className="animate-spin h-8 w-8 border-2 border-primary border-t-transparent rounded-full" />
      </div>
    );
  }

  if (isSessionError) {
    return (
      <div className="p-4 text-red-500">
        Error loading chat session: {sessionError.message}
      </div>
    );
  }

  return (
    <div className="flex h-full flex-col">
      <div
        className="flex-1 overflow-y-auto p-3 space-y-4"
        role="log"
        aria-live="polite"
      >
        {messages.length === 0 ? (
          <div className="p-4 text-center text-muted-foreground">
            Ask questions about this PDF
          </div>
        ) : (
          messages.map((message) => (
            <div
              key={message.id}
              className={cn(
                "max-w-[85%] rounded-lg px-3 py-2 flex justify-between items-start group",
                message.role === "user"
                  ? "ml-auto bg-primary/10"
                  : "mr-auto bg-muted"
              )}
            >
              <div>
                {message.role === "assistant" ? (
                  <ReactMarkdown>{message.content}</ReactMarkdown>
                ) : (
                  <div>{message.content}</div>
                )}
                {message.createdAt && (
                  <span className="text-xs text-muted-foreground">
                    {moment(message.createdAt).fromNow()}
                  </span>
                )}
              </div>
              {/* <Button
                size="icon"
                variant="ghost"
                className="opacity-0 group-hover:opacity-100 transition-opacity"
                onClick={() => {
                  navigator.clipboard.writeText(message.content);
                  toast.success("Message copied to clipboard");
                }}
              >
                <Copy className="h-3 w-3" />
              </Button> */}
            </div>
          ))
        )}
        <div ref={messagesEndRef} />

        {isProcessing && (
          <div className="flex items-center justify-between p-3 border rounded-lg bg-muted/50">
            <div className="flex items-center space-x-2">
              {status === "submitted" && (
                <div className="animate-spin h-4 w-4 border-2 border-primary border-t-transparent rounded-full" />
              )}
              <span className="text-sm text-muted-foreground">
                {status === "submitted" ? "Thinking..." : "Responding..."}
              </span>
            </div>
            <Button
              type="button"
              size="icon"
              className="h-6 w-6 rounded-full bg-destructive/10"
              onClick={stop}
            >
              <Square className="h-3 w-3 text-destructive" />
            </Button>
          </div>
        )}
      </div>

      <div className="border-t bg-background p-3">
        <form onSubmit={handleSubmit} className="flex flex-col space-y-2">
          {/* Suggested Questions */}
          {messages.length === 0 && (
            <div className="flex max-w-full overflow-x-scroll gap-2 mb-2">
              {[
                "Summarize this PDF",
                "What are the key points?",
                "Explain this section",
              ].map((q) => (
                <Button
                  key={q}
                  variant="outline"
                  size="sm"
                  className="text-xs cursor-pointer"
                  onClick={() => {
                    handleInputChange({
                      target: { value: q },
                    } as React.ChangeEvent<HTMLTextAreaElement>);
                    handleSubmit();
                  }}
                >
                  {q}
                </Button>
              ))}
            </div>
          )}

          <div className="flex items-center rounded-md border bg-background p-2">
            <textarea
              placeholder="Ask a question about this PDF..."
              value={input}
              onChange={handleInputChange}
              disabled={status !== "ready"}
              className="flex-1 bg-transparent max-h-32 text-sm outline-none resize-none disabled:opacity-50"
              rows={1}
              onInput={(e) => {
                const target = e.target as HTMLTextAreaElement;
                target.style.height = "auto";
                target.style.height = `${target.scrollHeight}px`;
              }}
              aria-label="Chat input"
            />
            <div className="flex items-center space-x-1">
              {isProcessing ? (
                <Button
                  type="button"
                  size="icon"
                  className="h-6 w-6 rounded-full bg-destructive/10"
                  onClick={stop}
                >
                  <Square className="h-3 w-3 text-destructive" />
                </Button>
              ) : (
                <Button
                  type="submit"
                  size="icon"
                  className="h-6 w-6 rounded-full bg-primary/10"
                  disabled={!input.trim() || status !== "ready"}
                  aria-label="Send message"
                >
                  <Send className="h-3 w-3 text-primary" />
                </Button>
              )}
            </div>
          </div>
        </form>

        <div className="mt-2 flex items-center justify-between text-xs text-muted-foreground">
          <div className="flex items-center space-x-1">
            <Clock className="h-3 w-3" />
            <span>AI Assistant</span>
          </div>
          {isProcessing && (
            <span>
              {status === "submitted" ? "Thinking..." : "Responding..."}
            </span>
          )}
        </div>
      </div>
    </div>
  );
}
