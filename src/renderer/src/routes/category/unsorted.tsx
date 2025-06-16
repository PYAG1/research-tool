import { createFileRoute } from '@tanstack/react-router'
import { useQuery } from "@tanstack/react-query";
import { useMemo } from "react";
import { DataStateWrapper } from "@renderer/components/shared/loader";
import { queryKey } from "@renderer/constants";

import { GetAllPapers } from "@renderer/services/papers";
import PaperCard from '@renderer/features/papers/paper-card';
export const Route = createFileRoute('/category/unsorted')({
  component: RouteComponent,
})

export default function RouteComponent() {
  const { data, isLoading, error } = useQuery({
    queryKey: [queryKey.papers],
    queryFn: function () {
      return GetAllPapers({ filterNoCategoryId: true });
    },
    staleTime: 60000,
  });

  const papers = useMemo(
    function () {
      return data?.data ?? [];
    },
    [data?.data]
  );
  console.log(error, papers);
  return (
    <DataStateWrapper data={papers} isLoading={isLoading} error={error}>
      {(_data) => (
        <div className="w-full min-h-screen p-2">
          <div className="max-w-full px-6">
            <div>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                {papers?.map(function (paper) {
                  return (
                    <PaperCard
                      id={paper.id}
                      pdf_path={paper.pdf_path}
                      key={paper.id}
                      year={paper.created_at ?? ""}
                      category={"Unsorted"}
                      title={paper.title}
                      author={paper.authors ?? []}
                      is_deleted={paper.is_deleted ?? false}
                    />
                  );
                })}
              </div>
            </div>
          </div>
        </div>
      )}
    </DataStateWrapper>
  );
}
