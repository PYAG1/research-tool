import * as z from 'zod';

export const PdfViewerValidators =z.object({
    category: z.string().min(1, { message: 'Category is required' }),
    title: z.string().min(1, { message: 'Title is required' }),
})


export type PdfViewerValidators = z.infer<typeof PdfViewerValidators>;