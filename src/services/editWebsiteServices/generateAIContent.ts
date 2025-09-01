export async function generateAIContent({
  token,
  initContent,
  userReq,
}: {
  token: string;
  initContent?: string;
  userReq: string;
}): Promise<string> {
  const response = await fetch(
    "https://jxceaahrdymuhokduqdt.supabase.co/functions/v1/ai-content-generator",
    {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ initContent, userReq }),
    }
  );

  const resp = await response.json();
  let text = resp?.text ?? "";

  return text
    .trim()
    .replace(/^["'`]+|["'`]+$/g, "")
    .replace(/^```(?:\w+)?\n?/, "")
    .replace(/\n?```$/, "");
}
