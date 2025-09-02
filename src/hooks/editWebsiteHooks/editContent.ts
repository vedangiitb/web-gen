import { useState } from "react";
import { generateAIContent } from "@/services/editWebsiteServices/generateAIContent";

export function useAI(token?: string) {
  const [loading, setLoading] = useState(false);

  const generate = async (initContent: string | undefined, userReq: string) => {
    if (!token) throw new Error("No auth token");
    setLoading(true);
    try {
      return await generateAIContent({ token, initContent, userReq });
    } finally {
      setLoading(false);
    }
  };

  return { generate, loading };
}
