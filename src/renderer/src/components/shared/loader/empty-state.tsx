"use client";

import { FolderOpen } from "lucide-react";
import { Button } from "../../ui/button";

interface EmptyStateProps {
  title?: string;
  description?: string;
  actionLabel?: string;
  onAction?: () => void;
}

export function EmptyState({
  title = "No items found",
  description = "There are no items to display at the moment.",
  actionLabel,
  onAction,
}: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center h-screen p-8 text-center border rounded-lg bg-background">
      <div className="flex h-20 w-20 items-center justify-center rounded-full bg-muted mb-4">
        <FolderOpen className="h-10 w-10 text-muted-foreground" />
      </div>
      <h3 className="text-lg font-medium mb-2">{title}</h3>
      <p className="text-sm text-muted-foreground max-w-md mb-6">
        {description}
      </p>
      {actionLabel && onAction && (
        <Button onClick={onAction}>{actionLabel}</Button>
      )}
    </div>
  );
}
