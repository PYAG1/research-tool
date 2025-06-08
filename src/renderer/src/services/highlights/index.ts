import { prepareDataForDatabase, supabase } from "@renderer/lib";
import { TablesInsert } from "@renderer/types";
import { NewHighlight } from "react-pdf-highlighter";


export async function CreateHightLight(highlight: NewHighlight, paper_id: string) {

  const processedHighlight = prepareDataForDatabase(highlight);
  const payload = { ...processedHighlight, paper_id } as unknown as TablesInsert<"highlights">;

  const { data, error } = await supabase
    .from('highlights')
    .insert(payload)
    .select();

  if (error) {
    throw new Error(`Failed to create highlight: ${error.message}`);
  }

  return data;
}

export async function GetHighlightsByPaper(paper_id: string) {
  const { data, error } = await supabase
    .from('highlights')
    .select('*')
    .eq('paper_id', paper_id);

  if (error) {
    throw new Error(`Failed to fetch highlights: ${error.message}`);
  }

  return data;
}

export async function UpdateHighlight(highlightId: string, updates: Partial<TablesInsert<'highlights'>>) {

  const processedUpdates = prepareDataForDatabase(updates);

  const { data, error } = await supabase
    .from('highlights')
    .update(processedUpdates)
    .eq('id', highlightId)
    .select();

  if (error) {
    throw new Error(`Failed to update highlight: ${error.message}`);
  }

  return data;
}

export async function DeleteHighlight(highlightId: string) {
  const { data, error } = await supabase
    .from('highlights')
    .delete()
    .eq('id', highlightId)
    .select();

  if (error) {
    throw new Error(`Failed to delete highlight: ${error.message}`);
  }

  return data;
}