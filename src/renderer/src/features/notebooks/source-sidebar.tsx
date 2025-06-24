"use client";

import { useSourcesContext, type Source } from "@renderer/context/sources/sources-context";
import { CITATION_FORMATS, CitationFormat } from "@renderer/lib/citation-formatter";
import { useMemo, useState } from "react";
import { toast } from "sonner";

import { DataStateWrapper } from "@renderer/components/shared/loader";
import { SourcesLoadingState } from "@renderer/components/shared/loader/sources-loading-state";
import { SourcesErrorState } from "@renderer/components/shared/loader/sources-error-state";
import { SourcesEmptyState } from "@renderer/components/shared/loader/sources-empty-state";
import { Badge } from "@renderer/components/ui/badge";
import { Button } from "@renderer/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
} from "@renderer/components/ui/dialog";
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from "@renderer/components/ui/dropdown-menu";
import { Input } from "@renderer/components/ui/input";
import { Label } from "@renderer/components/ui/label";
import { ScrollArea } from "@renderer/components/ui/scroll-area";
import { Separator } from "@renderer/components/ui/separator";
import {
  Sidebar,
  SidebarContent,
  SidebarHeader,
} from "@renderer/components/ui/sidebar";
import { cn } from "@renderer/lib/utils";
import {
  BookOpen,
  Copy,
  Edit,
  ExternalLink,
  FileText,
  Globe,
  Mic,
  MoreHorizontal,
  Plus,
  Search,
  Trash2,
  Video
} from "lucide-react";

// Source type icon mapping
const sourceTypeIcons = {
  book: BookOpen,
  website: Globe,
  article: FileText,
  video: Video,
  podcast: Mic,
  paper: FileText,
  other: FileText,
};

// Source type color mapping
const sourceTypeColors = {
  book: "bg-blue-100 text-blue-800 dark:bg-blue-900 dark:text-blue-300",
  website: "bg-green-100 text-green-800 dark:bg-green-900 dark:text-green-300",
  article: "bg-purple-100 text-purple-800 dark:bg-purple-900 dark:text-purple-300",
  video: "bg-red-100 text-red-800 dark:bg-red-900 dark:text-red-300",
  podcast: "bg-orange-100 text-orange-800 dark:bg-orange-900 dark:text-orange-300",
  paper: "bg-indigo-100 text-indigo-800 dark:bg-indigo-900 dark:text-indigo-300",
  other: "bg-gray-100 text-gray-800 dark:bg-gray-900 dark:text-gray-300",
};

export function SourcesSidebar({
  id,
  ...props
}: React.ComponentProps<typeof Sidebar> & { id: string }) {
  const [searchQuery, setSearchQuery] = useState("");
  const [isAddDialogOpen, setIsAddDialogOpen] = useState(false);  const [editingSource, setEditingSource] = useState<Source | null>(null);
  const [newSource, setNewSource] = useState<Partial<Source>>({
    type: "website",
    title: "",
    authors: [],
  });  // Use SourcesContext instead of direct API calls
  const { 
    sources, 
    isLoading, 
    error, 
    citationFormat,
    setCitationFormat,
    insertCitation,
    createSource,
    updateSource,
    deleteSource
  } = useSourcesContext();


  console.log(sources,isLoading)

  // Filter sources based on search query
  const filteredSources = useMemo(() => 
    sources.filter(source => 
      source?.title.toLowerCase().includes(searchQuery.toLowerCase()) || 
      source?.authors?.some((author: string) => 
        author.toLowerCase().includes(searchQuery.toLowerCase())
      )
    ), 
  [sources, searchQuery]);
  const handleAddSource = async () => {
    if (!newSource.title?.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      await createSource({
        title: newSource.title,
        authors: newSource.authors ?? [],
        type: newSource.type ?? "website",
        publication: newSource.publication ?? null,
        publication_date: newSource.publication_date ?? null,
        url: newSource.url ?? null,
        doi: newSource.doi ?? null,
        paper_id: null,
      });
      
      setIsAddDialogOpen(false);
      // Reset form
      setNewSource({ type: "website", title: "", authors: [] });
    } catch (error) {
      console.error("Failed to add source:", error);
    }
  };
  const handleEditSource = (source: Source) => {
    setEditingSource(source);
    setNewSource({
      ...source,
      authors: source.authors ?? [],
    });
    setIsAddDialogOpen(true);
  };
  const handleUpdateSource = async () => {
    if (!editingSource?.id || !newSource.title?.trim()) {
      toast.error("Title is required");
      return;
    }

    try {
      await updateSource(editingSource.id, {
        title: newSource.title,
        authors: newSource.authors ?? [],
        type: newSource.type ?? "website",
        publication: newSource.publication ?? null,
        publication_date: newSource.publication_date ?? null,
        url: newSource.url ?? null,
        doi: newSource.doi ?? null,
      });
      
      setIsAddDialogOpen(false);
      setEditingSource(null);
      // Reset form
      setNewSource({ type: "website", title: "", authors: [] });
    } catch (error) {
      console.error("Failed to update source:", error);
    }
  };

  const handleDeleteSource = async (id: string) => {
    try {
      await deleteSource(id);
    } catch (error) {
      console.error("Failed to delete source:", error);
    }
  };const handleCopySource = (source: Source) => {
    const authorText = source.authors ? ` by ${source.authors.join(", ")}` : "";
    const urlText = source.url ? ` - ${source.url}` : "";
    const sourceText = `${source.title}${authorText}${urlText}`;
    navigator.clipboard.writeText(sourceText);
  };
  const handleInsertCitation = (source: Source) => {
    insertCitation(source.id);
  };  return (
    <Sidebar side="right" variant="floating" {...props}>      <SidebarHeader className="flex-shrink-0 p-3 flex flex-col gap-2 border-b bg-background z-10">
        <div className="flex justify-between items-center">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5" />
            <h2 className="font-semibold">Sources</h2>
          </div>
          
          {/* Citation Format Selector */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="text-xs">
                {CITATION_FORMATS[citationFormat].name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
              {Object.entries(CITATION_FORMATS).map(([format, config]) => (
                <DropdownMenuItem
                  key={format}
                  onClick={() => setCitationFormat(format as CitationFormat)}
                  className={cn(
                    "cursor-pointer",
                    citationFormat === format && "bg-accent"
                  )}
                >
                  <div>
                    <div className="font-medium">{config.name}</div>
                    <div className="text-xs text-muted-foreground">{config.description}</div>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
        
        {/* Citation Format Selector */}
        <div className="flex items-center gap-2 text-sm">
          <Label htmlFor="citation-format" className="text-xs text-muted-foreground">Format:</Label>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" size="sm" className="h-7 text-xs">
                {CITATION_FORMATS[citationFormat].name}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start">
              {Object.entries(CITATION_FORMATS).map(([key, format]) => (
                <DropdownMenuItem
                  key={key}
                  onClick={() => setCitationFormat(key as CitationFormat)}
                  className="text-xs"
                >
                  <div className="flex flex-col">
                    <span className="font-medium">{format.name}</span>
                    <span className="text-muted-foreground">{format.description}</span>
                  </div>
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>
      </SidebarHeader>

      <SidebarContent className="flex flex-col h-full p-0 overflow-hidden flex-1">
        <div className="p-4 space-y-4">
          {/* Search */}
          <div className="relative">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              placeholder="Search sources..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              className="pl-9"
            />
          </div>

          {/* Add Source Button */}
          <Dialog open={isAddDialogOpen} onOpenChange={setIsAddDialogOpen}>
            <DialogTrigger asChild>
              <Button className="w-full" onClick={() => setEditingSource(null)}>
                <Plus className="h-4 w-4 mr-2" />
                Add Source
              </Button>
            </DialogTrigger>
            <DialogContent className="max-w-md max-h-[80vh] overflow-y-auto">
              <DialogHeader>
                <DialogTitle>{editingSource ? "Edit Source" : "Add New Source"}</DialogTitle>
                <DialogDescription>
                  {editingSource ? "Update the source information." : "Add a new source to your collection."}
                </DialogDescription>
              </DialogHeader>
              <div className="space-y-4">
                <div>
                  <Label htmlFor="title">Title *</Label>                  <Input
                    id="title"
                    value={newSource.title ?? ""}
                    onChange={(e) => setNewSource({ ...newSource, title: e.target.value })}
                    placeholder="Source title"
                  />
                </div>
                <div>
                  <Label htmlFor="authors">Authors</Label>
                  <Input
                    id="authors"
                    value={Array.isArray(newSource.authors) ? newSource.authors.join(", ") : ""}
                    onChange={(e) => setNewSource({ 
                      ...newSource, 
                      authors: e.target.value.split(",").map(a => a.trim()).filter(a => a) 
                    })}
                    placeholder="Author names (comma separated)"
                  />
                </div>
                <div>
                  <Label htmlFor="type">Type</Label>                  <select
                    id="type"
                    value={newSource.type ?? "website"}
                    onChange={(e) => setNewSource({ ...newSource, type: e.target.value as Source['type'] })}
                    className="w-full p-2 border rounded-md"
                  >
                    <option value="website">Website</option>
                    <option value="book">Book</option>
                    <option value="article">Article</option>
                    <option value="paper">Paper</option>
                    <option value="video">Video</option>
                    <option value="podcast">Podcast</option>
                    <option value="other">Other</option>
                  </select>
                </div>
                <div>
                  <Label htmlFor="url">URL</Label>                  <Input
                    id="url"
                    value={newSource.url ?? ""}
                    onChange={(e) => setNewSource({ ...newSource, url: e.target.value })}
                    placeholder="https://example.com"
                  />
                </div>
                <div>
                  <Label htmlFor="doi">DOI</Label>
                  <Input
                    id="doi"
                    value={newSource.doi ?? ""}
                    onChange={(e) => setNewSource({ ...newSource, doi: e.target.value })}
                    placeholder="10.xxxx/xxxxx"
                  />
                </div>
                <div>
                  <Label htmlFor="publication">Publication</Label>
                  <Input
                    id="publication"
                    value={newSource.publication ?? ""}
                    onChange={(e) => setNewSource({ ...newSource, publication: e.target.value })}
                    placeholder="Journal or publication name"
                  />
                </div>
                <div>
                  <Label htmlFor="publication_date">Publication Date</Label>
                  <Input
                    id="publication_date"
                    value={newSource.publication_date ?? ""}
                    onChange={(e) => setNewSource({ ...newSource, publication_date: e.target.value })}
                    placeholder="YYYY-MM-DD"
                  />
                </div>
              </div>
              <DialogFooter>
                <Button
                  variant="outline"
                  onClick={() => {
                    setIsAddDialogOpen(false);
                    setEditingSource(null);
                    setNewSource({ type: "website", title: "", authors: [] });
                  }}
                >
                  Cancel
                </Button>
                <Button onClick={editingSource ? handleUpdateSource : handleAddSource}>
                  {editingSource ? "Update" : "Add"} Source
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        </div>
        
        <Separator />

        {/* Sources list */}
        <div className="px-2 py-2">
          <h3 className="px-2 py-1 text-sm font-medium text-muted-foreground">
            Sources ({filteredSources.length})
          </h3>
        </div>        <ScrollArea className="flex-1">
          <DataStateWrapper 
            isLoading={isLoading} 
            data={filteredSources ?? []} 
            error={error as Error | null}
            loadingComponent={<SourcesLoadingState />}
            errorComponent={<SourcesErrorState error={error as Error} />}
            noDataComponent={
              <SourcesEmptyState 
                searchQuery={searchQuery} 
                onAddSource={() => setIsAddDialogOpen(true)} 
              />
            }
          >
            {() => (
              <div className="space-y-1 p-2">                {filteredSources.map((source) => {
                  const IconComponent = sourceTypeIcons[source?.type] ?? FileText;
                  return (
                    <div key={source?.id} className="border rounded-md p-3 mb-3">
                      <div className="flex items-start justify-between gap-2">
                        <div className="flex-1 min-w-0">
                          <div className="flex items-center gap-2 mb-2">
                            <IconComponent className="h-4 w-4 flex-shrink-0" />
                            <Badge variant="secondary" className={cn("text-xs", sourceTypeColors[source?.type])}>
                              {source?.type}
                            </Badge>
                            </div>
                            <h4 className="font-medium text-sm leading-tight mb-1 line-clamp-2">{source?.title}</h4>
                            {source?.authors && source?.authors.length > 0 && (
                              <p className="text-xs text-muted-foreground mb-1">
                                by {Array.isArray(source?.authors) ? source?.authors.join(", ") : source?.authors}
                              </p>
                            )}
                            {source?.publication && (
                              <p className="text-xs text-muted-foreground mb-1">{source?.publication}</p>
                            )}
                            {source?.publication_date && (
                              <p className="text-xs text-muted-foreground mb-2">{source?.publication_date}</p>
                            )}

                            <div className="flex flex-wrap gap-1 mt-2">
                              <Button
                                size="sm"
                                variant="outline"
                                className="h-6 px-2 text-xs"
                                onClick={() => handleInsertCitation(source)}
                              >
                                Insert Citation
                              </Button>                              {source?.url && (
                                <Button
                                  size="sm"
                                  variant="outline"
                                  className="h-6 px-2 text-xs"
                                  onClick={() => source.url && window.open(source.url, '_blank')}
                                >
                                  <ExternalLink className="h-3 w-3" />
                                </Button>
                              )}
                            </div>
                          </div>
                          <DropdownMenu>
                            <DropdownMenuTrigger asChild>
                              <Button variant="ghost" size="sm" className="h-6 w-6 p-0">
                                <MoreHorizontal className="h-3 w-3" />
                              </Button>
                            </DropdownMenuTrigger>
                            <DropdownMenuContent align="end">
                              <DropdownMenuItem onClick={() => handleEditSource(source)}>
                                <Edit className="h-4 w-4 mr-2" />
                                Edit
                              </DropdownMenuItem>
                              <DropdownMenuItem onClick={() => handleCopySource(source)}>
                                <Copy className="h-4 w-4 mr-2" />
                                Copy                              </DropdownMenuItem>
                              <DropdownMenuItem
                                onClick={() => handleDeleteSource(source?.id ?? "")}
                                className="text-destructive"
                              >
                                <Trash2 className="h-4 w-4 mr-2" />
                                Delete
                              </DropdownMenuItem>
                            </DropdownMenuContent>
                          </DropdownMenu>
                        </div>
                      </div>
                    );
                  })}
              </div>
            )}
          </DataStateWrapper>
        </ScrollArea>
      </SidebarContent>
    </Sidebar>
  );
}


