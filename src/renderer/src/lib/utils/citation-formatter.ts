import { Source } from '@renderer/context/sources/sources-context';

/**
 * Formats a citation for display in various contexts
 */
export class CitationFormatter {
  /**
   * Creates a short citation label (e.g., "(Smith, 2023)" or "Short Title")
   */
  static formatShortCitation(source: Source | null, fallbackLabel?: string): string {
    if (!source) return fallbackLabel ?? '[?]';
    
    if (source.authors && source.authors.length > 0) {
      const firstAuthor = source.authors[0];
      if (!firstAuthor) return '[?]';
      
      const authorLastName = firstAuthor.split(' ').pop();
      if (!authorLastName) return '[?]';
      
      if (source.publication_date) {
        const year = source.publication_date.split('-')[0];
        return `(${authorLastName}, ${year})`;
      }
      return `(${authorLastName})`;
    } 
    
    if (source.title) {
      const shortTitle = source.title.length > 30 
        ? `${source.title.substring(0, 30)}...`
        : source.title;
      return `("${shortTitle}")`;
    }
    
    return '[?]';
  }

  /**
   * Creates a full citation string for detailed display
   */
  static formatFullCitation(source: Source | null): string {
    if (!source) return "Unknown source";
    
    let citation = "";
    
    // Author(s)
    if (source.authors && source.authors.length > 0) {
      if (source.authors.length === 1) {
        citation += `${source.authors[0]}`;
      } else if (source.authors.length === 2) {
        citation += `${source.authors[0]} & ${source.authors[1]}`;
      } else {
        citation += `${source.authors[0]} et al.`;
      }
      citation += ". ";
    }
    
    // Year
    if (source.publication_date) {
      citation += `(${source.publication_date.split('-')[0]}). `;
    }
    
    // Title
    if (source.title) {
      citation += `${source.title}. `;
    }
    
    // Publication
    if (source.publication) {
      citation += `${source.publication}. `;
    }
    
    // URL
    if (source.url) {
      citation += `${source.url}`;
    }
    
    // DOI
    if (source.doi) {
      citation += `https://doi.org/${source.doi}`;
    }
    
    return citation.trim();
  }

  /**
   * Creates a citation label for editor insertion (compact format)
   */
  static formatEditorLabel(source: Source | null): string {
    if (!source) return 'Unknown source';

    if (source.authors && source.authors.length > 0 && source.authors[0]) {
      const authorLastName = source.authors[0].split(' ').pop();
      if (source.publication_date) {
        const year = source.publication_date.split('-')[0];
        return `${authorLastName}, ${year}`;
      }
      return authorLastName || 'Unknown author';
    } 
    
    if (source.title) {
      let label = source.title.substring(0, 30);
      if (source.title.length > 30) label += '...';
      return label;
    }
    
    return 'Unknown source';
  }
}
