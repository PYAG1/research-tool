import { SidebarProvider } from '@renderer/components/ui/sidebar'
import { SourcesProvider } from '@renderer/context/sources/sources-context'
import Notebook from '@renderer/features/notebooks/notebook'
import { SourcesSidebar } from '@renderer/features/notebooks/source-sidebar'
import { createFileRoute } from '@tanstack/react-router'
import { useState } from 'react'
import { Editor } from '@tiptap/react'

export const Route = createFileRoute('/notebooks/$id')({
  component: RouteComponent
})

function RouteComponent() {
  const { id } = Route.useParams()
  const [editorInstance, setEditorInstance] = useState<Editor | null>(null)

  return (
    <SidebarProvider extended>
      <SourcesProvider notebookId={id} editor={editorInstance}>
        <div className="flex flex-1 h-full flex-col gap-4 overflow-auto">
          <Notebook id={id} onEditorMount={setEditorInstance} />
        </div>

        <div className="relative">
          <SourcesSidebar variant="floating" id={id} />
        </div>
      </SourcesProvider>
    </SidebarProvider>
  )
}
