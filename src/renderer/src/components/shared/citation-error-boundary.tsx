import React from 'react';

interface CitationErrorBoundaryProps {
  children: React.ReactNode;
  fallback?: React.ReactNode;
}

interface CitationErrorBoundaryState {
  hasError: boolean;
  error?: Error;
}

/**
 * Error boundary for citation-related components
 * Prevents citation errors from crashing the entire editor
 */
export class CitationErrorBoundary extends React.Component<
  CitationErrorBoundaryProps,
  CitationErrorBoundaryState
> {
  constructor(props: CitationErrorBoundaryProps) {
    super(props);
    this.state = { hasError: false };
  }

  static getDerivedStateFromError(error: Error): CitationErrorBoundaryState {
    return { hasError: true, error };
  }

  componentDidCatch(error: Error, errorInfo: React.ErrorInfo) {
    console.error('Citation Error Boundary caught an error:', error, errorInfo);
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <span className="inline-flex items-center rounded bg-red-50 px-1.5 py-0.5 text-xs font-medium text-red-800 dark:bg-red-900 dark:text-red-300">
            [Citation Error]
          </span>
        )
      );
    }

    return this.props.children;
  }
}
