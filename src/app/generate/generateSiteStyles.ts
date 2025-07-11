import { extractJsonFromResponse } from "@/utils/extractJsonFromResponse";

export async function generateSiteStyles(
  websiteDetails: {
    businessName: string;
    businessType: string;
    targetAudience: string;
    tone: string;
    primaryGoal: string;
    designPreferences: string;
  },
  setStylesFromLLM: any,
  setInitialCols: any,
  setIsLoading: React.Dispatch<React.SetStateAction<boolean>>,
  // setSiteComplete: React.Dispatch<React.SetStateAction<boolean>>,
  accessToken: string,
  setHeroImgQuery: React.Dispatch<React.SetStateAction<string>>
) {
  setIsLoading(true);
  const response = await fetch(
    "https://jxceaahrdymuhokduqdt.supabase.co/functions/v1/website-styles-api",
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
  setStylesFromLLM(text);
  setInitialCols(text);
  if (text?.query) setHeroImgQuery(text.query);
  setIsLoading(false);
  // setSiteComplete(false);
}
