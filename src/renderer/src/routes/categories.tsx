import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import { queryKey } from "@renderer/constants";
import { GetAllCategories } from "@renderer/services/category";
import { useQuery } from "@tanstack/react-query";
import { createFileRoute, Link, useRouter } from '@tanstack/react-router';
import { ArrowLeft, Search, X } from "lucide-react";
import { useEffect, useState } from "react";

import { DataStateWrapper } from "@renderer/components/shared/loader";
import { Skeleton } from "@renderer/components/ui/skeleton";

export const Route = createFileRoute('/categories')({
  component: RouteComponent,
})





export default function RouteComponent() {
  const [searchValue, setSearchValue] = useState("");
  const [debouncedSearch, setDebouncedSearch] = useState("");
const router = useRouter();


  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearch(searchValue);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchValue]);

  const { data, isLoading, error } = useQuery({
    queryKey: [queryKey.categories, debouncedSearch],
    queryFn: () => GetAllCategories({ search: debouncedSearch }),
    staleTime: 1000 * 60 * 5, // 5 minutes
  });

  const handleClearSearch = () => {
    setSearchValue("");
  };

  const handleBack = () => {
    router.history.back();
  };
  const loadingComponent = (
    <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
      {Array(12)
        .fill(0)
        .map((_, index) => (
          <div key={index} className="rounded-lg border bg-card p-6">
            <div className="space-y-3">
              <Skeleton className="h-12 w-12 rounded-lg" />
              <div className="space-y-3">
                <Skeleton className="h-4 w-2/3 rounded" />
                <div className="space-y-1">
                  <Skeleton className="h-3 w-full rounded" />
                  <Skeleton className="h-3 w-3/4 rounded" />
                </div>
              </div>
            </div>
          </div>
        ))}
    </div>
  );

  const noDataComponent = (
    <div className="mt-12 text-center space-y-4">
      <div className="h-24 w-24 mx-auto rounded-full bg-muted flex items-center justify-center">
        <Search className="h-8 w-8 text-muted-foreground" />
      </div>
      <div className="space-y-2">
        <h3 className="text-lg font-semibold">No results found</h3>
        <p className="text-muted-foreground">
          {debouncedSearch
            ? `Try adjusting your search terms or `
            : "There are no categories available. "}
          {debouncedSearch && (
            <Button
              variant="link"
              className="p-0 h-auto font-normal"
              onClick={handleClearSearch}
            >
              clear the search
            </Button>
          )}
          {debouncedSearch && " to see all categories."}
        </p>
      </div>
    </div>
  );

  return (
    <div className="w-full min-h-screen bg-background">
      {/* Header Section */}
      <div className="sticky top-0 z-10 bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60 border-b">
        <div className="container mx-auto px-4 py-4">
          {/* Back Button */}
          <div className="mb-6 absolute left-4 top-4">
            <Button
              variant="ghost"
              size="sm"
              onClick={handleBack}
              className="gap-2 text-muted-foreground hover:text-foreground"
            >
              <ArrowLeft className="h-4 w-4" />
              Back
            </Button>
          </div>

          {/* Search Bar */}
          <div className="flex justify-center">
            <div className="relative w-full max-w-md">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                type="text"
                placeholder="Search categories..."
                value={searchValue}
                onChange={(e) => setSearchValue(e.target.value)}
                className="pl-10 pr-10 h-11 bg-muted/50 border-muted-foreground/20 max-w-full focus:bg-background transition-colors"
              />
              {searchValue && (
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={handleClearSearch}
                  className="absolute right-1 top-1/2 h-7 w-7 -translate-y-1/2 p-0 hover:bg-muted"
                >
                  <X className="h-4 w-4" />
                  <span className="sr-only">Clear search</span>
                </Button>
              )}
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container mx-auto px-4 py-8">
        <div className="text-center space-y-4">
          <h1 className="text-3xl font-bold tracking-tight">All Categories</h1>
          <p className="text-muted-foreground max-w-2xl mx-auto">
            Discover and explore all available categories. Use the search bar
            above to quickly find what you're looking for.
          </p>
        </div>

        <DataStateWrapper
          data={data?.data}
          isLoading={isLoading}
          error={error instanceof Error ? error : null}
          loadingComponent={loadingComponent}
          noDataComponent={noDataComponent}
        >
          {(categories) => (
            <div className="mt-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
              {categories.map((category) => (
                <Link
                  to="/category/$id"
                  params={{ id: category.id }}
                  key={category.id}
                  className="group cursor-pointer relative overflow-hidden rounded-lg border bg-card min-h-48 p-6 hover:shadow-md transition-all duration-200 hover:border-primary/20"
                >
                  <div className="space-y-3">
                    <div
                      className="h-12 w-12 rounded-lg flex items-center justify-center"
                      style={{ backgroundColor: `${category.color}20` }}
                    >
                      <div
                        className="h-6 w-6 rounded"
                        style={{ backgroundColor: category.color }}
                      />
                    </div>
                    <div className="space-y-1">
                      <h3 className="font-semibold text-sm">{category.name}</h3>
                      <p className="text-xs text-muted-foreground">
                        {category.description ?? "No description available"}
                      </p>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </DataStateWrapper>
      </div>
    </div>
  );
}
