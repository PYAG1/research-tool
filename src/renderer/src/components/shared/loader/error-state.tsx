"use client";

import { AlertTriangle } from "lucide-react";
import { Button } from "../../ui/button";

interface ErrorStateProps {
  title?: string;
  description?: string;
  retryLabel?: string;
  onRetry?: () => void;
  error?: Error | null;
}

export function ErrorState({
  title = "Something went wrong",
  description = "An error occurred while processing your request. Please try again.",
  retryLabel = "Try again",
  onRetry,
  error,
}: ErrorStateProps) {
  return (
    <div className="flex flex-col items-center justify-center min-h-[300px] p-8 text-center border border-red-100 rounded-lg bg-red-50">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-red-100 mb-4">
        <AlertTriangle className="h-10 w-10 text-red-600" />
      </div>
      <h3 className="text-lg font-medium text-red-800 mb-2">{title}</h3>
      <p className="text-sm text-red-600 max-w-md mb-6">{description}</p>
      {error && (
        <div className="p-3 bg-white border border-red-200 rounded-md mb-6 w-full max-w-md overflow-auto">
          <code className="text-xs text-red-500 whitespace-pre-wrap break-all">
            {error.message}
          </code>
        </div>
      )}
      {onRetry && (
        <Button onClick={onRetry} variant="destructive">
          {retryLabel}
        </Button>
      )}
    </div>
  );
}
