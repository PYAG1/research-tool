import { z } from "zod";
export const CreateCategorySchema = z.object({
  name: z.string().min(1, "Name is required"),
  description: z.string().optional(),
  color: z.string().optional(),
});

export const SignInSchema = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(20),
});

export const SignUpSchema = SignInSchema.merge(
  z.object({
    name: z.string().min(3).max(20),
  }),
);


export const PaperInfoSchema = z.object({
  title: z.string().min(1, "Title is required"),
  abstract: z.string().min(1, "Abstract is required"),
  authors: z
    .array(
      z.object({
        firstName: z.string().min(1, "First name required"),
        lastName: z.string().min(1, "Last name required"),
      })
    )
    .min(1, "At least one author required"),
  keywords: z.array(z.string().min(1, "Keyword required")).optional(),
  category_id: z.string().nullable().optional(),
  created_at: z.string().nullable().optional(),
  disclosures: z.any().nullable().optional(),
  doi: z.string().nullable().optional(),
  paper_references: z.any().nullable().optional(),
  pdf_path: z.string().min(1, "PDF path required"),
  publication: z.string().nullable().optional(),
  user_id: z.string().nullable().optional(),
});


export const NoteBookSchema = z.object({
  title: z.string().min(1, 'Title is required')
})

export type PaperInfoSchemaType = z.infer<typeof PaperInfoSchema>;
export type SignInSchemaType = z.infer<typeof SignInSchema>;
export type SignUpSchemaType = z.infer<typeof SignUpSchema>;
export type CreateCategorySchemaType = z.infer<typeof CreateCategorySchema>;
export type NoteBookSchemaType = z.infer<typeof NoteBookSchema>;  