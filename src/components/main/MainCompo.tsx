"use client";
import RenderAIResponse from "@/app/generate/RenderAIResponse";
import RenderUserMessage from "@/app/generate/RenderUserMessage";
import SideBar from "@/app/generate/sidebar";
import {
  navigateToConversation,
  resetConversation,
} from "@/app/generate/utils";
import NavBar from "@/components/others/navbar";
import { Button } from "@/components/ui/button";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Textarea } from "@/components/ui/textarea";
import { supabase } from "@/lib/supabaseClient";
import { ArrowUp, PanelLeftClose, PanelLeftOpen, Sun } from "lucide-react";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import TypingIndicator from "@/app/generate/TypingIndicator";

type ConversationRow = {
  id: string;
  user_id: string;
  name: string;
  conv_history: any;
};

export default function MainCompo() {
  const router = useRouter();
  const user = useAuth();
  const [prompt, setPrompt] = useState<string>("");
  const [isGen, setIsGen] = useState<boolean>(true);
  const [chatVisible, setChatVisible] = useState(true);
  const [isLoading, setIsloading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState<
    { role: string; parts: { text: string }[] }[]
  >([
    {
      role: "model",
      parts: [
        {
          text: "Hello!\n I am Web-Gen, the new age website generator!. Tell me what type of website do you want, and it will be ready for you in minutes",
        },
      ],
    },
  ]);

  const initiateConversation = useCallback(
    async (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!prompt.trim()) return;
      setIsloading(true);
      const newHistory = [
        ...conversationHistory,
        { role: "user", parts: [{ text: prompt }] },
      ];
      setConversationHistory(newHistory);
      setPrompt("");
      if (user && user.userId) {
        const { data, error } = await supabase
          .from("user_conversations")
          .insert([
            {
              user_id: user.userId,
              name: "New Conversation",
              conv_history: newHistory,
            },
          ])
          .select();

        if (error) {
          console.log(error);
          return;
        }
        if (data && Array.isArray(data)) {
          const rows = data as ConversationRow[];
          router.push(`/generate?id=${rows[0].id}`);
        }
      }
    },
    [prompt]
  );

  return (
    <div className="max-h-screen text-foreground flex">
      {/* Header */}
      <SideBar
        navigateToConversation={navigateToConversation}
        resetConversation={resetConversation}
      />

      <div className="w-full">
        <NavBar />
        <main className="h-[calc(100vh-5rem)]">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            {/* Chat Panel */}
            <ResizablePanel
              minSize={30}
              className={`px-8 h-full ${!chatVisible ? "hidden" : ""}`}
            >
              <div className="h-full flex flex-col justify-between overflow-hidden">
                {/* Chat History */}
                <div
                  className="flex-1 overflow-y-auto custom-scrollbar"
                  aria-live="polite"
                  style={{ maxHeight: "calc(100vh - 150px)" }}
                >
                  {conversationHistory.map(
                    (
                      item: { role: string; parts: { text: string }[] },
                      idx: number
                    ) => (
                      <div key={idx}>
                        {item.role === "user" ? (
                          <RenderUserMessage data={item.parts[0].text} />
                        ) : (
                          <RenderAIResponse data={item.parts[0].text} />
                        )}
                      </div>
                    )
                  )}
                  {isLoading && <TypingIndicator generatingsite={false} />}
                </div>

                {/* Input Form */}
                <form
                  className="flex w-full max-w-2xl rounded-2xl items-center border border-border p-2 mx-auto shadow-sm bg-background"
                  onSubmit={initiateConversation}
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
                        initiateConversation(e);
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
                  >
                    <ArrowUp size={18} />
                  </Button>
                </form>
              </div>
            </ResizablePanel>

            <ResizableHandle
              withHandle
              className={` ${!(chatVisible && isGen) ? "hidden" : ""}`}
            />

            <ResizablePanel
              minSize={30}
              className={`px-2 ${!isGen ? "hidden" : ""}`}
            >
              <div className="h-full flex flex-col p-2">
                <div className="flex justify-between items-center mb-3">
                  {chatVisible ? (
                    <PanelLeftClose
                      className="h-8 w-8 p-1 cursor-pointer hover:bg-muted rounded-md transition-colors duration-300"
                      onClick={() => setChatVisible(false)}
                    ></PanelLeftClose>
                  ) : (
                    <PanelLeftOpen
                      className="h-8 w-8 p-1 cursor-pointer hover:bg-muted rounded-md transition-colors duration-300"
                      onClick={() => setChatVisible(true)}
                    ></PanelLeftOpen>
                  )}
                  <h3 className="font-medium text-lg">Preview</h3>
                </div>

                <div className="flex-1 flex flex-col items-center justify-center text-muted-foreground border border-border rounded-lg bg-muted/50">
                  <div className="text-center p-6">
                    <div className="mx-auto bg-accent/20 w-16 h-16 rounded-full flex items-center justify-center mb-4">
                      <Sun size={24} className="text-accent-foreground" />
                    </div>
                    <h4 className="font-medium mb-1">No Preview Available</h4>
                    <p className="text-sm max-w-xs">
                      Website preview will appear here after a website is
                      generated.
                    </p>
                  </div>
                </div>
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      </div>
    </div>
  );
}
