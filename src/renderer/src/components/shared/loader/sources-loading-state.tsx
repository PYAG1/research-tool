import { FileText } from "lucide-react";
import { Skeleton } from "@renderer/components/ui/skeleton";

/**
 * Loading state component specifically for sources list
 * Shows skeleton placeholders that match the actual source items
 */
export function SourcesLoadingState() {
  return (
    <div className="space-y-1 p-2">
      {/* Loading header */}
      <div className="px-2 py-1">
        <Skeleton className="h-4 w-24" />
      </div>
        {/* Loading source items */}
      {[1, 2, 3].map((item) => (
        <div key={`skeleton-item-${item}`} className="border rounded-md p-3 mb-3">
          <div className="flex items-start justify-between gap-2">
            <div className="flex-1 min-w-0">
              {/* Icon and badge area */}
              <div className="flex items-center gap-2 mb-2">
                <FileText className="h-4 w-4 flex-shrink-0 opacity-50" />
                <Skeleton className="h-4 w-12" />
              </div>
              
              {/* Title */}
              <Skeleton className="h-4 w-full mb-1" />
              <Skeleton className="h-3 w-3/4 mb-1" />
              
              {/* Authors */}
              <Skeleton className="h-3 w-2/3 mb-1" />
              
              {/* Publication info */}
              <Skeleton className="h-3 w-1/2 mb-2" />
              
              {/* Action buttons */}
              <div className="flex flex-wrap gap-1 mt-2">
                <Skeleton className="h-6 w-20" />
                <Skeleton className="h-6 w-6" />
              </div>
            </div>
            
            {/* More menu button */}
            <Skeleton className="h-6 w-6 flex-shrink-0" />
          </div>
        </div>
      ))}
    </div>
  );
}
