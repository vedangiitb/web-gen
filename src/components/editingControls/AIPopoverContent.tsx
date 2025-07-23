"use client";
import { useState } from "react";
import { Textarea } from "../ui/textarea";
import { Button } from "../ui/button";
import { Separator } from "../ui/separator";
import { useAuth } from "../auth/AuthContext";

export function AIPopoverContent({
  onClose,
  content,
  replaceContent,
}: {
  onClose: () => void;
  content?: string;
  replaceContent?: (content: string) => null;
}) {
  const [aiPrompt, setAiPrompt] = useState("");
  const user = useAuth();

  const handleGenerate = async () => {
    if (!user) return;
    const response = await fetch(
      "https://jxceaahrdymuhokduqdt.supabase.co/functions/v1/ai-content-generator",
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Authorization: `Bearer ${user?.accessToken}`,
        },
        body: JSON.stringify({
          initContent: content,
          userReq: aiPrompt,
        }),
      }
    );

    const resp = await response.json();
    let text = resp?.text ?? "";

    text = text
      .trim()
      .replace(/^["'`]+|["'`]+$/g, "")
      .replace(/^```(?:\w+)?\n?/, "")
      .replace(/\n?```$/, "");

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
        <Button onClick={handleGenerate}>Generate</Button>
      </div>
    </>
  );
}
