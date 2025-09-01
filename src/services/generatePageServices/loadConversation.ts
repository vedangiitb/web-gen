import { supabase } from "@/lib/supabaseClient";
import { captureWebsiteDetails } from "./captureWebsiteDetails";
import { updatedb } from "./updateDb";
export const getConversation = async (
  id: string,
  setConversationHistory: any,
  setChatId: any,
  setDetailsFromLLM: any,
  setShowPreview: any,
  setStylesFromLLM: any,
  setInitialStyles: any,
  setHeroImg: any,
  setIsLoading: any,
  websiteDetails: any,
  setWebsiteDetails: any,
  setGeneratingSite: any,
  authToken: string
) => {
  if (!id) return;

  try {
    const { data, error } = await supabase
      .from("user_conversations")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      console.log(error);
      throw error;
    }
    if (!data) return;
    localStorage.setItem("chatId", id);

    const { conv_history, id: chatId, content, style, hero_img } = data;

    if (conv_history) {
      setConversationHistory(conv_history);
      setChatId(chatId);

      content ? setDetailsFromLLM(content) : setShowPreview(false);
      if (content) setShowPreview(true);

      if (style) {
        setStylesFromLLM(style);
        setInitialStyles(style);
      }

      if (hero_img) setHeroImg(hero_img);

      if (conv_history.length <= 2) {
        const inputText = conv_history[1]?.parts?.[0]?.text ?? "";
        if (inputText) {
          captureWebsiteDetails(
            inputText,
            setConversationHistory,
            conv_history,
            setIsLoading,
            websiteDetails,
            setWebsiteDetails,
            setGeneratingSite,
            setShowPreview,
            authToken,
            (updateData: any) => updatedb(updateData, chatId)
          );
        }
      }
    }
  } catch (err) {
    console.error("Error fetching conversation:", err);
  }
};
