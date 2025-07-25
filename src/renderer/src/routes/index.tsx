import { LoginForm } from '@renderer/features/auth/login';
import { createFileRoute, Link } from '@tanstack/react-router';
import { GalleryVerticalEnd } from "lucide-react";
export const Route = createFileRoute('/')({
  component: RouteComponent,
})

function RouteComponent() {
  return (
        <div className="flex flex-col items-center justify-center gap-6 bg-background p-6 md:p-10">
      <div className="flex w-full max-w-sm flex-col gap-6">
        <div className="flex items-center gap-2 self-center font-medium">
          <div className="flex h-6 w-6 items-center justify-center rounded-md bg-primary text-primary-foreground">
            <GalleryVerticalEnd className="size-4" />
          </div>
          Acme Inc.
        </div>
        <Link
       to="/category/unsorted"
          className="text-sm text-primary underline self-center"
        >
          About
        </Link>

        <LoginForm />
      </div>
    </div>
  )
}
