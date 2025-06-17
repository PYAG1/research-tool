import { supabase } from "@renderer/lib/config";
import { Tables } from "@renderer/types/database";


type CreateSessionArgs = { user_id: string; paper_id: string };
export async function CreateChatSession({ user_id, paper_id }: CreateSessionArgs) {
  const { data, error } = await supabase
    .from("chat_sessions")
    .insert([{ user_id, paper_id }])
    .select()
    .single();
  if (error) throw error;
  return data;
}


export async function GetChatSession({ user_id, paper_id }: CreateSessionArgs) {
  const { data, error } = await supabase
    .from("chat_sessions")
    .select("*")
    .eq("user_id", user_id)
    .eq("paper_id", paper_id)
    .maybeSingle(); 
  if (error) throw error;
  return data;
}

export async function GetChatMessages(session_id: string) {
  const { data, error } = await supabase
    .from("chat_messages")
    .select("*")
    .eq("session_id", session_id)
    .order("created_at", { ascending: true });
  if (error) throw error;
  return data as Tables<{ schema: "public" }, "chat_messages">[];
}


export async function AddChatMessage({
  session_id,
  role,
  content,
  parts,
}: {
  session_id: string;
  role: string;
  content: string;
  parts?: any;
}) {
  const { data, error } = await supabase
    .from("chat_messages")
    .insert([{ session_id, role, content, parts }])
    .select()
    .single();
  if (error) throw error;
  return data;
}
