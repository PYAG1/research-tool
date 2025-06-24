import { Source } from '@renderer/context/sources/sources-context';

/**
 * Utility functions for formatting citations
 */

export type CitationFormat = 'simple' | 'apa' | 'mla' | 'chicago';

export const CITATION_FORMATS: Record<CitationFormat, { name: string; description: string }> = {
  simple: { name: 'Simple', description: '[Author, Year]' },
  apa: { name: 'APA', description: 'American Psychological Association' },
  mla: { name: 'MLA', description: 'Modern Language Association' },
  chicago: { name: 'Chicago', description: 'Chicago Manual of Style' }
};

/**
 * Generates a short citation label for inline display
 * @param source - The source object
 * @param format - The citation format to use
 * @returns Formatted short citation string
 */
export function formatShortCitation(source: Source, format: CitationFormat = 'simple'): string {
  if (!source) return '[?]';

  try {
    switch (format) {
      case 'simple':
        return formatSimpleCitation(source);
      case 'apa':
        return formatAPACitation(source);
      case 'mla':
        return formatMLACitation(source);
      case 'chicago':
        return formatChicagoCitation(source);
      default:
        return formatSimpleCitation(source);
    }
  } catch (error) {
    console.warn('Error formatting short citation:', error);
    return '[?]';
  }
}

/**
 * Simple citation format: [Author, Year]
 */
function formatSimpleCitation(source: Source): string {
  if (source.authors && source.authors.length > 0) {
    const firstAuthor = source.authors[0];
    if (firstAuthor) {
      const nameParts = firstAuthor.trim().split(' ');
      const authorLastName = nameParts[nameParts.length - 1];
      
      if (authorLastName && source.publication_date) {
        const year = source.publication_date.split('-')[0];
        return `[${authorLastName}, ${year}]`;
      } else if (authorLastName) {
        return `[${authorLastName}]`;
      }
    }
  }
  
  if (source.title) {
    const shortTitle = source.title.length > 20 
      ? `${source.title.substring(0, 20)}...`
      : source.title;
    return `[${shortTitle}]`;
  }
  
  return '[?]';
}

/**
 * APA citation format: (Author, Year)
 */
function formatAPACitation(source: Source): string {
  if (source.authors && source.authors.length > 0) {
    const firstAuthor = source.authors[0];
    if (firstAuthor) {
      const nameParts = firstAuthor.trim().split(' ');
      const authorLastName = nameParts[nameParts.length - 1];
      
      if (authorLastName && source.publication_date) {
        const year = source.publication_date.split('-')[0];
        return `(${authorLastName}, ${year})`;
      } else if (authorLastName) {
        return `(${authorLastName})`;
      }
    }
  }
  
  if (source.title) {
    const shortTitle = source.title.length > 25 
      ? `${source.title.substring(0, 25)}...`
      : source.title;
    return `("${shortTitle}")`;
  }
  
  return '(?)';
}

/**
 * MLA citation format: (Author Page)
 */
function formatMLACitation(source: Source): string {
  if (source.authors && source.authors.length > 0) {
    const firstAuthor = source.authors[0];
    if (firstAuthor) {
      const nameParts = firstAuthor.trim().split(' ');
      const authorLastName = nameParts[nameParts.length - 1];
      
      if (authorLastName) {
        return `(${authorLastName})`;
      }
    }
  }
  
  if (source.title) {
    const shortTitle = source.title.length > 25 
      ? `${source.title.substring(0, 25)}...`
      : source.title;
    return `("${shortTitle}")`;
  }
  
  return '(?)';
}

/**
 * Chicago citation format: (Author Year)
 */
function formatChicagoCitation(source: Source): string {
  if (source.authors && source.authors.length > 0) {
    const firstAuthor = source.authors[0];
    if (firstAuthor) {
      const nameParts = firstAuthor.trim().split(' ');
      const authorLastName = nameParts[nameParts.length - 1];
      
      if (authorLastName && source.publication_date) {
        const year = source.publication_date.split('-')[0];
        return `(${authorLastName} ${year})`;
      } else if (authorLastName) {
        return `(${authorLastName})`;
      }
    }
  }
  
  if (source.title) {
    const shortTitle = source.title.length > 25 
      ? `${source.title.substring(0, 25)}...`
      : source.title;
    return `("${shortTitle}")`;
  }
  
  return '(?)';
}

/**
 * Generates a full citation for display in tooltips or reference lists
 * @param source - The source object
 * @returns Formatted full citation string
 */
export function formatFullCitation(source: Source): string {
  if (!source) return "Unknown source";
  
  try {
    let citation = "";
    
    // Author(s)
    if (source.authors && source.authors.length > 0) {
      const validAuthors = source.authors.filter(author => author && author.trim());
      
      if (validAuthors.length === 1) {
        citation += validAuthors[0];
      } else if (validAuthors.length === 2) {
        citation += `${validAuthors[0]} & ${validAuthors[1]}`;
      } else if (validAuthors.length > 2) {
        citation += `${validAuthors[0]} et al.`;
      }
      
      if (citation) citation += ". ";
    }
    
    // Year
    if (source.publication_date) {
      const year = source.publication_date.split('-')[0];
      citation += `(${year}). `;
    }
    
    // Title
    if (source.title) {
      citation += `${source.title}. `;
    }
    
    // Publication
    if (source.publication) {
      citation += `${source.publication}. `;
    }
    
    // URL or DOI
    if (source.doi) {
      citation += `https://doi.org/${source.doi}`;
    } else if (source.url) {
      citation += source.url;
    }
    
    return citation || "Unknown source";
  } catch (error) {
    console.warn('Error formatting full citation:', error);
    return "Error formatting citation";
  }
}

/**
 * Generates a citation label for editor insertion
 * @param source - The source object
 * @param format - The citation format to use
 * @returns Citation label string
 */
export function generateCitationLabel(source: Source, format: CitationFormat = 'simple'): string {
  return formatShortCitation(source, format);
}
