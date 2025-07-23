import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { ArrowUp } from "lucide-react";

export default function ChatBox({
  prompt,
  submitPrompt,
  setPrompt,
  isLoading,
}: {
  prompt: string;
  submitPrompt: any;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
  isLoading: boolean;
}) {
  return (
    <form
      className="flex w-full max-w-2xl rounded-2xl items-center border border-border p-2 mx-auto shadow-sm bg-background"
      onSubmit={submitPrompt}
    >
      <Textarea
        className="border-none max-h-32 outline-none focus:outline-none focus:ring-2 focus:ring-ring shadow-none resize-none bg-background flex-1 text-foreground placeholder:text-muted-foreground"
        style={{
          boxShadow: "none",
          backgroundColor: "var(--background)",
        }}
        value={prompt}
        onChange={(e) => setPrompt(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === "Enter" && !e.shiftKey) {
            e.preventDefault();
            submitPrompt(e);
          }
        }}
        placeholder="A landing page for my Japanese restaurant website..."
        aria-label="Prompt"
      />
      <Button
        className="ml-2 rounded-full shadow-lg w-10 h-10"
        variant="secondary"
        type="submit"
        aria-label="Submit prompt"
        disabled={isLoading}
      >
        <ArrowUp size={18} />
      </Button>
    </form>
  );
}
