import React, { ReactNode } from "react";
import { LoadingState } from "./loading-state";
import { ErrorState } from "./error-state";
import { EmptyState } from "./empty-state";

/**
 * Props for the DataStateWrapper component
 * @template T - The type of data being handled by the component
 */
interface DataStateWrapperProps<T> {
  /** Data to be displayed when available */
  data: T | null | undefined;

  /** Whether the data is currently loading */
  isLoading: boolean;

  /** Error object if there was an error loading the data */
  error?: Error | null;

  /** Component to display when data is loading */
  loadingComponent?: ReactNode;

  /** Component to display when there's an error */
  errorComponent?: ReactNode | ((error: Error) => ReactNode);

  /** Component to display when there's no data */
  noDataComponent?: ReactNode;

  /** Custom function to determine if data is empty */
  isDataEmpty?: (data: T) => boolean;

  /** Function that renders the data when available */
  children: (data: T) => ReactNode;
}

/**
 * A wrapper component that handles different data states (loading, error, no data) gracefully
 *
 * @template T - The type of data being handled by the component
 * @param props - Component props
 * @returns A React component that handles different data states
 *
 * @example
 * ```tsx
 * <DataStateWrapper
 *   data={users}
 *   isLoading={loading}
 *   error={error}
 *   loadingComponent={<Spinner />}
 *   errorComponent={(error) => <ErrorAlert message={error.message} />}
 *   noDataComponent={<NoUsersMessage />}
 * >
 *   {(data) => (
 *     <UserList users={data} />
 *   )}
 * </DataStateWrapper>
 * ```
 */
export function DataStateWrapper<T>({
  data,
  isLoading,
  error,
  loadingComponent = <LoadingState />,
  errorComponent = <ErrorState />,
  noDataComponent = <EmptyState />,
  isDataEmpty = (data: T) => {
    if (Array.isArray(data)) {
      return data.length === 0;
    }
    if (typeof data === "object" && data !== null) {
      return Object.keys(data).length === 0;
    }
    return false;
  },
  children,
}: DataStateWrapperProps<T>): React.ReactElement {
  // Handle loading state
  if (isLoading) {
    return <>{loadingComponent}</>;
  }

  // Handle error state
  if (error) {
    return (
      <>
        {typeof errorComponent === "function"
          ? errorComponent(error)
          : errorComponent}
      </>
    );
  }

  // Handle no data state
  if (data === null || data === undefined || isDataEmpty(data)) {
    return <>{noDataComponent}</>;
  }

  // Render children with data
  return <>{children(data)}</>;
}
