"use client";
import SideBar from "@/components/generatePage/ui/sidebar/sidebar";
import NavBar from "@/components/others/navbar";
import { supabase } from "@/lib/supabaseClient";
import { useRouter } from "next/navigation";
import { useCallback, useState } from "react";
import { toast } from "sonner";
import { useAuth } from "../auth/AuthContext";
import ChatBox from "../generatePage/ui/chat/ChatBox";

type ConversationRow = {
  id: string;
  user_id: string;
  name: string;
  conv_history: any;
};

export default function LandingPage() {
  const router = useRouter();
  const user = useAuth();
  const [prompt, setPrompt] = useState<string>("");
  const [isLoading, setIsloading] = useState(false);
  const [conversationHistory, setConversationHistory] = useState([
    {
      role: "model",
      parts: [
        {
          text: "Hello!\n I am Web-Gen, the new age website generator! Tell me what type of website you want, and it will be ready for you in minutes.",
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

      if (user?.userId) {
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
      } else {
        router.push("/login");
        toast("Please Login In or Sign Up to continue!");
      }
    },
    [prompt, conversationHistory, user, router]
  );

  return (
    <div className="h-screen text-foreground flex">
      <SideBar />

      <div className="w-full flex flex-col h-screen">
        <main className="flex-1 relative overflow-hidden">
          <NavBar />

          {/* Fancy animated gradient background */}
          <div className="absolute inset-0 -z-10">
            <div className="w-full h-full bg-gradient-to-br from-[#252268] via-[#732ff3]/80 to-[#6de7e1]/90 animate-bg-flow" />
            {/*subtle noise layer and glow overlays*/}
            <div className="absolute inset-0 bg-black/60 backdrop-blur-sm pointer-events-none" />
            <div className="absolute inset-0 pointer-events-none [mask-image:radial-gradient(ellipse_at_center,white_80%,transparent_100%)]">
              <div className="absolute left-1/2 top-32 -translate-x-1/2 w-[700px] h-[700px] bg-[radial-gradient(circle,rgba(129,205,255,0.12)_40%,transparent_80%)] blur-2xl"></div>
              <div className="absolute right-10 bottom-20 w-[300px] h-[400px] bg-[radial-gradient(circle,rgba(215,96,255,0.1)_40%,transparent_100%)] blur-2xl"></div>
            </div>
          </div>

          <div className="h-[calc(100vh-5rem)] relative z-10 flex flex-col items-center justify-center px-4 py-12 text-center gap-10 md:gap-12">
            <h1 className="relative text-4xl md:text-6xl font-black tracking-tight bg-clip-text text-transparent bg-gradient-to-tr from-teal-200 via-purple-300 to-pink-400 drop-shadow-2xl animate-fadein-smooth select-none">
              <span className="block mb-2 animate-gradient-move">
                Build Your Dream Website
              </span>
              <span className="block text-3xl md:text-5xl font-bold bg-clip-text text-transparent bg-gradient-to-br from-white via-purple-100 to-cyan-200 opacity-90">
                in Just a Few Clicks
              </span>
              {/* Glow effect */}
              <span className="absolute -bottom-3 left-1/2 -translate-x-1/2 w-2/3 h-8 bg-gradient-to-r from-purple-300 via-transparent to-cyan-200 blur-2xl opacity-60 pointer-events-none"></span>
            </h1>
            <p className="text-base md:text-xl text-slate-200/90 font-medium leading-relaxed max-w-xl mx-auto drop-shadow-lg">
              Describe your website idea and let{" "}
              <span className="font-semibold text-teal-300">Web-Gen</span> turn
              it into reality with the power of AI.
              <br className="hidden md:block" />
              <span className="text-white font-semibold">
                It’s truly that simple.
              </span>
            </p>

            <div className="w-full max-w-2xl mx-auto">
              {/* <div className="rounded-3xl shadow-2xl bg-white/10 ring-1 ring-white/10 backdrop-blur-md p-5 md:p-6 drop-shadow-2xl glassmorphism-card"> */}
                <ChatBox
                  prompt={prompt}
                  submitPrompt={initiateConversation}
                  setPrompt={setPrompt}
                  isLoading={isLoading}
                />
              {/* </div> */}
              {!user.userId ? (
                <p className="mt-4 text-slate-400 text-xs opacity-90 select-none">
                  🚀 <b>No pricing setup needed</b> to try the demo — sign in to
                  save your progress &amp; unlock full features!
                </p>
              ) : null}
            </div>
          </div>
        </main>
      </div>

      {/* Animations CSS */}
      <style jsx global>{`
        .animate-bg-flow {
          background-size: 250% 250%;
          animation: bgflow 14s linear infinite alternate;
        }
        @keyframes bgflow {
          0% {
            background-position: 0% 50%;
          }
          100% {
            background-position: 100% 100%;
          }
        }
        .animate-gradient-move {
          background-size: 200% 200%;
          animation: gradmove 4s ease-in-out infinite alternate;
        }
        @keyframes gradmove {
          0% {
            background-position: 0% 60%;
          }
          100% {
            background-position: 100% 50%;
          }
        }
        .animate-fadein-smooth {
          animation: fadein-landing 1.2s cubic-bezier(0.33, 1.61, 0.63, 1) both;
        }
        @keyframes fadein-landing {
          0% {
            opacity: 0;
            transform: translateY(36px) scale(0.98);
          }
          100% {
            opacity: 1;
            transform: translateY(0) scale(1);
          }
        }
        .glassmorphism-card {
          box-shadow: 0 12px 60px 0 rgba(68, 0, 170, 0.11);
          backdrop-filter: blur(24px);
        }
      `}</style>
    </div>
  );
}
