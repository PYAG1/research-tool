import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@renderer/components/ui/button'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage
} from '@renderer/components/ui/form'
import { Input } from '@renderer/components/ui/input'
import { Popover, PopoverContent, PopoverTrigger } from '@renderer/components/ui/popover'
import { Textarea } from '@renderer/components/ui/textarea'
import { queryKey } from '@renderer/constants'
import { PaperInfoSchema, PaperInfoSchemaType } from '@renderer/lib/schemas'
import { UpdatePaperMutation } from '@renderer/services/papers'
import { ResearchPapers } from '@renderer/types/database'
import { useMutation, useQueryClient } from '@tanstack/react-query'
import { Info, Minus, Plus } from 'lucide-react'
import moment from 'moment'
import { useFieldArray, useForm } from 'react-hook-form'
import { toast } from 'sonner'

interface PaperInfoPopoverProps extends ResearchPapers {
  category?: {
    name: string
  } | null
}

export default function PaperInfoPopover({ data,id }: { data: Readonly<PaperInfoPopoverProps>,id:string }) {
  const queryClient = useQueryClient()

  const { mutateAsync, isPending } = useMutation({
    mutationFn: UpdatePaperMutation,
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: [queryKey.paper, id] })
    }
  })
  const form = useForm<PaperInfoSchemaType>({
    resolver: zodResolver(PaperInfoSchema),
    defaultValues: {
      title: data.title ?? '',
      abstract: data.abstract ?? '',
      authors: data.authors?.map((a) => {
        const [firstName, ...rest] = a?.split(' ') ?? ['']
        return { firstName, lastName: rest.join(' ') }
      }) ?? [{ firstName: '', lastName: '' }],
      keywords: data.keywords ?? [],
      category_id: data.category_id ?? '',
      created_at: data.created_at ?? '',
      disclosures: data.disclosures ?? '',
      doi: data.doi ?? '',
      paper_references: data.paper_references ?? '',
      pdf_path: data.pdf_path ?? '',
      publication: data.publication ?? '',
      user_id: data.user_id ?? ''
    }
  })

  const authorsField = useFieldArray({
    control: form.control,
    name: 'authors'
  })
  const keywordsField = useFieldArray({
    control: form.control,
    name: 'keywords'
  })

  const addedDate = data.created_at
    ? moment(data.created_at).format('MMMM DD, YYYY [at] hh:mm A')
    : ''

  async function handleSubmit(data: PaperInfoSchemaType) {
    const authors = data.authors.map((author) => `${author.firstName} ${author.lastName}`.trim())

    const updatedData = {
      ...data,
      authors
    }

    toast.promise(mutateAsync({ data: { ...updatedData, id: id } }), {
      loading: 'Updating paper info...',
      success: 'Paper info updated successfully',
      error: (err) => {
        return `Error: ${err.message}`
      }
    })
  }

  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button size="icon" variant="outline" className="rounded-full" aria-label="Paper Info">
          <Info className="w-5 h-5" />
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-[500px] max-w-full p-6 gap-6 max-h-[600px] overflow-y-auto">
        <div className="mb-4 flex items-center gap-3">
          <div className="flex items-center justify-center bg-muted rounded-full w-8 h-8">
            <Info className="w-5 h-5 text-muted-foreground" />
          </div>
          <div className="flex flex-col min-w-0">
            <span className="text-sm font-semibold truncate">{data.title}</span>
            <span className="text-xs text-muted-foreground mt-0.5">Added {addedDate}</span>
          </div>
        </div>

        <Form {...form}>
          <form onSubmit={form.handleSubmit(handleSubmit)}>
            <div className="grid grid-cols-[1fr_2fr] gap-x-6 gap-y-3 items-center text-sm">
              {/* Title */}
              <FormLabel className="justify-self-end text-xs">Title</FormLabel>
              <FormField
                control={form.control}
                name="title"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        placeholder="Paper title"
                        className="rounded-lg border px-2 py-1 bg-muted text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* Authors */}
              <FormLabel className="justify-self-end self-start mt-2 text-xs">Authors</FormLabel>
              <div className="flex flex-col gap-2">
                {authorsField.fields.map((item, idx) => (
                  <div key={item.id} className="flex gap-2 items-center">
                    <FormField
                      control={form.control}
                      name={`authors.${idx}.firstName` as const}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="First name"
                              className="rounded-lg border px-2 py-1 bg-muted text-xs"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={form.control}
                      name={`authors.${idx}.lastName` as const}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Last name"
                              className="rounded-lg border px-2 py-1 bg-muted text-xs"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => authorsField.remove(idx)}
                      aria-label="Remove author"
                      className="text-destructive"
                      disabled={authorsField.fields.length === 1}
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2 mt-1">
                  <Input
                    readOnly
                    value="first"
                    className="flex-1 rounded-lg border px-2 py-1 bg-muted opacity-60 text-xs"
                  />
                  <Input
                    readOnly
                    value="last"
                    className="flex-1 rounded-lg border px-2 py-1 bg-muted opacity-60 text-xs"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => authorsField.append({ firstName: '', lastName: '' })}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Keywords */}
              <FormLabel className="justify-self-end self-start mt-2 text-xs">Keywords</FormLabel>
              <div className="flex flex-col gap-2">
                {keywordsField.fields.map((item, idx) => (
                  <div key={item.id} className="flex gap-2 items-center">
                    <FormField
                      control={form.control}
                      name={`keywords.${idx}` as const}
                      render={({ field }) => (
                        <FormItem className="flex-1">
                          <FormControl>
                            <Input
                              {...field}
                              placeholder="Keyword"
                              className="rounded-lg border px-2 py-1 bg-muted text-xs"
                            />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <Button
                      type="button"
                      size="icon"
                      variant="ghost"
                      onClick={() => keywordsField.remove(idx)}
                      aria-label="Remove keyword"
                      className="text-destructive"
                    >
                      <Minus className="w-4 h-4" />
                    </Button>
                  </div>
                ))}
                <div className="flex gap-2 mt-1">
                  <Input
                    readOnly
                    value="keyword"
                    className="flex-1 rounded-lg border px-2 py-1 bg-muted opacity-60 text-xs"
                  />
                  <Button
                    type="button"
                    size="icon"
                    variant="outline"
                    onClick={() => keywordsField.append('')}
                  >
                    <Plus className="w-4 h-4" />
                  </Button>
                </div>
              </div>

              {/* Abstract */}
              <FormLabel className="justify-self-end self-start mt-2 text-xs">Abstract</FormLabel>
              <FormField
                control={form.control}
                name="abstract"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Textarea
                        {...field}
                        placeholder="Abstract"
                        className="rounded-lg border px-2 py-1 bg-muted min-h-[80px] text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />

              {/* DOI */}
              <FormLabel className="justify-self-end text-xs">DOI</FormLabel>
              <FormField
                control={form.control}
                name="doi"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        placeholder="DOI"
                        className="rounded-lg border px-2 py-1 bg-muted text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
              {/* Publication */}
              <FormLabel className="justify-self-end text-xs">Publication</FormLabel>
              <FormField
                control={form.control}
                name="publication"
                render={({ field }) => (
                  <FormItem className="w-full">
                    <FormControl>
                      <Input
                        {...field}
                        value={field.value ?? ''}
                        placeholder="Publication"
                        className="rounded-lg border px-2 py-1 bg-muted text-xs"
                      />
                    </FormControl>
                    <FormMessage />
                  </FormItem>
                )}
              />
            </div>
            <div className="justify-end flex w-full py-2">
              <Button type="submit" isLoading={isPending}>
                Update
              </Button>
            </div>
          </form>
        </Form>
      </PopoverContent>
    </Popover>
  )
}
