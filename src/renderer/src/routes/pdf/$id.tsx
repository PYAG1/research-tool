import { useQuery } from '@tanstack/react-query'
import { createFileRoute, useRouter } from '@tanstack/react-router'
import { Download, Loader2, Sidebar } from 'lucide-react'
import { useCallback, useEffect, useRef } from 'react'
import {
  AreaHighlight,
  Content,
  Highlight,
  IHighlight,
  PdfHighlighter,
  PdfLoader,
  Popup
} from 'react-pdf-highlighter'

import { useSidebar } from '@renderer/components/ui/sidebar'
import { queryKey } from '@renderer/constants'

import { GetPaperById } from '@renderer/services/papers'

import { Button } from '@renderer/components/ui/button'

import ThemeSwitcher from '@renderer/components/shared/theme'
import { useHighlights } from '@renderer/context/highlights'
import 'react-pdf-highlighter/dist/style.css'

import { toast } from 'sonner'

import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@renderer/components/ui/breadcrumb'
import PaperInfoPopover from '@renderer/features/papers/paper-info-popover'
import { Tip } from '@renderer/features/pdf/tip'
import { PdfViewerValidators } from '@renderer/lib/validators'

export const Route = createFileRoute('/pdf/$id')({
  component: RouteComponent,
  validateSearch: PdfViewerValidators
})

const parseIdFromHash = () => document.location.hash.slice('#highlight-'.length)

const resetHash = () => {
  document.location.hash = ''
}

function RouteComponent() {
  const { toggleSidebar } = useSidebar()

  const { id } = Route.useParams()
  const { category, title } = Route.useSearch()
  const {
    highlights,
    loading: isLoadingHighlights,
    handleAddHighlight,
    handleUpdateHighlight
  } = useHighlights()

  const { data: paperData } = useQuery({
    queryKey: [queryKey.paper, id],
    queryFn: () => GetPaperById(id)
  })

  const router = useRouter()

  const scrollViewerTo = useRef<(highlight: IHighlight) => void>(() => {})

  const scrollToHighlightFromHash = useCallback(() => {
    const highlight = getHighlightById(parseIdFromHash())
    if (highlight) {
      scrollViewerTo.current(highlight)
    }
  }, [highlights])

  useEffect(() => {
    window.addEventListener('hashchange', scrollToHighlightFromHash, false)
    return () => {
      window.removeEventListener('hashchange', scrollToHighlightFromHash, false)
    }
  }, [scrollToHighlightFromHash])

  const getHighlightById = (id: string) => {
    return highlights.find((highlight) => highlight.id === id)
  }

  function handleCopy(content: Content) {
    const textToCopy = content.text ?? 'No text selected'
    navigator.clipboard
      .writeText(textToCopy)
      .then(() => {
        toast.success('Text copied to clipboard!')
      })
      .catch((err) => {
        console.error('Failed to copy text:', err)
        toast.error('Failed to copy text to clipboard')
      })
  }

  const handleNavBack = () => router.history.back()

  return (
    <div className="flex flex-col h-screen">
      <header className="w-full flex flex-col gap-2 px-6 py-2 bg-card shadow-sm border-b border-border sticky top-0 z-10">
        <div className="flex items-center justify-between w-full">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink className=" cursor-pointer" onClick={handleNavBack}>
                  My Library
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">{category}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex gap-2 items-center">
            {paperData?.data && <PaperInfoPopover data={paperData.data} id={id} />}

            <Button size="icon" variant="outline" className="rounded-full" aria-label="Download">
              <Download className="w-5 h-5" />
            </Button>
            <ThemeSwitcher />
            <Button
              size="icon"
              variant="outline"
              className="rounded-full"
              aria-label="Add"
              onClick={toggleSidebar}
            >
              <Sidebar className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>

      <div className="w-full flex-1 bg-muted p-10">
        <div
          style={{
            height: '100vh',
            position: 'relative'
          }}
        >
          {isLoadingHighlights ? (
            <div className="flex items-center justify-center w-full h-full">
              <Loader2 className="animate-spin" />
            </div>
          ) : (
            <PdfLoader
              url={paperData?.data.pdf_path as string}
              beforeLoad={
                <div className="flex items-center justify-center w-full h-full">
                  <Loader2 className="animate-spin" />
                </div>
              }
            >
              {(pdfDocument) => (
                <PdfHighlighter
                  pdfDocument={pdfDocument}
                  enableAreaSelection={(event) => event.altKey}
                  onScrollChange={resetHash}
                  scrollRef={(scrollTo) => {
                    scrollViewerTo.current = scrollTo
                    scrollToHighlightFromHash()
                  }}
                  onSelectionFinished={(
                    position,
                    content,
                    hideTipAndSelection,
                    transformSelection
                  ) => (
                    <Tip
                      onOpen={transformSelection}
                      onConfirm={(comment) => {
                        handleAddHighlight({ content, position, comment })
                        hideTipAndSelection()
                      }}
                      onCopy={() => {
                        handleCopy(content)
                        hideTipAndSelection()
                      }}
                    />
                  )}
                  highlightTransform={(
                    highlight,
                    index,
                    setTip,
                    hideTip,
                    viewportToScaled,
                    screenshot,
                    isScrolledTo
                  ) => {
                    const isTextHighlight = !highlight.content?.image
                    const component = isTextHighlight ? (
                      <Highlight
                        isScrolledTo={isScrolledTo}
                        position={highlight.position}
                        comment={highlight.comment}
                      />
                    ) : (
                      <AreaHighlight
                        isScrolledTo={isScrolledTo}
                        highlight={highlight}
                        onChange={(boundingRect) => {
                          handleUpdateHighlight(
                            highlight.id,
                            {
                              boundingRect: viewportToScaled(boundingRect),
                              rects: [],
                              pageNumber: highlight.position.pageNumber
                            },
                            { image: screenshot(boundingRect) }
                          )
                        }}
                      />
                    )
                    return (
                      <Popup
                        popupContent={
                          <div>
                            {highlight.comment?.text && (
                              <div className="flex flex-col gap-2 p-2 bg-muted border-2">
                                <div>{highlight.comment?.text}</div>
                                {/* <Button
                              variant="destructive"
                              size="sm"
                              onClick={() =>
                                handleDeleteHighlight(highlight.id)
                              }
                            >
                              Delete
                            </Button> */}
                              </div>
                            )}
                          </div>
                        }
                        onMouseOver={(popupContent) => setTip(highlight, () => popupContent)}
                        onMouseOut={hideTip}
                        key={index}
                      >
                        {component}
                      </Popup>
                    )
                  }}
                  highlights={highlights}
                />
              )}
            </PdfLoader>
          )}
        </div>
      </div>
    </div>
  )
}
