export function extractJsonFromResponse(text: string): any {
  // Remove triple backticks and anything before/after them
  const cleaned = text
    .replace(/```json\s*/, "") // remove ```json at the start
    .replace(/```$/, "") // remove ending ```
    .trim();

  return JSON.parse(cleaned);
}
