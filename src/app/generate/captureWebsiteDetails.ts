"use client";
import { extractJsonFromResponse } from "@/utils/extractJsonFromResponse";

export async function captureWebsiteDetails(
  userMessage: string,
  setConversationHistory: React.Dispatch<
    React.SetStateAction<{ role: string; parts: { text: string }[] }[]>
  >,
  conversationHistory: { role: string; parts: { text: string }[] }[],
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  websiteDetails: {
    businessName: string;
    businessType: string;
    targetAudience: string;
    tone: string;
    primaryGoal: string;
    designPreferences: string;
  },
  setWebsiteDetails: React.Dispatch<
    React.SetStateAction<{
      businessName: string;
      businessType: string;
      targetAudience: string;
      tone: string;
      primaryGoal: string;
      designPreferences: string;
    }>
  >,
  setGeneratingSite: React.Dispatch<React.SetStateAction<boolean>>,
  accessToken: string,
  chatId: string | null
): Promise<void> {
  setIsLoading(true);

  const newHistory = [
    ...conversationHistory,
    { role: "user", parts: [{ text: userMessage }] },
  ];

  setConversationHistory(newHistory);

  console.log("chatId:", chatId);
  try {
    const response = await fetch(
      "https://jxceaahrdymuhokduqdt.supabase.co/functions/v1/site-details",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${accessToken}`,
        },
        body: JSON.stringify({
          history: [
            ...conversationHistory,
            {
              role: "user",
              parts: [{ text: userMessage + JSON.stringify(websiteDetails) }],
            },
          ],
        }),
      }
    );

    if (!response.ok) {
      throw new Error(`HTTP error! status: ${response.status}`);
    }

    const data1 = await response.json();
    const aiResponseText = data1.text;

    let updatedDetails = { ...websiteDetails };
    let responseToUser = "Sorry, something went wrong. Please tell again!";
    let readyToGenerate = false;

    try {
      const parsed = extractJsonFromResponse(aiResponseText);
      if (parsed.updatedDetails) updatedDetails = parsed.updatedDetails;
      if (parsed.responseToUser) responseToUser = parsed.responseToUser;
      console.log(updatedDetails);
      readyToGenerate = !!parsed.readyToGenerate;
    } catch (err) {
      console.error("Failed to parse LLM response:", err, aiResponseText);
      responseToUser =
        "Sorry, I couldn't understand the response. Please try again!";
    }

    if (readyToGenerate) setGeneratingSite(true);
    setWebsiteDetails(updatedDetails);

    setConversationHistory([
      ...newHistory,
      { role: "model", parts: [{ text: responseToUser }] },
    ]);
  } catch (error) {
    console.error("Error sending message to Gemini:", error);
    setConversationHistory([
      ...newHistory,
      {
        role: "model",
        parts: [{ text: "Sorry, there was a server error. Please try again." }],
      },
    ]);
  } finally {
    setIsLoading(false);
  }
}
