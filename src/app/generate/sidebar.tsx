"use client";
import { useAuth } from "@/components/auth/AuthContext";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { supabase } from "@/lib/supabaseClient";
import { Search, Sidebar as SidebarIcon, SquarePen } from "lucide-react";
import { useRouter } from "next/navigation";
import { useEffect, useState } from "react";

interface recentChatInterface {
  chatId: string;
  chatName: string;
}

export default function SideBar() {
  const [isExpanded, setIsExpanded] = useState(false);
  const [recentChats, setRecentChats] = useState<recentChatInterface[]>([]);
  const user = useAuth();
  const router = useRouter();

  useEffect(() => {
    getRecentChats();
  }, [user]);

  const getRecentChats = async () => {
    if (!user?.userId) return;

    try {
      const { data } = await supabase
        .from("user_conversations")
        .select("id, name")
        .eq("user_id", user.userId)
        .throwOnError();

      if (data) {
        setRecentChats(
          data.map(({ id, name }) => ({ chatId: id, chatName: name }))
        );
      }
    } catch (error) {
      console.error("Failed to fetch recent chats:", error);
    }
  };

  const navItems = [
    {
      icon: <SquarePen className="w-5 h-5" />,
      label: "New Chat",
      action: () => {
        router.push("/");
      },
    },
    {
      icon: <Search className="w-5 h-5" />,
      label: "Search",
      action: () => {
        // Implement search functionality if needed
      },
    },
  ];

  return (
    <div
      className={`border-r bg-background text-foreground transition-all duration-300 ease-in-out
      flex flex-col gap-4 p-3 h-screen
      ${isExpanded ? "w-64" : "w-16"}`}
    >
      {/* Sidebar toggle */}
      <div className="flex justify-end">
        <Tooltip>
          <TooltipTrigger asChild>
            <button
              onClick={() => setIsExpanded(!isExpanded)}
              className="p-2 rounded-md hover:bg-muted transition cursor-pointer"
            >
              <SidebarIcon className="w-5 h-5" />
            </button>
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            {isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
          </TooltipContent>
        </Tooltip>
      </div>

      {/* Nav Items */}
      <div className="flex flex-col gap-2">
        {navItems.map((item, idx) => (
          <Tooltip key={idx}>
            <TooltipTrigger asChild>
              <button
                className={`flex items-center gap-3 cursor-pointer w-full text-sm p-2 rounded-md hover:bg-muted transition
                ${!isExpanded && "justify-center"}`}
                onClick={item.action}
              >
                {item.icon}
                {isExpanded && <span>{item.label}</span>}
              </button>
            </TooltipTrigger>
            {!isExpanded && (
              <TooltipContent side="right" className="text-xs">
                {item.label}
              </TooltipContent>
            )}
          </Tooltip>
        ))}
      </div>

      {/* Recent Chats */}
      {isExpanded && (
        <div className="flex flex-col mt-4 border-t pt-4">
          <p className="text-muted-foreground mb-2 px-1">Recent Chats</p>
          {recentChats.length ? (
            <div className="flex flex-col gap-1">
              {recentChats.reverse().map((item) => (
                <button
                  key={item.chatId}
                  onClick={() => {
                    router.push(`/generate?id=${item.chatId}`);
                  }}
                  className="text-left px-2 py-1 rounded-md hover:bg-muted transition cursor-pointer"
                >
                  {item.chatName}
                </button>
              ))}
            </div>
          ) : (
            <p className="text-muted-foreground text-xs px-1">
              Your recent chats will be shown here.
            </p>
          )}
        </div>
      )}
    </div>
  );
}
