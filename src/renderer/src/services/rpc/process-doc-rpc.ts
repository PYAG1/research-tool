import { supabase } from "@renderer/lib";


export async function processDocRPC(user_id: string, file_name: string,category_id?:string) {
  try {
    const { data, error } = await supabase.functions.invoke(
      "process-doc",
      {
        body: { user_id, file_name,category_id },
        method: "POST",
      }
    );

    if (error) {
      console.error("Supabase function error:", error);
      throw new Error(error.message);
    }
    if (!data) throw new Error("No data returned");
    return data;
  } catch (err) {
    console.error("processDocRPC error:", err);
    throw err instanceof Error ? err : new Error("Unknown error");
  }
}
