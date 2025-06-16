import { Skeleton } from "@renderer/components/ui/skeleton";

export default function PapersSkeleton() {
  return (
    <div className="w-full min-h-screen p-2">
      <div className="max-w-full px-6">
        {/* Title and edit button */}
        <div className="flex items-center gap-2 mb-1">
          <Skeleton className="h-10 w-64 rounded" />
          <Skeleton className="h-6 w-6 rounded-full" />
        </div>
        {/* Description */}
        <Skeleton className="h-5 w-80 mb-4 rounded" />
        {/* Authors */}
        <div className="mb-4">
          <div className="flex items-center">
            <Skeleton className="h-4 w-16 mb-2 rounded" />
            <div className="mx-4 flex-grow">
              <Skeleton className="h-1 w-full rounded" />
            </div>
          </div>
          <div className="flex flex-wrap gap-2">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="h-8 w-24 rounded-full" />
            ))}
          </div>
        </div>
        {/* Items header */}
        <div className="mb-3">
          <div className="flex items-center">
            <Skeleton className="h-4 w-16 rounded" />
            <div className="mx-4 flex-grow">
              <Skeleton className="h-1 w-full rounded" />
            </div>
            <Skeleton className="h-8 w-20 rounded" />
          </div>
        </div>
        {/* Paper cards grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
          {[...Array(6)].map((_, i) => (
            <Skeleton key={i} className="h-40 w-full rounded-xl" />
          ))}
        </div>
      </div>
    </div>
  );
}
