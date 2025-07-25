import ChatBox from "./ChatBox";
import ChatHistory from "./ChatHistory";

export default function ChatPanel({
  conversationHistory,
  isLoading,
  generatingsite,
  prompt,
  submitPrompt,
  setPrompt,
}: {
  conversationHistory: { role: string; parts: { text: string }[] }[];
  isLoading: boolean;
  generatingsite: boolean;
  prompt: string;
  submitPrompt: any;
  setPrompt: React.Dispatch<React.SetStateAction<string>>;
}) {
  return (
    <div className="pl-7 pr-2 h-full flex flex-col justify-between overflow-hidden">
      <ChatHistory
        conversationHistory={conversationHistory}
        isLoading={isLoading}
        generatingsite={generatingsite}
      />

      <ChatBox
        prompt={prompt}
        submitPrompt={submitPrompt}
        setPrompt={setPrompt}
        isLoading={isLoading}
      />
    </div>
  );
}
