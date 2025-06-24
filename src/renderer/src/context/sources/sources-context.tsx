import React, { createContext, useContext, useCallback } from 'react';
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { Editor } from '@tiptap/react';
import { GetNotebookSources, CreateSource, UpdateSource, DeleteSource, AddSourceToNotebook, RemoveSourceFromNotebook } from '@renderer/services/notebooks/sources';
import { generateCitationLabel, CitationFormat } from '@renderer/lib/citation-formatter';
import { toast } from 'sonner';
import { useAuth } from '@renderer/context/auth';


export interface Source {
  id: string;
  title: string;
  authors: string[] | null;
  type: 'book' | 'website' | 'article' | 'video' | 'podcast' | 'paper' | 'other';
  publication: string | null;
  publication_date: string | null;
  url: string | null;
  doi: string | null;
  user_id: string | null;
  paper_id: string | null;
  created_at?: string;
  updated_at?: string;
}

export type CreateSourceRequest = Omit<Source, 'id' | 'user_id' | 'created_at' | 'updated_at'>;

interface SourcesContextType {
  sources: Source[];
  isLoading: boolean;
  error: unknown;
  citationFormat: CitationFormat;
  setCitationFormat: (format: CitationFormat) => void;
  getSourceById: (id: string) => Source | undefined;
  refreshSources: () => void;
  insertCitation: (sourceId: string) => void;
  createSource: (source: CreateSourceRequest) => Promise<void>;
  updateSource: (id: string, source: Partial<Source>) => Promise<void>;
  deleteSource: (id: string) => Promise<void>;
  addSourceToNotebook: (sourceId: string) => Promise<void>;
  removeSourceFromNotebook: (sourceId: string) => Promise<void>;
}

const initialState: SourcesContextType = {
  sources: [],
  isLoading: true,
  error: null,
  citationFormat: 'simple',
  setCitationFormat: () => {},
  getSourceById: () => undefined,
  refreshSources: () => {},
  insertCitation: () => {},
  createSource: async () => {},
  updateSource: async () => {},
  deleteSource: async () => {},
  addSourceToNotebook: async () => {},
  removeSourceFromNotebook: async () => {},
};

const SourcesContext = createContext<SourcesContextType>(initialState);
SourcesContext.displayName = 'SourcesContext';

export function SourcesProvider({
  children,
  notebookId,
  editor
}: {
  children: React.ReactNode;
  notebookId: string;
  editor: Editor | null;
}) {
  const queryClient = useQueryClient();
  const { user } = useAuth();
  
  // Citation format state
  const [citationFormat, setCitationFormat] = React.useState<CitationFormat>('simple');
  
  // Fetch sources for the notebook
  const { 
    data: sourcesData,
    isLoading,
    error,
    refetch
  } = useQuery({
    queryKey: ['notebook-sources', notebookId],
    queryFn: () => GetNotebookSources(notebookId),
    enabled: !!notebookId,
    staleTime: 60000 // Cache for 1 minute
  });// Extract sources from the response with better null checks
  const sources = React.useMemo(() => {
    if (!sourcesData?.data || !Array.isArray(sourcesData.data)) {
      return [];
    }
    return sourcesData.data
      .map(item => item?.source)
      .filter(source => source != null && typeof source === 'object' && 'id' in source && 'title' in source) as Source[];
  }, [sourcesData]);
  // Mutation for creating a source
  const createSourceMutation = useMutation({
    mutationFn: async (source: CreateSourceRequest) => {
      if (!user?.id) throw new Error("User not authenticated");
      const result = await CreateSource({
        ...source,
        user_id: user.id,
      });
      // Also add it to the notebook
      if (result.data?.id) {
        await AddSourceToNotebook({
          notebook_id: notebookId,
          source_id: result.data.id,
        });
      }
      return result;
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notebook-sources', notebookId] });
      toast.success("Source created successfully");
    },
    onError: (error) => {
      console.error('Failed to create source:', error);
      toast.error("Failed to create source");
    }
  });

  // Mutation for updating a source
  const updateSourceMutation = useMutation({
    mutationFn: ({ id, source }: { id: string; source: Partial<Source> }) => UpdateSource(id, source),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notebook-sources', notebookId] });
      toast.success("Source updated successfully");
    },
    onError: (error) => {
      console.error('Failed to update source:', error);
      toast.error("Failed to update source");
    }
  });

  // Mutation for deleting a source
  const deleteSourceMutation = useMutation({
    mutationFn: (id: string) => DeleteSource(id),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notebook-sources', notebookId] });
      toast.success("Source deleted successfully");
    },
    onError: (error) => {
      console.error('Failed to delete source:', error);
      toast.error("Failed to delete source");
    }
  });

  // Mutation for adding source to notebook
  const addToNotebookMutation = useMutation({
    mutationFn: (sourceId: string) => AddSourceToNotebook({
      notebook_id: notebookId,
      source_id: sourceId,
    }),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notebook-sources', notebookId] });
      toast.success("Source added to notebook");
    },
    onError: (error) => {
      console.error('Failed to add source to notebook:', error);
      toast.error("Failed to add source to notebook");
    }
  });

  // Mutation for removing source from notebook
  const removeFromNotebookMutation = useMutation({
    mutationFn: (sourceId: string) => RemoveSourceFromNotebook(notebookId, sourceId),
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notebook-sources', notebookId] });
      toast.success("Source removed from notebook");
    },
    onError: (error) => {
      console.error('Failed to remove source from notebook:', error);
      toast.error("Failed to remove source from notebook");
    }
  });  // Get a specific source by ID
  const getSourceById = useCallback(
    (id: string): Source | undefined => {
      return sources.find(source => source?.id === id);
    },
    [sources]
  );

  // Function to refresh sources
  const refreshSources = useCallback(() => {
    refetch();
  }, [refetch]);  // Function to insert a citation at the current cursor position
  const insertCitation = useCallback((sourceId: string) => {
    if (!editor?.commands) {
      toast.error("Editor not available");
      return;
    }

    const source = getSourceById(sourceId);
    if (!source) {
      toast.error("Source not found");
      return;
    }    // Create citation label using the utility function with current format
    const label = generateCitationLabel(source, citationFormat);

    // Insert citation mark
    try {
      editor.commands.focus();
      editor.commands.setCitation({
        id: sourceId,
        type: source.type,
        label
      });
      
      toast.success("Citation inserted");
    } catch (error) {
      console.error('Failed to insert citation:', error);
      toast.error("Failed to insert citation");
    }
  }, [editor, getSourceById, citationFormat]);
  // Context functions
  const createSource = useCallback(async (source: CreateSourceRequest) => {
    await createSourceMutation.mutateAsync(source);
  }, [createSourceMutation]);

  const updateSource = useCallback(async (id: string, source: Partial<Source>) => {
    await updateSourceMutation.mutateAsync({ id, source });
  }, [updateSourceMutation]);

  const deleteSource = useCallback(async (id: string) => {
    await deleteSourceMutation.mutateAsync(id);
  }, [deleteSourceMutation]);

  const addSourceToNotebook = useCallback(async (sourceId: string) => {
    await addToNotebookMutation.mutateAsync(sourceId);
  }, [addToNotebookMutation]);

  const removeSourceFromNotebook = useCallback(async (sourceId: string) => {
    await removeFromNotebookMutation.mutateAsync(sourceId);
  }, [removeFromNotebookMutation]);
  const value = React.useMemo(() => ({
    sources,
    isLoading,
    error,
    citationFormat,
    setCitationFormat,
    getSourceById,
    refreshSources,
    insertCitation,
    createSource,
    updateSource,
    deleteSource,
    addSourceToNotebook,
    removeSourceFromNotebook,
  }), [
    sources, 
    isLoading, 
    error,
    citationFormat,
    setCitationFormat,
    getSourceById, 
    refreshSources, 
    insertCitation, 
    createSource, 
    updateSource, 
    deleteSource,    addSourceToNotebook, 
    removeSourceFromNotebook
  ]);

  return (
    <SourcesContext.Provider value={value}>
      {children}
    </SourcesContext.Provider>
  );
}

/**
 * Hook for accessing the sources context. Must be used within a SourcesProvider.
 * Provides access to notebook sources and functions to insert citations.
 * @throws {Error} If used outside of a SourcesProvider
 */
export function useSourcesContext() {
  const context = useContext(SourcesContext);
  if (!context) {
    throw new Error(
      'useSourcesContext must be used within a SourcesProvider component. ' +
      'Wrap a parent component in <SourcesProvider> to fix this error.'
    );
  }
  return context;
}
