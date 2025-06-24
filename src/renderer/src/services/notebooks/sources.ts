
import { supabase } from "@renderer/lib";
import { Database } from "@renderer/types/database";


type SourceInsert = Database["public"]["Tables"]["sources"]["Insert"];
type SourceUpdate = Database["public"]["Tables"]["sources"]["Update"];


type NotebookSourceInsert = Database["public"]["Tables"]["notebook_sources"]["Insert"];

/**
 * Get all sources for a user
 * @param user_id The user ID
 * @returns Sources belonging to the user
 */
export async function GetSources(user_id: string) {
  const { data, error } = await supabase
    .from("sources")
    .select("*")
    .eq("user_id", user_id)
    .order("created_at", { ascending: false });

  if (error) {
    console.error("Error fetching sources:", error);
    throw error;
  }

  return { data, error };
}

/**
 * Get a source by ID
 * @param id The source ID
 * @returns The source data
 */
export async function GetSourceById(id: string) {
  const { data, error } = await supabase
    .from("sources")
    .select("*")
    .eq("id", id)
    .single();

  if (error) {
    console.error(`Error fetching source with ID ${id}:`, error);
    throw error;
  }

  return { data, error };
}

/**
 * Create a new source
 * @param source The source data to create
 * @returns The created source
 */
export async function CreateSource(source: SourceInsert) {
  const { data, error } = await supabase
    .from("sources")
    .insert(source)
    .select()
    .single();

  if (error) {
    console.error("Error creating source:", error);
    throw error;
  }

  return { data, error };
}

/**
 * Update a source
 * @param id The source ID
 * @param source The source data to update
 * @returns The updated source
 */
export async function UpdateSource(id: string, source: SourceUpdate) {
  const { data, error } = await supabase
    .from("sources")
    .update(source)
    .eq("id", id)
    .select()
    .single();

  if (error) {
    console.error(`Error updating source with ID ${id}:`, error);
    throw error;
  }

  return { data, error };
}

/**
 * Delete a source
 * @param id The source ID
 * @returns Success or error
 */
export async function DeleteSource(id: string) {
  const { error } = await supabase
    .from("sources")
    .delete()
    .eq("id", id);

  if (error) {
    console.error(`Error deleting source with ID ${id}:`, error);
    throw error;
  }

  return { error };
}

/**
 * Get sources for a notebook
 * @param notebook_id The notebook ID
 * @returns Sources linked to the notebook
 */
export async function GetNotebookSources(notebook_id: string) {
  const { data, error } = await supabase
    .from("notebook_sources")
    .select("*, source:sources(*)")
    .eq("notebook_id", notebook_id);

  if (error) {
    console.error(`Error fetching sources for notebook ${notebook_id}:`, error);
    throw error;
  }

  return { data, error };
}

/**
 * Add a source to a notebook
 * @param notebookSource The notebook_source data
 * @returns The created notebook_source
 */
export async function AddSourceToNotebook(notebookSource: NotebookSourceInsert) {
  const { data, error } = await supabase
    .from("notebook_sources")
    .insert(notebookSource)
    .select()
    .single();

  if (error) {
    console.error("Error adding source to notebook:", error);
    throw error;
  }

  return { data, error };
}

/**
 * Remove a source from a notebook
 * @param notebook_id The notebook ID
 * @param source_id The source ID
 * @returns Success or error
 */
export async function RemoveSourceFromNotebook(notebook_id: string, source_id: string) {
  const { error } = await supabase
    .from("notebook_sources")
    .delete()
    .eq("notebook_id", notebook_id)
    .eq("source_id", source_id);

  if (error) {
    console.error(`Error removing source ${source_id} from notebook ${notebook_id}:`, error);
    throw error;
  }

  return { error };
}

/**
 * Create a source from an existing paper
 * @param paper_id The paper ID
 * @param user_id The user ID
 * @returns The created source
 */
export async function CreateSourceFromPaper(paper_id: string, user_id: string) {
  // First, fetch the paper details
  const { data: paper, error: paperError } = await supabase
    .from("research_papers")
    .select("title, authors, doi, publication")
    .eq("id", paper_id)
    .single();

  if (paperError) {
    console.error(`Error fetching paper with ID ${paper_id}:`, paperError);
    throw paperError;
  }

  // Create a new source based on the paper
  const source: SourceInsert = {
    title: paper.title,
    authors: paper.authors,
    doi: paper.doi,
    publication: paper.publication,
    type: "paper", // This is a paper type source
    paper_id: paper_id, // Link to the original paper
    user_id: user_id
  };

  return CreateSource(source);
}
