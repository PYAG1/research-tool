import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { DataStateWrapper } from "@renderer/components/shared/loader";
import { queryKey } from "@renderer/constants";
import PaperCard from "@renderer/features/papers/paper-card";
import { GetAllPapers } from "@renderer/services/papers";
import { GetAllCategories } from "@renderer/services/category";
import type { Database } from '@renderer/types/database';

export const Route = createFileRoute('/trash')({
  component: RouteComponent,
})

type Category = Database['public']['Tables']['category']['Row'];

function RouteComponent() {
  // Trashed papers
  const { data: papersData, isLoading: isLoadingPapers, error: errorPapers } = useQuery({
    queryKey: [queryKey.papers, "trash"],
    queryFn: async function () {
      const papers = await GetAllPapers();
      return papers?.data?.filter((paper) => paper.is_deleted);
    },
    staleTime: 60000,
  });

  // Trashed categories (assuming is_deleted or similar field exists)
  const { data: categoriesData, isLoading: isLoadingCategories, error: errorCategories } = useQuery({
    queryKey: [queryKey.categories, "trash"],
    queryFn: async function () {
      const categories = await GetAllCategories();
      // If you have is_deleted, filter by it. Otherwise, adjust as needed.
      return categories?.data?.filter((cat: any) => cat.is_deleted);
    },
    staleTime: 60000,
  });

  const papers = useMemo(() => papersData ?? [], [papersData]);
  const categories = useMemo(() => categoriesData ?? [], [categoriesData]);

  return (
    <div className="w-full min-h-screen p-2">
      <div className="max-w-full px-6">
        <section className="mb-10">
          <h2 className="text-xl font-bold mb-4">Trashed Papers</h2>
          <DataStateWrapper data={papers} isLoading={isLoadingPapers} error={errorPapers}>
            {(data) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {data?.map((paper) => (
                  <PaperCard
                    id={paper.id}
                    pdf_path={paper.pdf_path}
                    key={paper.id}
                    year={paper.created_at ?? ""}
                    category={paper?.category?.name ?? ""}
                    title={paper.title}
                    author={paper.authors ?? []}
                    is_deleted={paper.is_deleted ?? false}
                  />
                ))}
              </div>
            )}
          </DataStateWrapper>
        </section>
        <section>
          <h2 className="text-xl font-bold mb-4">Trashed Categories</h2>
          <DataStateWrapper data={categories} isLoading={isLoadingCategories} error={errorCategories}>
            {(data) => (
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 xl:grid-cols-4 gap-4">
                {data?.map((cat: Category) => (
                  <div key={cat.id} className="p-4 border rounded shadow-sm bg-white flex flex-col gap-2">
                    <div className="font-semibold text-lg">{cat.name}</div>
                    <div className="text-xs text-gray-400">{cat.description}</div>
                  </div>
                ))}
              </div>
            )}
          </DataStateWrapper>
        </section>
      </div>
    </div>
  );
}
  
