import { AlertTriangle, RefreshCw } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Alert, AlertDescription, AlertTitle } from "@renderer/components/ui/alert";

interface SourcesErrorStateProps {
  error?: Error | null;
  onRetry?: () => void;
}

/**
 * Error state component specifically for sources list
 * Provides error information and retry functionality
 */
export function SourcesErrorState({ error, onRetry }: SourcesErrorStateProps) {
  const errorMessage = error?.message || "Failed to load sources";
  
  return (
    <div className="p-4">
      <Alert variant="destructive">
        <AlertTriangle className="h-4 w-4" />
        <AlertTitle>Error Loading Sources</AlertTitle>
        <AlertDescription className="mt-2">
          <p className="mb-3">{errorMessage}</p>
          {onRetry && (
            <Button
              variant="outline"
              size="sm"
              onClick={onRetry}
              className="flex items-center gap-2"
            >
              <RefreshCw className="h-3 w-3" />
              Try Again
            </Button>
          )}
        </AlertDescription>
      </Alert>
    </div>
  );
}
