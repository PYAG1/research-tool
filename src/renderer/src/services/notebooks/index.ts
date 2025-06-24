
import { supabase } from "@renderer/lib";
import { NotebookInsert, NotebookUpdate } from "@renderer/types";



/**
 * Get all notebooks for a user
 * @param user_id The user ID
 * @returns Notebooks belonging to the user
 */
export async function GetNotebooks(user_id: string) {
  const { data, error } = await supabase
    .from("notebooks")
    .select("*, category:category(name,id,color)")
    .eq("user_id", user_id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching notebooks:", error);
    throw error;
  }

  return { data, error };
}

/**
 * Get notebooks by category
 * @param category_id The category ID
 * @returns Notebooks belonging to the category
 */
export async function GetNotebooksByCategory(category_id: string) {
  const { data, error } = await supabase
    .from("notebooks")
    .select("*")
    .eq("category_id", category_id)
    .order("updated_at", { ascending: false });

  if (error) {
    console.error("Error fetching notebooks by category:", error);
    throw error;
  }

  return { data, error };
}

/**
 * Get a notebook by ID
 * @param id The notebook ID
 * @returns The notebook data
 */
export async function GetNotebookById(id: string) {
  const { data, error } = await supabase
    .from("notebooks")
    .select("*, category:category(name,id,color)")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching notebook with ID ${id}:`, error);
    throw error;
  }

  return { data, error };
}

/**
 * Create a new notebook
 * @param notebook The notebook data to create
 * @returns The created notebook
 */
export async function CreateNotebook(notebook: NotebookInsert) {
  const { data, error } = await supabase
    .from("notebooks")
    .insert(notebook)
    .select()
    .single();

  if (error) {
    console.error("Error creating notebook:", error);
    throw error;
  }

  return { data, error };
}

/**
 * Update a notebook
 * @param id The notebook ID
 * @param notebook The notebook data to update
 * @returns The updated notebook
 */
export async function UpdateNotebook({ id, notebook }: { id: string; notebook: NotebookUpdate }) {
  const { data, error } = await supabase
    .from("notebooks")
    .update(notebook)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating notebook with ID ${id}:`, error);
    throw error;
  }

  return { data, error };
}

/**
 * Delete a notebook
 * @param id The notebook ID
 * @returns Success or error
 */
export async function DeleteNotebook(id: string) {
  const { error } = await supabase
    .from("notebooks")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting notebook with ID ${id}:`, error);
    throw error;
  }

  return { error };
}

/**
 * Mutation function for React Query
 */
export async function CreateNotebookMutation(data: NotebookInsert) {
  return CreateNotebook(data);
}

/**
 * Mutation function for React Query
 */
export async function DeleteNotebookMutation(id: string) {
  return DeleteNotebook(id);
}
