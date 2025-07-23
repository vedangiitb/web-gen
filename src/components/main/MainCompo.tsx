"use client";
import SideBar from "@/components/generatePage/ui/sidebar/sidebar";
import NavBar from "@/components/others/navbar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import ChatPanel from "../generatePage/ui/chat/ChatPanel";
import PreviewBar from "../generatePage/ui/preview/PreviewBar";

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
      <SideBar />

      <div className="w-full">
        <NavBar />
        <main className="h-[calc(100vh-5rem)]">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel
              minSize={30}
              className={`px-8 h-full ${!chatVisible ? "hidden" : ""}`}
            >
              <ChatPanel
                conversationHistory={conversationHistory}
                isLoading={isLoading}
                generatingsite={false}
                prompt={prompt}
                submitPrompt={initiateConversation}
                setPrompt={setPrompt}
              />
            </ResizablePanel>

            <ResizableHandle
              withHandle
              className={` ${!(chatVisible && isGen) ? "hidden" : ""}`}
            />

            <ResizablePanel
              minSize={30}
              className={`px-2 ${!isGen ? "hidden" : ""}`}
            >
              <PreviewBar
                chatVisible={chatVisible}
                setChatVisible={setChatVisible}
              />
            </ResizablePanel>
          </ResizablePanelGroup>
        </main>
      </div>
    </div>
  );
}
