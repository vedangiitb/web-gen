import { extractJsonFromResponse } from "@/utils/extractJsonFromResponse";

export async function generateSite(
  websiteDetails: {
    businessName: string;
    businessType: string;
    targetAudience: string;
    tone: string;
    primaryGoal: string;
    designPreferences: string;
  },
  setDetailsFromLLM: any,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  setSiteComplete: React.Dispatch<React.SetStateAction<boolean>>,
  accessToken: string
) {
  setIsLoading(true);
  const response = await fetch(
    "https://jxceaahrdymuhokduqdt.supabase.co/functions/v1/website-generator",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${accessToken}`,
      },
      body: JSON.stringify({
        websiteDetails: websiteDetails,
      }),
    }
  );
  const body = await response.json();
  console.log(body);
  const text = extractJsonFromResponse(body.text);
  console.log(text);
  setDetailsFromLLM(text);
  setIsLoading(false);
  setSiteComplete(false);
}
