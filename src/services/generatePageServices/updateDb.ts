import { supabase } from "@/lib/supabaseClient";

export const updatedb = async (updateData: any, chatId = null) => {
  const id = chatId || localStorage.getItem("chatId");
  if (!id) return;

  const { data, error } = await supabase
    .from("user_conversations")
    .update(updateData)
    .eq("id", id)
    .select("id");

  if (error) {
    console.error(error);
    return false;
  }
  return true;
};
