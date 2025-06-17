"use client";

import { useState, useEffect, useMemo } from "react";
import { Search, FileText } from "lucide-react";
import { Button } from "@renderer/components/ui/button";
import { Input } from "@renderer/components/ui/input";
import {
  Dialog,
  DialogContent,
  DialogHeader,
} from "@renderer/components/ui/dialog";
import { Badge } from "@renderer/components/ui/badge";
import { Separator } from "@renderer/components/ui/separator";
import { GetAllPapers } from "@renderer/services/papers";
import { useQuery } from "@tanstack/react-query";
import { DataStateWrapper } from "@renderer/components/shared/loader";
import { useNavigate } from "@tanstack/react-router";


export default function ResearchPaperSearch() {
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [debouncedSearchQuery, setDebouncedSearchQuery] = useState("");
  const nav = useNavigate();
  const {
    data: papers,
    isFetching,
    error,
  } = useQuery({
    queryKey: ["papers", debouncedSearchQuery],
    queryFn: async () => {
      const result = await GetAllPapers({ search: debouncedSearchQuery });
      return result.data;
    },
    enabled: isSearchOpen,
    staleTime: 5 * 60 * 1000,
    refetchOnWindowFocus: false,
  });

  const memoizedPapers = useMemo(() => papers, [papers]);

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.metaKey || e.ctrlKey) && e.key === "k") {
        e.preventDefault();
        setIsSearchOpen(true);
      }
      if (e.key === "Escape") {
        setIsSearchOpen(false);
      }
    };

    document.addEventListener("keydown", handleKeyDown);
    return () => document.removeEventListener("keydown", handleKeyDown);
  }, []);

  useEffect(() => {
    const timer = setTimeout(() => {
      setDebouncedSearchQuery(searchQuery);
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

  return (
    <div>
      <div className="flex justify-center p-4">
        <Button
          variant="outline"
          className="relative h-9 w-full max-w-md justify-start rounded-[0.5rem] text-sm font-normal text-muted-foreground shadow-none sm:pr-12"
          onClick={() => setIsSearchOpen(true)}
        >
          <Search className="mr-2 h-4 w-4" />
          <span>Search research papers...</span>
          <kbd className="pointer-events-none absolute right-[0.3rem] top-[0.3rem] hidden h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
            <span className="text-xs">⌘</span>K
          </kbd>
        </Button>
      </div>

      <Dialog open={isSearchOpen} onOpenChange={setIsSearchOpen}>
        <DialogContent className="max-w-2xl p-0" hideCloseButton>
          <DialogHeader className="p-4 pb-0">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder="Search research papers..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 pr-16 h-12 text-base border-0 focus-visible:ring-0 bg-transparent"
                autoFocus
              />
              <div className="absolute right-3 top-1/2 -translate-y-1/2">
                <Badge variant="outline" className="text-xs">
                  ESC
                </Badge>
              </div>
            </div>
          </DialogHeader>

          <Separator />

          <div className="max-h-96 overflow-y-auto p-4">
            <DataStateWrapper
              data={memoizedPapers}
              isLoading={isFetching}
              error={error instanceof Error ? error : null}
              errorComponent={(error) => (
                <div className="text-center py-4 text-red-500">
                  {error.message}
                </div>
              )}
              noDataComponent={
                debouncedSearchQuery ? (
                  <div className="text-center py-8">
                    <Search className="mx-auto h-8 w-8 text-muted-foreground mb-2" />
                    <div className="text-sm text-muted-foreground">
                      No research papers found for "{debouncedSearchQuery}"
                    </div>
                  </div>
                ) : (
                  <div className="text-center py-8">
                    <div className="text-sm text-muted-foreground">
                      Start typing to search for research papers
                    </div>
                  </div>
                )
              }
            >
              {(papers) => (
                <div className="space-y-2">
                  <div className="text-sm font-medium text-muted-foreground">
                    Research Papers ({papers.length})
                  </div>
                  <div className="space-y-1">
                    {papers.map((paper) => (
                      <button
                        key={paper.id}
                        className="flex w-full text-left items-center space-x-3 rounded-md p-2 hover:bg-muted cursor-pointer"
                        onClick={() => {
                          nav({ to: `/pdf/${paper.id}` });
                          setIsSearchOpen(false);
                        }}
                      >
                        <div className="flex h-8 w-8 items-center justify-center rounded-md bg-muted">
                          <FileText className="h-4 w-4" />
                        </div>
                        <div className="flex-1 space-y-1">
                          <div className="text-sm font-medium">
                            {paper.title}
                          </div>
                          <div className="flex items-center text-xs text-muted-foreground">
                            {paper.category ? (
                              <Badge variant="secondary" className="mr-2">
                                {paper.category.name}
                              </Badge>
                            ) : (
                              <Badge variant="outline" className="mr-2">
                                Uncategorized
                              </Badge>
                            )}
                            {/* <span>
                              {new Date(paper.created_at).toLocaleDateString()}
                            </span> */}
                          </div>
                        </div>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </DataStateWrapper>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
