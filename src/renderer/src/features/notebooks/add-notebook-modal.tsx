import { zodResolver } from '@hookform/resolvers/zod'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { useNavigate } from '@tanstack/react-router'
import { useForm } from 'react-hook-form'

import { Button } from '@renderer/components/ui/button'
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@renderer/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { queryKey } from '@renderer/constants'
import { useAuth } from '@renderer/context/auth'
import { NoteBookSchema, NoteBookSchemaType } from '@renderer/lib'
import { CreateNotebookMutation } from '@renderer/services/notebooks'
import { toast } from 'sonner'
import { ModalProps } from '@renderer/types'

interface AddNotebookModalProps extends ModalProps {

  category_id: string
}




export default function AddNotebookModal({ open, setOpen, category_id }: AddNotebookModalProps) {
  const { user } = useAuth()
  const navigate = useNavigate()
  const queryClient = useQueryClient()

  const form = useForm<NoteBookSchemaType>({
    resolver: zodResolver(NoteBookSchema),
    defaultValues: {
      title: ''
    }
  })

  const { mutateAsync, isPending } = useMutation({
    mutationFn: CreateNotebookMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey.notebooks] })
      queryClient.invalidateQueries({ queryKey: [queryKey.category, category_id] })
      form.reset()
      setOpen(false)
    },
   
  })

  async function onSubmit(data: NoteBookSchemaType) {
    toast.promise(
      mutateAsync({
        title: data.title,
        content: {
          type: 'doc',
          content: [
            {
              type: 'heading',
              attrs: { level: 1 },
              content: [{ type: 'text', text: data.title }]
            },
            {
              type: 'paragraph',
              content: [{ type: 'text', text: '' }]
            }
          ]
        },
        category_id,
        user_id: user?.id
      }),
      {
        loading: 'Creating notebook...',
        success: 'Notebook created successfully',
        error: (err) => err?.message ?? 'Failed to create notebook'
      }
    )
  }

  return (
    <Dialog open={open} onOpenChange={setOpen}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Create New Notebook</DialogTitle>
        </DialogHeader>
        <Form {...form}>
          <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4 pt-2">
            <FormField
              control={form.control}
              name="title"
              render={({ field }) => (
                <FormItem>
                  <FormLabel>Title</FormLabel>
                  <FormControl>
                    <Input placeholder="Enter notebook title" {...field} />
                  </FormControl>
                  <FormMessage />
                </FormItem>
              )}
            />
            <div className="flex justify-end gap-2">
              <Button
                type="button"
                variant="outline"
                onClick={() => setOpen(false)}
                disabled={isPending}
              >
                Cancel
              </Button>
              <Button type="submit" isLoading={isPending}>
                Create Noteboook
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
