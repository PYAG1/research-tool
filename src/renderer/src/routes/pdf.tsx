import { SidebarProvider } from '@renderer/components/ui/sidebar'
import { HighlightsProvider } from '@renderer/context/highlights'
import { RightSidebar } from '@renderer/features/pdf/pdf-sidebar'
import { createFileRoute, Outlet } from '@tanstack/react-router'

export const Route = createFileRoute('/pdf')({
  component: RouteComponent,

})

function RouteComponent() {
  return    <HighlightsProvider>
      <SidebarProvider extended>
        <div className="flex flex-1 h-full flex-col gap-4 overflow-auto">
       <Outlet/>
        </div>

        <div className="relative">
          <RightSidebar variant="floating" />
        </div>
      </SidebarProvider>
    </HighlightsProvider>
}
