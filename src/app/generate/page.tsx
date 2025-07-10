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
  Paintbrush,
  Pen,
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
import { Accordion } from "@radix-ui/react-accordion";
import {
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

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
    businessType: "cake delivery",
    targetAudience: "",
    tone: "",
    primaryGoal: "",
    designPreferences: "",
  });
  const [generatingsite, setGeneratingSite] = useState(false);
  const [detailsFromLLM, setDetailsFromLLM] = useState({});
  const [stylesFromLLM, setStylesFromLLM] = useState<GenStyles>({
    color: "blue",
    muted: "slate",
    font: {
      primary: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
  });
  const [siteComplete, setSiteComplete] = useState(false);
  const [initialStyles, setInitialStyles] = useState<GenStyles>({
    color: "blue",
    muted: "slate",
    font: {
      primary: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
  });

  const [heroImg, setHeroImg] = useState(
    "https://images.unsplash.com/photo-1510936111840-65e151ad71bb?crop=entropy&cs=srgb&fm=jpg&ixid=M3w0Mzk3Njh8MHwxfHNlYXJjaHwxfHxibGFua3xlbnwwfDB8fHwxNzUyMTY2NjU3fDA&ixlib=rb-4.1.0&q=85"
  );

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
        setInitialStyles,
        setIsLoading,
        setSiteComplete,
        user.accessToken
      );

      getHeroImg(websiteDetails);
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
          payload: {
            content: detailsFromLLM,
            styles: stylesFromLLM,
            heroImg: heroImg,
          },
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
  }, [detailsFromLLM, stylesFromLLM, heroImg]);

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

  const getRelColList = () => {
    const allPairs = [
      {
        color: colorMap[initialStyles?.color].button,
        muted: colorMap[initialStyles?.muted],
        col1: initialStyles?.color,
        col2: initialStyles?.muted,
      },
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
        color: "bg-gray-700",
        muted: colorMap[initialStyles?.muted],
        col1: "black",
        col2: initialStyles?.muted,
      },
      {
        color: "bg-zinc-500",
        muted: "bg-gray-300",
        col1: "zinc",
        col2: "gray",
      },
      {
        color: "bg-white",
        muted: "bg-gray-700",
        col1: "black",
        col2: "black",
      },
    ];

    return allPairs;
  };

  const getFontsList = () => {
    return [
      { primary: "inter", body: "inter" }, // Modern / SaaS / Clean
      { primary: "handlee", body: "nunito" }, // Playful / Casual
      { primary: "georgia", body: "libre-baskerville" }, // Editorial / Traditional
      { primary: "work-sans", body: "work-sans" }, // Minimalist
      { primary: "arial-black", body: "system-ui" }, // Brutalist
      { primary: "courier", body: "georgia" }, // Vintage / Retro
      { primary: "segoe-ui", body: "roboto" }, // Corporate / Professional
      { primary: "playfair-display", body: "lora" }, // Luxury / Elegant
      { primary: "nunito-sans", body: "open-sans" }, // Friendly / Humanist
      { primary: "orbitron", body: "roboto-mono" }, // Tech / Futuristic
    ];
  };

  const getHeroImg = async (websiteDetails: any) => {
    if (!websiteDetails || !websiteDetails.businessType) return;
    const response = await fetch(
      `https://api.unsplash.com/search/photos?query=${websiteDetails.businessType}&orientation=landscape&page=1&per_page=1&client_id=NnFxmV1FS3-YfreNX_sliS2dvLLstQ03RJDYimSEpyk`
    );
    const data = await response.json();
    if (data?.results[0]?.urls?.full) setHeroImg(data?.results[0]?.urls?.full);
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
            className="cursor-pointer"
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
                            <Settings
                              className="cursor-pointer"
                              aria-label="Open settings"
                            />
                          </PopoverTrigger>
                          <PopoverContent className="space-y-3 mr-4 p-4 rounded-lg shadow-lg bg-background border border-border max-w-xs">
                            <Accordion
                              type="single"
                              collapsible
                              className="w-full"
                              defaultValue="item-1"
                            >
                              <AccordionItem value="item-1">
                                <AccordionTrigger>
                                  <div className="flex gap-2">
                                    <Paintbrush></Paintbrush>
                                    <span className="font-semibold text-base">
                                      Theme Colors
                                    </span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-2 space-y-2">
                                  {getRelColList().map((item, idx) => {
                                    const colorClass = `${item.color}`;
                                    const mutedClass = `${item.muted}`;
                                    const isSelected =
                                      item.col1 === stylesFromLLM.color &&
                                      item.col2 === stylesFromLLM.muted;

                                    return (
                                      <div
                                        key={idx}
                                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all border border-transparent ${
                                          isSelected
                                            ? "ring-2 ring-primary bg-primary/10"
                                            : "hover:ring-2 hover:ring-accent hover:bg-accent/10"
                                        }`}
                                        onClick={() =>
                                          setStylesFromLLM((prev) => {
                                            return {
                                              color: item.col1,
                                              muted: item.col2,
                                              font: prev.font,
                                            };
                                          })
                                        }
                                        aria-selected={isSelected}
                                        tabIndex={0}
                                        title={`Select ${item.col1} / ${item.col2}`}
                                      >
                                        <div className="flex gap-1">
                                          <div
                                            className={`w-6 h-6 rounded ${colorClass} border border-border shadow-sm`}
                                            title={item.col1}
                                          />
                                          <div
                                            className={`w-6 h-6 rounded ${mutedClass} border border-border shadow-sm`}
                                            title={item.col2}
                                          />
                                        </div>
                                        <span className="text-xs font-mono text-muted-foreground">
                                          {item.col1} / {item.col2}
                                        </span>
                                        {isSelected && (
                                          <Check
                                            className="text-primary ml-auto"
                                            size={18}
                                            aria-label="Selected"
                                          />
                                        )}
                                      </div>
                                    );
                                  })}
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>

                            <Accordion
                              type="single"
                              collapsible
                              className="w-full"
                              defaultValue="item-1"
                            >
                              <AccordionItem value="item-1">
                                <AccordionTrigger>
                                  <div className="flex gap-2">
                                    <Pen></Pen>
                                    <span className="font-semibold text-base">
                                      Font Styles
                                    </span>
                                  </div>
                                </AccordionTrigger>
                                <AccordionContent className="p-2 space-y-2">
                                  {getFontsList().map((item, idx) => {
                                    const isSelected =
                                      item.primary ===
                                        stylesFromLLM.font.primary &&
                                      item.body === stylesFromLLM.font.body;

                                    return (
                                      <div
                                        key={idx}
                                        className={`flex items-center gap-3 p-2 rounded-lg cursor-pointer transition-all border border-transparent ${
                                          isSelected
                                            ? "ring-2 ring-primary bg-primary/10"
                                            : "hover:ring-2 hover:ring-accent hover:bg-accent/10"
                                        }`}
                                        onClick={() =>
                                          setStylesFromLLM((prev) => {
                                            return {
                                              ...prev,
                                              font: {
                                                primary: item.primary,
                                                body: item.body,
                                              },
                                            };
                                          })
                                        }
                                        aria-selected={isSelected}
                                        tabIndex={0}
                                        title={`Select ${item.primary} / ${item.body}`}
                                      >
                                        <span
                                          className={`font-${item.primary} text-base`}
                                        >
                                          {item.primary}
                                        </span>
                                        <span className="text-xs font-mono text-muted-foreground">
                                          {item.body}
                                        </span>
                                        {isSelected && (
                                          <Check
                                            className="text-primary ml-auto"
                                            size={18}
                                            aria-label="Selected"
                                          />
                                        )}
                                      </div>
                                    );
                                  })}
                                </AccordionContent>
                              </AccordionItem>
                            </Accordion>
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
