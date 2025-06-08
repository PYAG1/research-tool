import { supabase } from "@renderer/lib";
import { TablesInsert, TablesUpdate } from "@renderer/types";

/**
 * Gets notes for a specific paper
 */
export async function GetNotesByPaperId(paperId: string) {
  if (!paperId) {
    throw new Error("Paper ID is required");
  }

  const { data: notes, error } = await supabase
    .from("notes")
    .select("*")
    .eq("paper_id", paperId)
    .order("created_at", { ascending: false });

  if (error) {
    throw new Error(error.message || "Failed to fetch notes");
  }

  return { data: notes };
}

/**
 * Creates a new note for a paper
 */
export async function CreateNote({
  data,
}: {
  data: TablesInsert<"notes">;
}) {
  if (!data.paper_id) {
    throw new Error("Paper ID is required for creating a note");
  }

  if (!data.content) {
    throw new Error("Content is required for creating a note");
  }

  const { data: note, error } = await supabase
    .from("notes")
    .insert(data)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to create note");
  }

  return { data: note };
}

/**
 * Updates an existing note
 */
export async function UpdateNote({
  data,
}: {
  data: TablesUpdate<"notes">;
}) {
  const { id, ...updateData } = data;
  
  if (!id) {
    throw new Error("Note ID is required for update");
  }
  
  const { data: note, error } = await supabase
    .from("notes")
    .update(updateData)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    throw new Error(error.message || "Failed to update note");
  }

  return { data: note };
}

/**
 * Deletes a note
 */
export async function DeleteNote({ id }: { id: string }) {
  if (!id) {
    throw new Error("Note ID is required for deletion");
  }

  const { error } = await supabase
    .from("notes")
    .delete()
    .eq("id", id);

  if (error) {
    throw new Error(error.message || "Failed to delete note");
  }
}