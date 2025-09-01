"use client";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useAuth } from "../../services/authServices/AuthContext";
import { useAI } from "@/hooks/editWebsiteHooks/generateContent";

export function AIPopoverContent({
  onClose,
  content,
  replaceContent,
}: {
  onClose: () => void;
  content?: string;
  replaceContent?: (content: string) => void;
}) {
  const [aiPrompt, setAiPrompt] = useState("");
  const user = useAuth();
  const { generate, loading } = useAI(user?.accessToken);

  const handleGenerate = async () => {
    const text = await generate(content, aiPrompt);
    if (text && replaceContent) replaceContent(text);
    onClose();
  };

  return (
    <>
      <div className="py-2 px-4">
        <h2 className="text-lg font-semibold flex items-center gap-2 text-foreground">
          Enhance Text with AI ✨
        </h2>
      </div>
      <Separator />
      <div className="py-2 px-4">
        <Textarea
          placeholder="e.g., Make it sound more energetic..."
          value={aiPrompt}
          onChange={(e) => setAiPrompt(e.target.value)}
          className="p-2 border-none max-h-32 resize-none bg-background text-foreground placeholder:text-muted-foreground"
        />
      </div>
      <Separator />
      <div className="flex justify-end gap-2 py-2 px-4">
        <Button variant="outline" onClick={onClose}>
          Cancel
        </Button>
        <Button
          onClick={handleGenerate}
          disabled={loading}
          className={`${loading ? "cursor-not-allowed" : "cursor-pointer"}`}
        >
          {loading ? "Generating..." : "Generate"}
        </Button>
      </div>
    </>
  );
}
