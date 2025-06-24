import { BookOpen, Plus } from "lucide-react";
import { Button } from "@renderer/components/ui/button";

interface SourcesEmptyStateProps {
  searchQuery?: string;
  onAddSource?: () => void;
}

/**
 * Empty state component specifically for sources list
 * Shows different messages based on whether user is searching or viewing all sources
 */
export function SourcesEmptyState({ 
  searchQuery, 
  onAddSource 
}: SourcesEmptyStateProps) {
  const isSearching = searchQuery && searchQuery.trim().length > 0;
  
  if (isSearching) {
    return (
      <div className="p-6 text-center text-muted-foreground">
        <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
        <h3 className="text-sm font-medium mb-1">No sources found</h3>
        <p className="text-xs">
          No sources match "{searchQuery}". Try adjusting your search terms.
        </p>
      </div>
    );
  }
  
  return (
    <div className="p-6 text-center text-muted-foreground">
      <BookOpen className="h-12 w-12 mx-auto mb-3 opacity-50" />
      <h3 className="text-sm font-medium mb-1">No sources added yet</h3>
      <p className="text-xs mb-4">
        Add your first source to start building your citation library.
      </p>
      {onAddSource && (
        <Button
          size="sm"
          onClick={onAddSource}
          className="flex items-center gap-2"
        >
          <Plus className="h-3 w-3" />
          Add Source
        </Button>
      )}
    </div>
  );
}
