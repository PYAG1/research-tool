import { type ClassValue, clsx } from "clsx"
import { IHighlight } from "react-pdf-highlighter";
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


 // Helper function to convert database highlights to PDF Highlighter format
export const transformDatabaseHighlightsToViewerFormat = (
  dbHighlights: any[]
): IHighlight[] => {
  if (!dbHighlights || !Array.isArray(dbHighlights)) return [];

  return dbHighlights.map((highlight) => {
    // Safely parse position data if it's stored as JSON string
    let position;
    try {
      position =
        typeof highlight.position === "string"
          ? JSON.parse(highlight.position)
          : highlight.position;
    } catch (e) {
      console.error("Error parsing position:", e);
      position = {};
    }

    // Transform boundingRect if needed to match Scaled format
    if (position?.boundingRect) {
      const rect = position.boundingRect;
      // If boundingRect is in LTWHP format (left, top, width, height)
      if (rect.left !== undefined && rect.width !== undefined) {
        position.boundingRect = {
          x1: rect.left,
          y1: rect.top,
          x2: rect.left + rect.width,
          y2: rect.top + rect.height,
          width: rect.width,
          height: rect.height,
        };
      }
    }

    // Safely parse content data if stored as JSON string
    let content;
    try {
      content =
        typeof highlight.content === "string"
          ? JSON.parse(highlight.content)
          : highlight.content;
    } catch (e) {
      console.error("Error parsing content:", e);
      content = {};
    }

    // Safely parse comment data if stored as JSON string
    let comment;
    try {
      comment =
        typeof highlight.comment === "string"
          ? JSON.parse(highlight.comment)
          : highlight.comment;
    } catch (e) {
      console.error("Error parsing comment:", e);
      comment = null;
    }

    return {
      id: highlight.id,
      content,
      position,
      comment,
     
    } as IHighlight;
  });
};



/**
 * Converts complex objects to JSON-compatible format
 */
export function prepareDataForDatabase(data: any): any {
  if (data === null || data === undefined) {
    return data;
  }
  
  if (typeof data === 'object') {

    if (Array.isArray(data)) {
      return data.map(item => prepareDataForDatabase(item));
    }
    
   
    const result: Record<string, any> = {};
    for (const key in data) {
      if (Object.hasOwn(data, key)) {
        result[key] = prepareDataForDatabase(data[key]);
      }
    }
    return result;
  }

  return data;
}