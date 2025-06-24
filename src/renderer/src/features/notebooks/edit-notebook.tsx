import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@renderer/components/ui/button'
import {
  Dialog,
  DialogClose,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger
} from '@renderer/components/ui/dialog'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { NoteBookSchema, NoteBookSchemaType } from '@renderer/lib'
import { UpdateNotebook } from '@renderer/services/notebooks'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { EditIcon } from 'lucide-react'
import { useForm } from 'react-hook-form'
import { toast } from 'sonner'
export default function EditNoteBook({ title, id }: { title: string; id: string }) {
  const queryClient = useQueryClient()
  const { mutateAsync, isPending } = useMutation({
    mutationFn: UpdateNotebook,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['notebook', id] })
    },
    
  })
  const form = useForm<NoteBookSchemaType>({
    resolver: zodResolver(NoteBookSchema),
    defaultValues: {
      title: title ?? ''
    }
  })

  function onSubmit(data: NoteBookSchemaType) {
    toast.promise(
      mutateAsync({
        id: id,
        notebook: {
          title: data.title
        }
      }),
      {
        loading: 'Updating notebook...',
        success: 'Notebook updated successfully.',
        error: 'Failed to update notebook.'
      }
    )
  }
  return (
    <Dialog>
      <DialogTrigger asChild>
        <Button size="icon" variant="outline" className="rounded-full" aria-label="Paper Info">
          <EditIcon className="w-5 h-5" />
        </Button>
      </DialogTrigger>
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
              <DialogClose asChild>
                <Button variant="outline">Cancel</Button>
              </DialogClose>
              <Button type="submit" isLoading={isPending}>
                Edit Notebook
              </Button>
            </div>
          </form>
        </Form>
      </DialogContent>
    </Dialog>
  )
}
