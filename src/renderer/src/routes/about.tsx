import { Button } from '@renderer/components/ui/button'
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/about')({
  component: RouteComponent,
})

function RouteComponent() {
  return <div className=' bg-amber-600 w-full h-screen'>Hello "/about"!
<Button>
  jnn
</Button>
  </div>
}
