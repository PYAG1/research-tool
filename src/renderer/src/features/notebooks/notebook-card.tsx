import {
  ContextMenu,
  ContextMenuContent,
  ContextMenuItem,
  ContextMenuLabel,
  ContextMenuSeparator,
  ContextMenuTrigger
} from '@renderer/components/ui/context-menu'
import { Tooltip, TooltipContent, TooltipTrigger } from '@renderer/components/ui/tooltip'
import { DeleteNotebookMutation, UpdateNotebook } from '@renderer/services/notebooks'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { BookOpen, CalendarIcon, Clock, SkullIcon, Trash2 } from 'lucide-react'
import moment from 'moment'
import { toast } from 'sonner'

interface NotebookCardProps {
  id: string
  title: string
  created_at: string
  updated_at: string
}

export default function NotebookCard({ id, title, created_at, updated_at }: NotebookCardProps) {
  const nav = useNavigate()
  const queryClient = useQueryClient()

  // Soft delete (trash)
  const { mutateAsync: trashNotebook } = useMutation({
    mutationFn: UpdateNotebook,
    onSuccess: () => {
      queryClient.invalidateQueries()
    }
  })

  // Permanent delete
  const { mutateAsync: deleteNotebook } = useMutation({
    mutationFn: DeleteNotebookMutation,
    onSuccess: () => {
      queryClient.invalidateQueries()
    }
  })

  const handleOpen = () => {
    nav({ to: '/notebooks/$id', params: { id } })
  }

  const handleTrash = () => {
    toast.promise(trashNotebook(id), {
      loading: 'Trashing notebook...',
      success: 'Notebook moved to trash.',
      error: 'Failed to trash notebook.'
    })
  }

  const handleDelete = () => {
    toast.promise(deleteNotebook(id), {
      loading: 'Deleting notebook...',
      success: 'Notebook deleted.',
      error: 'Failed to delete notebook.'
    })
  }

  const formattedUpdatedAt = moment(updated_at).fromNow()
  const formattedCreatedAt = moment(created_at).format('L')

  return (
    <ContextMenu>
      <ContextMenuTrigger className="group cursor-pointer bg-accent block overflow-hidden rounded-lg border hover:shadow-md transition-all duration-200 hover:border-primary/20 h-60 w-full">
        <div className="p-5 flex flex-col h-full justify-between">
          <div>
            <div className="flex items-center justify-between mb-3">
              <div className="flex items-center gap-2 text-muted-foreground">
                <BookOpen className="h-4 w-4" />
                <span className="text-xs">Notebook</span>
              </div>
            </div>
            <h3 className="font-medium  line-clamp-2 group-hover:text-primary transition-colors">
              {title}
            </h3>
          </div>

          <div className="flex items-center justify-between text-xs text-muted-foreground">
            <div className="flex items-center gap-1">
              <CalendarIcon className="h-3 w-3" />
              <span>{formattedCreatedAt}</span>
            </div>

            <Tooltip>
              <TooltipTrigger asChild>
                <Clock className="h-3 w-3" />
              </TooltipTrigger>
              <TooltipContent className="bg-muted-foreground">
                <span>Updated {formattedUpdatedAt}</span>
              </TooltipContent>
            </Tooltip>
          </div>
        </div>
      </ContextMenuTrigger>
      <ContextMenuContent className="w-48">
        <ContextMenuLabel>Notebook Actions</ContextMenuLabel>
        <ContextMenuSeparator />
        <ContextMenuItem onClick={handleOpen}>
          <BookOpen className="mr-2 h-4 w-4" />
          <span>Open</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={handleTrash}>
          <Trash2 className="mr-2 h-4 w-4" />
          <span>Trash</span>
        </ContextMenuItem>
        <ContextMenuItem onClick={handleDelete}>
          <SkullIcon className="mr-2 h-4 w-4 text-red-400" />
          <span className="text-red-400">Delete</span>
        </ContextMenuItem>
      </ContextMenuContent>
    </ContextMenu>
  )
}
