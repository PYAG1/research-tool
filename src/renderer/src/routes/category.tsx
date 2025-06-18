import { createFileRoute, Outlet } from '@tanstack/react-router'
import { PlusIcon } from '@phosphor-icons/react'
import { useState } from 'react'
import { SidebarInset, SidebarProvider, SidebarTrigger } from '@renderer/components/ui/sidebar'
import { AppSidebar } from '@renderer/components/ui/app-sidebar'
import { Button } from '@renderer/components/ui/button'
import ThemeSwitcher from '@renderer/components/shared/theme'
import AddDocumentModal from '@renderer/features/papers/add-paper-modal'
import ResearchPaperSearch from '@renderer/features/papers/paper-search'
export const Route = createFileRoute('/category')({
  component: RouteComponent
})

function RouteComponent() {
  const [open, setOpen] = useState(false)
  return (
    <>
      <SidebarProvider>
        <AppSidebar />
        <SidebarInset className="flex flex-col">
          <header className="sticky top-0 z-10 flex h-16 shrink-0 items-center gap-2 justify-between px-4 border-b bg-background">
            <SidebarTrigger className="-ml-1" />

            <div className="flex items-center gap-3">
              <ResearchPaperSearch />
              <Button
                variant="outline"
                className="rounded-full w-8 h-8"
                onClick={() => setOpen(true)}
              >
                <PlusIcon className="w-6 h-6" />
              </Button>
              <ThemeSwitcher />
            </div>
          </header>
          <div className="flex flex-1 flex-col gap-4 p-4 h-full overflow-y-auto">
            <Outlet />
          </div>
        </SidebarInset>
      </SidebarProvider>
      <AddDocumentModal open={open} setOpen={setOpen} />
    </>
  )
}
