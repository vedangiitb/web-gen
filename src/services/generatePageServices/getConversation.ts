import { supabase } from "@/lib/supabaseClient";

export const getConversation = async (
  id: string
): Promise<{ data: any; error: Error | null }> => {
  if (!id) {
    return {
      data: null,
      error: Error("No id received"),
    };
  }
  try {
    const { data, error } = await supabase
      .from("user_conversations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      throw error;
    }

    if (!data) {
      throw Error("Failed to get data");
    }

    return { data: data, error: null };
  } catch (e) {
    return { data: null, error: e instanceof Error ? e : new Error(String(e)) };
  }
};
