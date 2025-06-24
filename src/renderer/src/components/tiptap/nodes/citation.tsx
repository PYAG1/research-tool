import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@renderer/components/ui/tooltip";
import { useSourcesContext } from "@renderer/context/sources/sources-context";
import { formatShortCitation, formatFullCitation } from "@renderer/lib/citation-formatter";
import { NodeViewProps } from "@tiptap/react";
import React from "react";

export function Citation(props: NodeViewProps) {
  const { node, selected } = props;
  const { id, label } = node.attrs;
  
  // Use try-catch to handle context unavailability gracefully
  let getSourceById: ((id: string) => any) | null = null;
  try {
    const context = useSourcesContext();
    getSourceById = context.getSourceById;
  } catch (error) {
    console.warn('Citation component used outside SourcesProvider:', error);
  }

  const source = React.useMemo(() => {
    if (!id || !getSourceById) return null;
    return getSourceById(id);
  }, [id, getSourceById]);

  // Format short citation text using utility function
  const shortCitation = React.useMemo(() => {
    if (!source) return label ?? '[?]';
    return formatShortCitation(source);
  }, [source, label]);
  
  // Format full citation text for tooltip using utility function
  const fullCitation = React.useMemo(() => {
    if (!source) return "Unknown source";
    return formatFullCitation(source);
  }, [source]);
  
  return (
    <TooltipProvider>
      <Tooltip>        <TooltipTrigger asChild>
          <button
            type="button"
            className={`inline-flex items-center rounded bg-blue-50 px-1.5 py-0.5 text-xs font-medium text-blue-800 dark:bg-blue-900 dark:text-blue-300 border-0 cursor-pointer ${
              selected ? 'ring-2 ring-blue-400' : ''
            }`}
            aria-label={`Citation: ${shortCitation}`}
          >
            {shortCitation}
          </button>
        </TooltipTrigger>
        <TooltipContent>
          <p className="max-w-xs text-sm">{fullCitation}</p>
        </TooltipContent>
      </Tooltip>
    </TooltipProvider>
  );
}
