import { supabase,CreateCategorySchemaType } from "@renderer/lib";
import { Categories } from "@renderer/types";


export async function CreateCategoryMutation(data: CreateCategorySchemaType) {
  const payload = {
    ...data,
    color: data.color ?? "#CCCCCC",
  };
  const { data: result, error } = await supabase
    .from("category")
    .insert([payload])
    .select();

  if (error) {
    throw new Error(error.message || "Failed to create category");
  }

  return { data: result };
}

/**
 * Retrieves categories with optional pagination
 * @param options Pagination and sorting options
 * @returns Categories and count information
 */
export async function GetAllCategories({
  page = 0,
  pageSize = 20,
  orderBy = "name",
  ascending = true,
  search = "",
}: {
  page?: number;
  pageSize?: number;
  orderBy?: keyof Categories;
  ascending?: boolean;
  search?: string;
} = {}) {
  try {
    const offset = page * pageSize;

    let query = supabase
      .from("category")
      .select("*, research_papers(id)", { count: "exact" });

    if (search) {
      query = query.ilike("name", `%${search}%`);
    }

    const {
      data: categories,
      error,
      count,
    } = await query
      .order(orderBy, { ascending })
      .range(offset, offset + pageSize - 1);

    if (error) throw error;

    return {
      data: categories,
      count,
      page,
      pageSize,
    };
  } catch (error: any) {
    throw new Error(error.message ?? "Failed to fetch categories");
  }
}

export async function GetCategoryById(id: string) {
  const { data: category, error } = await supabase
    .from("category")
    .select(
      "*, research_papers(id,title,abstract,pdf_path,created_at,authors,pdf_path,is_deleted)"
    )
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(
      error.message || "Failed to fetch category and its research papers"
    );
  }

  return { data: category };
}

export async function UpdateCategoryMutation({
  data,
  id,
}: {
  data: Partial<CreateCategorySchemaType>;
  id: string;
}) {
  const { data: result, error } = await supabase
    .from("category")
    .update(data)
    .eq("id", id)
    .select();

  if (error) {
    throw new Error(error.message || "Failed to update category");
  }

  console.log("Updated category:", result);
  return { data: result };
}

export async function DeleteCategoryMutation({ id }: { id: string }) {
  try {
    const { data: papers, error: checkError } = await supabase
      .from("research_papers")
      .select("id")
      .eq("category_id", id);

    if (checkError) throw checkError;

    if (papers && papers.length > 0) {
      // Option 2: Move papers to uncategorized
      const { error: moveError } = await supabase
        .from("research_papers")
        .update({ category_id: null })
        .eq("category_id", id);

      if (moveError) throw moveError;
    }

    const { error } = await supabase.from("category").delete().eq("id", id);

    if (error) throw error;

    return { success: true };
  } catch (error: any) {
    throw new Error(error.message ?? "Failed to delete category");
  }
}
