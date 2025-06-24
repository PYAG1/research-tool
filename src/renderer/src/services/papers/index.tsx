import { supabase } from "@renderer/lib";
import { TablesUpdate } from "@renderer/types";

export async function GetPapers() {
  const { data: papers, error } = await supabase
    .from("research_papers")
    .select("*")
    .eq("is_deleted", false)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Failed to fetch papers");
  }

  return { data: papers };
}

export async function GetAllPapers({
  start,
  end,
  filterNoCategoryId,
  search = "",
}: {
  start?: number;
  end?: number;
  filterNoCategoryId?: boolean;
  search?: string;
} = {}) {
  let query = supabase.from("research_papers").select("*,category(name)");
  if (search) {
    query = query.ilike("title", `%${search}%`);
  }
  if (start !== undefined && end !== undefined) {
    query = query.range(start, end);
  }

  if (filterNoCategoryId) {
    query = query.is("category_id", null);
  }

  const { data: papers, error } = await query;

  if (error) {
    throw new Error(error.message || "Failed to fetch papers");
  }

  return { data: papers };
}

export async function GetPaperById(id: string) {
  const { data: paper, error } = await supabase
    .from("research_papers")
    .select("*,category(name),chat_sessions(id)")
    .eq("id", id)
    .single();

  if (error) {
    throw new Error(error.message || "Failed to fetch paper");
  }

  return { data: paper };
}

export async function UpdatePaperMutation({
  data,
}: {
  data: TablesUpdate<"research_papers">;
}) {
  const { id, ...updateData } = data;
  if (!id) {
    throw new Error("Paper ID is required for update");
  }
  const { error } = await supabase
    .from("research_papers")
    .update(updateData)
    .eq("id", id);

  if (error) {
    throw new Error(error.message || "Failed to update paper");
  }
}

export async function DeletePaperMutation({ id }: { id: string }) {
  if (!id) {
    throw new Error("Paper ID is required for deletion");
  }

  const { error } = await supabase
    .from("research_papers")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message || "Failed to delete paper");
  }
}
