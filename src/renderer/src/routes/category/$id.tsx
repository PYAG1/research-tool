import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { createFileRoute } from '@tanstack/react-router'
import { CheckIcon, PencilIcon, PlusCircle, XIcon } from 'lucide-react'
import { SetStateAction, useEffect, useMemo, useRef, useState } from 'react'

import { DataStateWrapper } from '@renderer/components/shared/loader'
import { Button } from '@renderer/components/ui/button'
import { Separator } from '@renderer/components/ui/separator'
import { queryKey } from '@renderer/constants'

import AddDocumentModal from '@renderer/features/papers/add-paper-modal'
import PaperCard from '@renderer/features/papers/paper-card'
import PapersSkeleton from '@renderer/features/papers/papers-skeleton-loader'
import { cn } from '@renderer/lib'
import { GetCategoryById, UpdateCategoryMutation } from '@renderer/services/category'
import { toast } from 'sonner'
import AddNotebookModal from '@renderer/features/notebooks/add-notebook-modal'
import NotebookCard from '@renderer/features/notebooks/notebook-card'

export const Route = createFileRoute('/category/$id')({
  component: RouteComponent
})

function RouteComponent() {
  const { id } = Route.useParams()
  const queryClient = useQueryClient()

  const [currentAuthor, setCurrentAuthor] = useState('')
  const [open, setOpen] = useState(false)
  const [notebookModalOpen, setNotebookModalOpen] = useState(false)

  const { data, isLoading, error } = useQuery({
    queryKey: [queryKey.category, id],
    queryFn: function () {
      return GetCategoryById(id)
    },
    enabled: !!id,
    staleTime: 60000
  })
  const { mutateAsync, isPending } = useMutation({
    mutationFn: UpdateCategoryMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey.category, id] })
      queryClient.invalidateQueries({ queryKey: [queryKey.categories] })
    }
  })

  const categories = useMemo(() => {
    return data?.data
  }, [data?.data])
  const authorsWithCounts = useMemo(
    function () {
      if (!categories?.research_papers) return []
      const countMap = new Map()
      categories.research_papers.forEach(function (paper) {
        ;(paper.authors ?? []).forEach(function (author) {
          countMap.set(author, (countMap.get(author) ?? 0) + 1)
        })
      })
      return Array.from(countMap.entries()).map(function ([name, count]) {
        return { name, count }
      })
    },
    [categories?.research_papers]
  )

  const papers = useMemo(() => {
    return categories?.research_papers?.filter((item) => item.is_deleted !== true) ?? []
  }, [categories?.research_papers])

  const filteredPapers = useMemo(() => {
    if (!currentAuthor) return papers
    return papers.filter((paper) => paper.authors?.includes(currentAuthor))
  }, [papers, currentAuthor])

  const [editValue, setEditValue] = useState('')
  const [isEditing, setIsEditing] = useState(false)
  const inputRef = useRef<HTMLInputElement>(null)
  function startEditing() {
    setEditValue(data?.data.name ?? '')
    setIsEditing(true)
  }

  async function saveChanges() {
    try {
      toast.promise(mutateAsync({ data: { name: editValue }, id }), {
        loading: 'Saving...',
        success: 'Category name updated',
        error: (error) => {
          console.error('Error updating category name:', error)
          return 'Failed to update category name'
        }
      })

      setIsEditing(false)
    } catch (error) {
      console.error('Failed to update category name:', error)
    }
  }

  function cancelEditing() {
    setIsEditing(false)
  }

  function handleKeyDown(e: { key: string }) {
    if (e.key === 'Enter') {
      saveChanges()
    } else if (e.key === 'Escape') {
      cancelEditing()
    }
  }

  function handleInputChange(e: { target: { value: SetStateAction<string> } }) {
    setEditValue(e.target.value)
  }

  function handleAuthorClick(authorName: string) {
    setCurrentAuthor(authorName)
  }
  useEffect(
    function () {
      if (isEditing) {
        inputRef.current?.focus()
      }
    },
    [isEditing]
  )

  return (
    <DataStateWrapper
      data={categories}
      loadingComponent={<PapersSkeleton />}
      isLoading={isLoading}
      error={error}
    >
      {(loadedData) => (
        <>
          <div className="max-w-full px-4 py-10 sm:px-6 min-h-screen ">
            <section className="flex flex-col gap-2 pb-5">
              <div className="flex items-center gap-2">
                {isEditing ? (
                  <div className="flex items-center gap-2">
                    <input
                      ref={inputRef}
                      type="text"
                      value={editValue}
                      onChange={handleInputChange}
                      onKeyDown={handleKeyDown}
                      onBlur={saveChanges}
                      disabled={isPending}
                      className="text-4xl font-serif px-2 py-1 border border-gray-300 rounded focus:outline-none focus:border-gray-200"
                    />
                    <button
                      aria-label="Save category name"
                      className="rounded-full w-8 h-8 flex items-center justify-center border border-gray-300 text-green-600 hover:bg-green-50"
                      onClick={saveChanges}
                      disabled={isPending}
                    >
                      <CheckIcon className="w-4 h-4" />
                    </button>
                    <button
                      aria-label="Cancel editing category name"
                      className="rounded-full w-8 h-8 flex items-center justify-center border border-gray-300 text-red-600 hover:bg-red-50"
                      onClick={cancelEditing}
                    >
                      <XIcon className="w-4 h-4" />
                    </button>
                  </div>
                ) : (
                  <>
                    <h1 className="text-4xl font-serif">{loadedData.name}</h1>
                    <button
                      aria-label="Edit category name"
                      title="Edit category name"
                      className="rounded-full w-6 h-6 flex items-center justify-center border border-gray-300 hover:bg-gray-100"
                      onClick={startEditing}
                    >
                      <PencilIcon className="w-3 h-3" />
                    </button>
                  </>
                )}
              </div>
              <p className="text-neutral-400 font-semibold">
                {loadedData.description ??
                  'Category for everything machine learning and deep learning'}
              </p>
            </section>

            <section>
              <div className="flex items-center">
                <div className="text-sm font-medium mb-2 flex gap-2 items-center">
                  <p>Notebooks</p> 
                  <Button size="sm" variant="outline" onClick={() => setNotebookModalOpen(true)}>
                    Create
                  </Button>
                </div>
                <div className="px-4 flex-grow">
                  <Separator className="w-full " />
                </div>
              </div>
              <div className="py-4 grid grid-cols-1 sm:grid-cols-3 lg:grid-cols-4 xl:grid-cols-6 gap-4">
                {!loadedData.notebooks || loadedData.notebooks.length === 0 ? (
                  <span className="text-neutral-600 italic">No notebooks yet.</span>
                ) : (
                  loadedData.notebooks.map((notebook) => (
                    <NotebookCard
                      key={notebook.id}
                      id={notebook.id}
                      title={notebook.title}
                      created_at={notebook.created_at}
                      updated_at={notebook.updated_at}
                    />
                  ))
                )}
              </div>
            </section>

            <section className="py-5 flex flex-col gap-4">
              <div className="flex items-center">
                <div className="text-sm font-medium mb-2">Authors</div>
                <div className="px-4 flex-grow">
                  <Separator className="w-full " />
                </div>
              </div>
              <div className="flex flex-wrap gap-2">
                {authorsWithCounts.length === 0 ? (
                  <span className="text-neutral-600 italic">No authors yet.</span>
                ) : (
                  authorsWithCounts.map((author) => {
                    return (
                      <Button
                        key={author.name}
                        aria-label={`Filter by author ${author.name}`}
                        variant={author.name === currentAuthor ? 'default' : 'outline'}
                        className="flex items-center gap-2 rounded-full border-none"
                        onClick={() => {
                          handleAuthorClick(author.name)
                        }}
                      >
                        {author.name}
                        <span
                          className={cn(
                            author.name == currentAuthor ? 'bg-none' : 'bg-muted',
                            'inline-flex items-center justify-center w-6 h-6 rounded-full text-xs'
                          )}
                        >
                          {author.count}
                        </span>
                      </Button>
                    )
                  })
                )}
                {currentAuthor && authorsWithCounts.length > 0 && (
                  <Button
                    aria-label="Clear author filter"
                    variant="outline"
                    className="flex items-center gap-2 rounded-full border-none"
                    onClick={() => setCurrentAuthor('')}
                  >
                    Clear Filter
                  </Button>
                )}
              </div>
            </section>

            <div className="flex flex-col gap-4">
              <div>
                <div className="flex items-center">
                  <div className="text-sm font-medium">
                    Items <span className="text-muted-foreground">({filteredPapers?.length})</span>
                  </div>
                  <div className="mx-4 flex-grow">
                    <Separator className="w-full" />
                  </div>
                  <Button
                    aria-label="Add new document"
                    variant="ghost"
                    size="sm"
                    className="h-8 px-2"
                    onClick={() => setOpen(true)}
                  >
                    <PlusCircle className="mr-1 h-4 w-4" />
                    Add
                  </Button>
                </div>
              </div>
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4">
                {filteredPapers.length === 0 ? (
                  <span className="text-neutral-600 italic">No research papers yet.</span>
                ) : (
                  filteredPapers.map((paper) => {
                    return (
                      <PaperCard
                        id={paper.id}
                        pdf_path={paper.pdf_path}
                        key={paper.id}
                        year={paper.created_at ?? ''}
                        category={loadedData.name ?? ''}
                        title={paper.title}
                        author={paper.authors ?? []}
                        is_deleted={paper?.is_deleted ?? false}
                      />
                    )
                  })
                )}
              </div>
            </div>
          </div>

          <AddDocumentModal open={open} setOpen={setOpen} category_id={data?.data?.id ?? ''} />
          {data?.data?.id && (
            <AddNotebookModal open={notebookModalOpen} setOpen={setNotebookModalOpen} category_id={data.data.id} />
          )}
        </>
      )}
    </DataStateWrapper>
  )
}
