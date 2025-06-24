import { Quote } from "lucide-react";
import React from "react";

import { Button, type ButtonProps } from "@renderer/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@renderer/components/ui/dropdown-menu";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip";
import { useSourcesContext } from "@renderer/context/sources/sources-context";
import { cn } from "@renderer/lib";
import { useToolbar } from "./toolbar-provider";

export const CitationToolbar = React.forwardRef<HTMLButtonElement, ButtonProps>(
  ({ className, onClick, children, ...props }) => {


    const { editor } = useToolbar();
    const { sources, isLoading, insertCitation } = useSourcesContext();

    const handleInsertCitation = (sourceId: string) => {
      insertCitation(sourceId);
      onClick?.(new MouseEvent('click') as unknown as React.MouseEvent<HTMLButtonElement>);
    };

    // Group sources by type for better organization
    const groupedSources = React.useMemo(() => {
      const grouped: Record<string, typeof sources> = {};
      
      sources.forEach(source => {
        if (!grouped[source.type]) {
          grouped[source.type] = [];
        }
        grouped[source.type].push(source);
      });
      
      return grouped;
    }, [sources]);

    return (
      <Tooltip>
        <TooltipTrigger asChild>
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button
                variant="ghost"
                size="icon"
                className={cn("h-8 w-8 p-0 sm:h-9 sm:w-9", className)}
                disabled={!editor?.isEditable || isLoading}
                {...props}
              >
                {children ?? <Quote className="h-4 w-4" />}
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="start" className="w-64">
              {isLoading ? (
                <div className="p-2 text-sm text-muted-foreground">
                  Loading sources...
                </div>
              ) : sources.length === 0 ? (
                <div className="p-2 text-sm text-muted-foreground">
                  No sources available
                </div>
              ) : (
                Object.entries(groupedSources).map(([type, typeSources]) => (
                  <React.Fragment key={type}>
                    <div className="px-2 py-1.5 text-xs font-semibold text-muted-foreground">
                      {type.charAt(0).toUpperCase() + type.slice(1)}
                    </div>
                    {typeSources.map(source => (
                      <DropdownMenuItem
                        key={source.id}
                        onSelect={() => handleInsertCitation(source.id)}
                        className="flex flex-col items-start space-y-1 p-2"
                      >
                        <span className="font-medium">{source.title}</span>
                        {source.authors && source.authors.length > 0 && (
                          <span className="text-xs text-muted-foreground">
                            {source.authors.join(", ")}
                          </span>
                        )}
                      </DropdownMenuItem>
                    ))}
                  </React.Fragment>
                ))
              )}
            </DropdownMenuContent>
          </DropdownMenu>
        </TooltipTrigger>
        <TooltipContent>
          <span>Insert Citation</span>
        </TooltipContent>
      </Tooltip>
    );
  }
);

CitationToolbar.displayName = "CitationToolbar";
