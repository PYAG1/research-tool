import { DownloadIcon, SidebarIcon } from '@phosphor-icons/react'
import ThemeSwitcher from '@renderer/components/shared/theme'
import {
  Breadcrumb,
  BreadcrumbItem,
  BreadcrumbLink,
  BreadcrumbList,
  BreadcrumbPage,
  BreadcrumbSeparator
} from '@renderer/components/ui/breadcrumb'
import { Button } from '@renderer/components/ui/button'
import { RichTextEditor } from '@renderer/components/ui/rich-text-editor'
import { useSidebar } from '@renderer/components/ui/sidebar'
import { Switch } from '@renderer/components/ui/switch'
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from '@renderer/components/ui/tooltip'
import { toJSONContent } from '@renderer/lib'
import {
  GetNotebookById,
  UpdateNotebook
} from '@renderer/services/notebooks'
import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query'
import { useRouter } from '@tanstack/react-router'
import { Editor, JSONContent } from '@tiptap/react'
import { useCallback, useEffect, useMemo, useState } from 'react'
import { toast } from 'sonner'
import EditNoteBook from './edit-notebook'

// Local storage key for auto-save preference
const AUTO_SAVE_STORAGE_KEY = 'notebook-autosave-enabled'

export default function Notebook({ id, onEditorMount }: { 
  id: string;
  onEditorMount?: (editor: Editor) => void;
}) {
  const queryClient = useQueryClient()
  const router = useRouter()
  const { toggleSidebar } = useSidebar()
  const handleNavBack = () => router.history.back()
  
  const {
    data: notebookData,
    isLoading,
    error
  } = useQuery({
    queryKey: ['notebook', id],
    queryFn: () => GetNotebookById(id),
    enabled: !!id,
    staleTime: 60000
  })
  const notebook = useMemo(() => notebookData?.data ?? null, [notebookData])
  const [content, setContent] = useState<JSONContent>({ type: "doc", content: [{ type: "paragraph" }] })
  
  // Initialize auto-save state from localStorage
  const [autoSaveEnabled, setAutoSaveEnabled] = useState(() => {
    const savedPreference = localStorage.getItem(AUTO_SAVE_STORAGE_KEY)
    return savedPreference === null ? true : savedPreference === 'true'
  })

  // Update localStorage when auto-save preference changes
  useEffect(() => {
    localStorage.setItem(AUTO_SAVE_STORAGE_KEY, autoSaveEnabled.toString())
  }, [autoSaveEnabled])
  
  // Set initial content when notebook data loads
  useEffect(() => {
    if (notebook?.content) {
      setContent(toJSONContent(notebook.content))
    }
  }, [notebook])

  const { mutateAsync: updateNotebook } = useMutation({
    mutationFn: UpdateNotebook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notebook', id] })
    },  })

  // Note: Delete mutation is defined but not used in this component
  // It would be used for a delete button in the UI

  const handleSave = useCallback(async () => {
    toast.promise(updateNotebook({
      id, notebook: {content}
    }), {
      loading: "Save Changes. Please wait.",
      success: "Changes saved successfully",
      error: (err) => err?.message ?? "Something went wrong"
    })
  }, [updateNotebook, id, content]);

  // Save on Ctrl+S / Cmd+S
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const isMac = /macintosh|mac os x/i.test(navigator.userAgent);
      const isSaveShortcut = (isMac && e.metaKey) || (!isMac && e.ctrlKey);

      if (isSaveShortcut && e.key.toLowerCase() === "s") {
        e.preventDefault();
        handleSave();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [handleSave]);

  // Auto-save with debounce
  useEffect(() => {
    if (!autoSaveEnabled || !id || !notebook?.content) return
  
    const timer = setTimeout(() => {
      const currentContent = JSON.stringify(content)
      const savedContent = JSON.stringify(toJSONContent(notebook.content))
      
      if (currentContent !== savedContent) {
        updateNotebook({
          id, notebook: {content}
        }).catch(err => {
          console.error('Auto-save failed:', err)
        })
      }
    }, 2000) // 2 second debounce
  
    return () => clearTimeout(timer)
  }, [content, id, notebook?.content, autoSaveEnabled, updateNotebook])

  if (isLoading) return <div className="p-8">Loading...</div>
  if (error || !notebook) return <div className="p-8 text-red-500">Notebook not found.</div>

  const toggleAutoSave = () => setAutoSaveEnabled(prev => !prev)
console.log("NOTEBOOOk",id)
  return (
    <div>
      <header className="w-full flex flex-col gap-2 px-6 py-2 bg-card shadow-sm border-b border-border sticky top-0 z-10">
        <div className="flex items-center justify-between w-full">
          <Breadcrumb>
            <BreadcrumbList>
              <BreadcrumbItem>
                <BreadcrumbLink className="cursor-pointer" onClick={handleNavBack}>
                  My Library
                </BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbLink href="#">{notebook?.category?.name || "Uncategorized"}</BreadcrumbLink>
              </BreadcrumbItem>
              <BreadcrumbSeparator />
              <BreadcrumbItem>
                <BreadcrumbPage>{notebookData?.data?.title}</BreadcrumbPage>
              </BreadcrumbItem>
            </BreadcrumbList>
          </Breadcrumb>
          <div className="flex gap-2 items-center">
            <TooltipProvider>
              <Tooltip>
                <TooltipTrigger asChild>
                  <div className="flex items-center gap-2">
                    <span className="text-xs text-muted-foreground">Auto-save</span>
                    <Switch 
                      checked={autoSaveEnabled} 
                      onCheckedChange={toggleAutoSave}
                      aria-label="Toggle auto-save"
                    />
                  </div>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{autoSaveEnabled ? 'Auto-save is enabled' : 'Auto-save is disabled'}</p>
                </TooltipContent>
              </Tooltip>
            </TooltipProvider>
            
            <EditNoteBook title={notebook?.title} id={id}/>
            <Button 
              size="icon" 
              variant="outline" 
              className="rounded-full" 
              aria-label="Download"
            >
              <DownloadIcon className="w-5 h-5" />
            </Button>

            <ThemeSwitcher />
            <Button
              size="icon"
              variant="outline"
              className="rounded-full"
              aria-label="Toggle sidebar"
              onClick={toggleSidebar}
            >
              <SidebarIcon className="w-5 h-5" />
            </Button>
          </div>
        </div>
      </header>      <div className="py-10 px-4 flex flex-col gap-8">
        <div>          <RichTextEditor
            content={content}
            onUpdate={setContent}
            editable={true}
            className="min-h-[300px]"
            onMount={onEditorMount}
          />
        </div>
      </div>
    </div>
  )
}


