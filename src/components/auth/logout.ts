import { supabase } from "@/lib/supabaseClient";

const signOut = async () => {
  await supabase.auth.signOut();
  window.location.href = "/login";
};

export default signOut;
