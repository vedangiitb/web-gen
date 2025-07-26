import RenderAIResponse from "./RenderAIResponse";
import RenderUserMessage from "./RenderUserMessage";
import TypingIndicator from "./TypingIndicator";

export default function ChatHistory({
  conversationHistory,
  isLoading,
  generatingsite,
}: {
  conversationHistory: { role: string; parts: { text: string }[] }[];
  isLoading: boolean;
  generatingsite: boolean;
}) {
  return (
    <div
      className="flex-1 overflow-y-auto custom-scrollbar px-2 py-8 space-y-2"
      aria-live="polite"
      tabIndex={0}
    >
      {conversationHistory.map((item, idx) => (
        <div key={idx}>
          {item.role === "user" ? (
            <RenderUserMessage data={item.parts[0].text} />
          ) : (
            <RenderAIResponse data={item.parts[0].text} />
          )}
        </div>
      ))}
      {isLoading && <TypingIndicator generatingsite={generatingsite} />}
    </div>
  );
}
