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
      className="flex w-full max-w-2xl rounded-2xl items-center border border-border p-2 mx-auto shadow-sm bg-accent"
      onSubmit={submitPrompt}
    >
      <Textarea
        className="border-none max-h-32 outline-none focus:outline-none shadow-none resize-none flex-1 text-card-foreground placeholder:text-muted-foreground"
        style={{
          boxShadow: "none",
          backgroundColor: "var(--accent)",
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
        className="ml-2 rounded-full shadow-lg w-10 h-10 cursor-pointer"
        type="submit"
        aria-label="Submit prompt"
        disabled={isLoading || !prompt}
      >
        <ArrowUp size={18} />
      </Button>
    </form>
  );
}
