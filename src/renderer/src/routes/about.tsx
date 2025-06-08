import { createFileRoute } from '@tanstack/react-router'
import { cn } from '../lib'
import { Button } from '@renderer/components/ui/button'

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
