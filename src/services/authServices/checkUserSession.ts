import { supabase } from "@/lib/supabaseClient";

const checkUserSession = async (): Promise<{
  error?: string;
  data?: {
    email: string;
    userName: string;
    id: string;
  };
}> => {
  const { data, error } = await supabase.auth.getUser();

  if (error || !data.user.id) {
    return { error: "User is not logged in" };
  }

  return {
    data: {
      email: data.user.email ?? "",
      userName: data.user.user_metadata.full_name ?? data.user.email ?? "User",
      id: data.user.id,
    },
  };
};

export default checkUserSession;
