import { useMutation, useQuery, useQueryClient } from "@tanstack/react-query";
import React, { createContext, useContext, useMemo } from "react";
import { Content, NewHighlight, ScaledPosition } from "react-pdf-highlighter";
import { queryKey } from "@renderer/constants";
import { transformDatabaseHighlightsToViewerFormat } from "@renderer/lib/utils";
import {
  CreateHightLight,
  DeleteHighlight,
  GetHighlightsByPaper,
  UpdateHighlight,
} from "@renderer/services/highlights";
import { Highlight } from "@renderer/types";
import { toast } from "sonner";
import { useParams } from "@tanstack/react-router";

interface HighlightsContextType {
  highlights: Highlight[];
  loading: boolean;
  handleAddHighlight(highlight: NewHighlight): Promise<void>;
  handleDeleteHighlight(highlightId: string): Promise<void>;
  handleUpdateHighlight(
    highlightId: string,
    position: ScaledPosition,
    content: Partial<Content>,
    comment?: { text: string }
  ): Promise<void>;
}

const HighlightsContext = createContext<HighlightsContextType | undefined>(
  undefined
);

export const HighlightsProvider: React.FC<{
  children: React.ReactNode;
}> = ({ children }) => {
const {id}= useParams({strict:false})
const params = id ?? ""
  const queryClient = useQueryClient();

  const { data, isLoading } = useQuery({
    queryKey: [queryKey.highlights, params],
    queryFn: () => GetHighlightsByPaper(params),
    enabled: !!params,
  });

  const highlights = useMemo(() => {
    return transformDatabaseHighlightsToViewerFormat(data || []);
  }, [data]);

  const { mutateAsync: addHighlight } = useMutation({
    mutationFn: (highlight: NewHighlight) => CreateHightLight(highlight, params),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey.highlights, params] });
    },
  });

  const { mutateAsync: updateHighlight } = useMutation({
    mutationFn: ({
      highlightId,
      updates,
    }: {
      highlightId: string;
      updates: any;
    }) => UpdateHighlight(highlightId, updates),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey.highlights, params] });
    },
  });

  const { mutateAsync: deleteHighlight } = useMutation({
    mutationFn: (highlightId: string) => DeleteHighlight(highlightId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey.highlights, id] });
    },
  });

  async function handleAddHighlight(highlight: NewHighlight) {
    toast.promise(addHighlight(highlight), {
      loading: "Adding highlight...",
      success: "Highlight added successfully!",
      error: (err: Error) => `Failed to add highlight: ${err.message}`,
    });
  }

  async function handleUpdateHighlight(
    highlightId: string,
    position: ScaledPosition,
    content: Partial<Content>,
    comment: { text: string } = { text: "" }
  ) {
    toast.promise(
      updateHighlight({
        highlightId,
        updates: { position, content, comment },
      }),
      {
        loading: "Updating highlight...",
        success: "Highlight updated successfully!",
        error: (err: Error) => `Failed to update highlight: ${err.message}`,
      }
    );
  }

  async function handleDeleteHighlight(highlightId: string) {
    toast.promise(deleteHighlight(highlightId), {
      loading: "Deleting highlight...",
      success: "Highlight deleted successfully!",
      error: (err: Error) => `Failed to delete highlight: ${err.message}`,
    });
  }

  const value = useMemo(
    () => ({
      highlights,
      loading: isLoading,
      handleAddHighlight,
      handleDeleteHighlight,
      handleUpdateHighlight,
    }),
    [
      highlights,
      isLoading,
      handleAddHighlight,
      handleDeleteHighlight,
      handleUpdateHighlight,
    ]
  );

  return (
    <HighlightsContext.Provider value={value}>
      {children}
    </HighlightsContext.Provider>
  );
};

export function useHighlights() {
  const context = useContext(HighlightsContext);
  if (!context) {
    throw new Error("useHighlights must be used within a HighlightsProvider");
  }
  return context;
}
