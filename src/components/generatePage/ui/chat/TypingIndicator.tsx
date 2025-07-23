export default function TypingIndicator({
  generatingsite,
}: {
  generatingsite: boolean;
}) {
  return (
    <div className="flex items-center gap-2 ml-2 my-3">
      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce"></span>
      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-150"></span>
      <span className="w-2 h-2 bg-muted-foreground rounded-full animate-bounce delay-300"></span>
      <span className="text-xs text-muted-foreground ml-2">
        {generatingsite ? "Generating your website" : "Generating Response..."}
      </span>
    </div>
  );
}
