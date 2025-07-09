"use client";
import { useAuth } from "@/components/auth/AuthContext";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Textarea } from "@/components/ui/textarea";
import {
  ArrowUp,
  Check,
  Circle,
  ExternalLink,
  LogOut,
  Moon,
  Settings,
  Square,
  Sun,
} from "lucide-react";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { captureWebsiteDetails } from "./captureWebsiteDetails";
import { generateSite } from "./generateSite";
import RenderAIResponse from "./RenderAIResponse";
import RenderUserMessage from "./RenderUserMessage";
import TypingIndicator from "./TypingIndicator";
import { generateSiteStyles } from "./generateSiteStyles";
import { colorMap } from "@/components/generator/colorMap";

export default function GenerateWebsite() {
  const user = useAuth();
  const { logout } = useAuth();
  const router = useRouter();
  const [prompt, setPrompt] = useState<string>("");
  const [isGen, setIsGen] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [darkMode, setDarkMode] = useState<boolean>(true);
  const [conversationHistory, setConversationHistory] = useState<
    { role: string; parts: { text: string }[] }[]
  >([]);
  const [websiteDetails, setWebsiteDetails] = useState<{
    businessName: string;
    businessType: string;
    targetAudience: string;
    tone: string;
    primaryGoal: string;
    designPreferences: string;
  }>({
    businessName: "",
    businessType: "",
    targetAudience: "",
    tone: "",
    primaryGoal: "",
    designPreferences: "",
  });
  const [generatingsite, setGeneratingSite] = useState(false);
  const [detailsFromLLM, setDetailsFromLLM] = useState({});
  const [stylesFromLLM, setStylesFromLLM] = useState<GenStyles>({
    color: "blue",
    muted: "indigo",
  });
  const [siteComplete, setSiteComplete] = useState(false);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  useEffect(() => {
    setConversationHistory((items) => [
      ...items,
      {
        role: "model",
        parts: [
          {
            text: "Hello!\n I am Web-Gen, the new age website generator!. Tell me what type of website do you want, and it will be ready for you in minutes",
          },
        ],
      },
    ]);
  }, []);

  useEffect(() => {
    if (generatingsite) {
      generateSite(
        websiteDetails,
        setDetailsFromLLM,
        setIsLoading,
        setSiteComplete,
        user.accessToken
      );

      generateSiteStyles(
        websiteDetails,
        setStylesFromLLM,
        setIsLoading,
        setSiteComplete,
        user.accessToken
      );
    }
  }, [generatingsite]);

  useEffect(() => {
    const iframe = document.getElementById(
      "preview-frame"
    ) as HTMLIFrameElement;

    if (!iframe || !detailsFromLLM || !stylesFromLLM) return;

    const sendMessage = () => {
      console.log("📤 Sending preview data to iframe", detailsFromLLM);
      iframe.contentWindow?.postMessage(
        {
          type: "previewData",
          payload: { content: detailsFromLLM, styles: stylesFromLLM },
        },
        window.location.origin
      );
    };

    if (iframe.contentWindow) {
      // Check if already loaded
      if (
        iframe.contentDocument?.readyState === "complete" ||
        iframe.contentDocument?.readyState === "interactive"
      ) {
        sendMessage(); // iframe already loaded
      } else {
        // Wait for load
        iframe.addEventListener("load", sendMessage);
      }
    }

    return () => {
      iframe.removeEventListener("load", sendMessage);
    };
  }, [detailsFromLLM, stylesFromLLM]);

  const submitPrompt = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!prompt.trim()) return;

      if (!generatingsite) {
        captureWebsiteDetails(
          prompt,
          setConversationHistory,
          conversationHistory,
          setIsLoading,
          websiteDetails,
          setWebsiteDetails,
          setGeneratingSite,
          user.accessToken
        );
      }
      setPrompt("");
    },
    [prompt, conversationHistory]
  );

  const iframeSrc = "/preview";

  const openInNewWindow = () => {
    window.open(iframeSrc, "_blank", "noopener,noreferrer");
  };

  const getRelColList = (col1: string, col2: string) => {
    const allPairs = [
      { color: "bg-blue-500", muted: "bg-sky-300", col1: "blue", col2: "sky" },
      {
        color: "bg-indigo-500",
        muted: "bg-violet-300",
        col1: "indigo",
        col2: "violet",
      },
      {
        color: "bg-emerald-500",
        muted: "bg-green-300",
        col1: "emerald",
        col2: "green",
      },
      {
        color: "bg-orange-500",
        muted: "bg-amber-300",
        col1: "orange",
        col2: "amber",
      },
      {
        color: "bg-purple-500",
        muted: "bg-fuchsia-300",
        col1: "purple",
        col2: "fuchsia",
      },
      {
        color: "bg-teal-500",
        muted: "bg-cyan-300",
        col1: "teal",
        col2: "cyan",
      },
      {
        color: "bg-lime-500",
        muted: "bg-indigo-300",
        col1: "lime",
        col2: "indigo",
      },
      {
        color:"bg-zinc-500",
        muted:"bg-gray-300",
        col1:"zinc",
        col2:"gray"
      }
    ];

    return allPairs;
  };

  return (
    <div className="max-h-screen text-foreground">
      {/* Header */}
      <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4 bg-card/80 backdrop-blur border-b border-border shadow-md">
        <div className="flex items-center gap-3">
          <span className="text-xl font-bold tracking-tight">
            Website Generator
          </span>
        </div>

        <div className="flex items-center gap-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
          >
            {darkMode ? <Moon size={18} /> : <Sun size={18} />}
          </Button>
          {user.currentUser === "Login" ? (
            <Link
              href="/login"
              className="cursor-pointer text-[#00289f] bg-transparent border-none outline-none"
              type="button"
            >
              {user.currentUser}
            </Link>
          ) : (
            <Popover>
              <PopoverTrigger>
                <span className="cursor-pointer">{user.currentUser}</span>
              </PopoverTrigger>
              <PopoverContent className="space-y-2">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <p>Logout</p>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </header>

      <main className="px-4 h-[calc(100vh-5rem)]">
        <ResizablePanelGroup direction="horizontal" className="h-full">
          {/* Chat Panel */}
          <ResizablePanel minSize={30} className="p-2 h-full">
            <div className="h-full flex flex-col justify-between overflow-hidden">
              {/* Chat History */}
              <div
                className="flex-1 overflow-y-auto p-4 custom-scrollbar"
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
                {isLoading && (
                  <TypingIndicator generatingsite={generatingsite} />
                )}
              </div>

              {/* Input Form */}
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
            </div>
          </ResizablePanel>

          {isGen && <ResizableHandle withHandle />}

          {isGen && (
            <ResizablePanel minSize={30} className="pl-2">
              <div className="h-full flex flex-col p-2">
                <div className="flex justify-between items-center mb-3">
                  <h3 className="font-semibold text-lg">Preview</h3>

                  <div className="flex gap-4">
                    {generatingsite ? (
                      <div>
                        <Popover>
                          <PopoverTrigger>
                            <Settings className="cursor-pointer"></Settings>
                          </PopoverTrigger>
                          <PopoverContent className="space-y-2">
                            <p>Website Theme</p>

                            {getRelColList(
                              stylesFromLLM.color,
                              stylesFromLLM.muted
                            ).map((item, idx) => {
                              // Compose Tailwind color classes dynamically
                              const colorClass = `${item.color}`;
                              const mutedClass = `${item.muted}`;

                              // Check if this is the selected color pair
                              const isSelected =
                                item.col1 === stylesFromLLM.color &&
                                item.col2 === stylesFromLLM.muted;

                              return (
                                <div
                                  key={idx}
                                  className={`flex items-center gap-2 p-1 rounded cursor-pointer transition-all ${
                                    isSelected
                                      ? "ring-2 ring-primary"
                                      : "hover:ring-2 hover:ring-accent"
                                  }`}
                                  onClick={() =>
                                    setStylesFromLLM({
                                      color: item.col1,
                                      muted: item.col2,
                                    })
                                  }
                                >
                                  <div className="flex gap-1">
                                    <div
                                      className={`w-6 h-6 rounded ${colorClass} border border-border`}
                                      title={item.col1}
                                    />
                                    <div
                                      className={`w-6 h-6 rounded ${mutedClass} border border-border`}
                                      title={item.col2}
                                    />
                                  </div>
                                  <span className="text-xs font-mono text-muted-foreground">
                                    {item.col1} / {item.col2}
                                  </span>
                                  {isSelected && (
                                    <Check className="text-primary" size={18} />
                                  )}
                                </div>
                              );
                            })}
                          </PopoverContent>
                        </Popover>
                      </div>
                    ) : null}

                    {generatingsite ? (
                      <ExternalLink onClick={openInNewWindow}></ExternalLink>
                    ) : null}
                  </div>
                </div>

                {generatingsite ? (
                  <iframe
                    id="preview-frame"
                    src="/preview"
                    style={{
                      width: "100%",
                      height: "800px",
                      border: "1px solid #ddd",
                      borderRadius: "8px",
                    }}
                  />
                ) : (
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
                )}

                {/* <iframe
                  id="preview-frame"
                  src="/preview"
                  style={{
                    width: "100%",
                    height: "800px",
                    border: "1px solid #ddd",
                    borderRadius: "8px",
                  }}
                /> */}
              </div>
            </ResizablePanel>
          )}
        </ResizablePanelGroup>
      </main>

      {/* Global Styles */}
      <style jsx global>{`
        .custom-scrollbar {
          scrollbar-width: thin;
          scrollbar-color: var(--muted-foreground) var(--background);
        }
        .custom-scrollbar::-webkit-scrollbar {
          width: 8px;
          background: var(--background);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb {
          background: var(--muted-foreground);
          border-radius: 8px;
        }
        .custom-scrollbar::-webkit-scrollbar-thumb:hover {
          background: var(--accent);
        }
      `}</style>
    </div>
  );
}
