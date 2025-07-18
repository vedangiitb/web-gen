"use client";
import { useAuth } from "@/components/auth/AuthContext";
import NavBar from "@/components/others/navbar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { supabase } from "@/lib/supabaseClient";
import {
  ExternalLink,
  PanelLeftClose,
  PanelLeftOpen,
  Save,
} from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { toast } from "sonner";
import { captureWebsiteDetails } from "./captureWebsiteDetails";
import ChatBox from "./ChatBox";
import ChatHistory from "./ChatHistory";
import { generateSite } from "./generateSite";
import { generateSiteStyles } from "./generateSiteStyles";
import ImageSearcher from "./imageSearcher";
import PreviewFrame from "./PreviewFrame";
import SideBar from "./sidebar";
import { getHeroImg } from "./stylesEdit";
import StyleSettings from "./StyleSettings";
import { updatedb } from "./updateDb";
type WebsiteDetails = {
  businessName: string;
  businessType: string;
  targetAudience: string;
  tone: string;
  primaryGoal: string;
  designPreferences: string;
};

export default function GenerateWebsite() {
  const serarchParams = useSearchParams();
  const id = serarchParams.get("id");
  const user = useAuth();
  const [prompt, setPrompt] = useState<string>("");
  const [isGen, setIsGen] = useState<boolean>(true);
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [conversationHistory, setConversationHistory] = useState<
    { role: string; parts: { text: string }[] }[]
  >([]);
  const [generatingsite, setGeneratingSite] = useState(false);
  const [websiteDetails, setWebsiteDetails] = useState<WebsiteDetails>({
    businessName: "",
    businessType: "",
    targetAudience: "",
    tone: "",
    primaryGoal: "",
    designPreferences: "",
  });
  const [detailsFromLLM, setDetailsFromLLM] = useState([]);
  const [stylesFromLLM, setStylesFromLLM] = useState<GenStyles>({
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
  const [initialStyles, setInitialStyles] = useState<GenStyles>({
    color: "blue",
    muted: "slate",
    font: {
      primary: "Inter, sans-serif",
      body: "Inter, sans-serif",
    },
  });
  const [heroImgquery, setHeroImgQuery] = useState("");
  const [chatVisible, setChatVisible] = useState(true);
  const [chatId, setChatId] = useState<string | null>(null);
  const [showPreview, setShowPreview] = useState(false);
  const [changes, setChanges] = useState(false);
  const [editMode, setEditMode] = useState(false);
  const [showImgBox, setShowImgBox] = useState(false);

  const openInNewWindow = () => {
    const previewData = {
      content: detailsFromLLM,
      styles: stylesFromLLM,
      heroImg: heroImg,
    };

    localStorage.setItem("previewData", JSON.stringify(previewData));
    window.open("/preview", "_blank");
  };
  useEffect(() => {
    const handleMessage = (event: any) => {
      if (event.data?.type === "showImgBox") {
        setShowImgBox((prev) => !prev);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

  const getConversation = async (id: string) => {
    if (!id) return;

    try {
      const { data, error } = await supabase
        .from("user_conversations")
        .select("*")
        .eq("id", id)
        .single();

      if (error) throw error;
      if (!data) return;
      localStorage.setItem("chatId", id);

      const { conv_history, id: chatId, content, style, hero_img } = data;

      if (conv_history) {
        setConversationHistory(conv_history);
        setChatId(chatId);

        content ? setDetailsFromLLM(content) : setShowPreview(false);
        if (content) setShowPreview(true);

        if (style) {
          setStylesFromLLM(style);
          setInitialStyles(style);
        }

        if (hero_img) setHeroImg(hero_img);

        if (conv_history.length <= 2) {
          const inputText = conv_history[1]?.parts?.[0]?.text ?? "";
          if (inputText) {
            captureWebsiteDetails(
              inputText,
              setConversationHistory,
              conv_history,
              setIsLoading,
              websiteDetails,
              setWebsiteDetails,
              setGeneratingSite,
              setShowPreview,
              user.accessToken,
              (updateData: any) => updatedb(updateData, chatId)
            );
          }
        }
      }
    } catch (err) {
      console.error("Error fetching conversation:", err);
    }
  };

  const submitPrompt = useCallback(
    (e?: React.FormEvent) => {
      if (e) e.preventDefault();
      if (!prompt.trim()) return;

      if (!generatingsite && !showPreview) {
        const newHistory = [
          ...conversationHistory,
          { role: "user", parts: [{ text: prompt }] },
        ];

        captureWebsiteDetails(
          prompt,
          setConversationHistory,
          newHistory,
          setIsLoading,
          websiteDetails,
          setWebsiteDetails,
          setGeneratingSite,
          setShowPreview,
          user.accessToken,
          updatedb
        );
      }
      setPrompt("");
    },
    [prompt, conversationHistory]
  );

  useEffect(() => {
    if (id) getConversation(id);
  }, [id]);

  useEffect(() => {
    getHeroImg(heroImgquery, setHeroImg, updatedb);
  }, [heroImgquery]);

  useEffect(() => {
    if (generatingsite && Object.keys(detailsFromLLM).length === 0) {
      generateSite(
        websiteDetails,
        setDetailsFromLLM,
        setIsLoading,
        user.accessToken,
        updatedb
      );

      generateSiteStyles(
        websiteDetails,
        setStylesFromLLM,
        setInitialStyles,
        setIsLoading,
        user.accessToken,
        setHeroImgQuery,
        updatedb
      );
    }
  }, [generatingsite]);

  const updateWebsiteData = () => {
    if (!detailsFromLLM || !stylesFromLLM) return;

    const previewData = {
      content: detailsFromLLM,
      styles: stylesFromLLM,
      heroImg: heroImg,
    };

    localStorage.setItem("previewData", JSON.stringify(previewData));
    console.log("📦 Saved to localStorage:", previewData);

    const iframe = document.getElementById(
      "preview-frame"
    ) as HTMLIFrameElement;
    iframe?.contentWindow?.postMessage(
      {
        type: "previewDataUpdated",
      },
      window.location.origin
    );
  };

  useEffect(() => {
    updateWebsiteData();
  }, [detailsFromLLM, stylesFromLLM, heroImg]);

  const toggleEditMode = () => {
    const iframe = document.getElementById(
      "preview-frame"
    ) as HTMLIFrameElement;
    iframe?.contentWindow?.postMessage(
      {
        type: "editMode",
        value: !editMode,
      },
      window.location.origin
    );

    setEditMode(!editMode);
  };

  const updateImage = (imgLink: string) => {
    setHeroImg(imgLink);
    updatedb({ hero_img: imgLink });
  };

  return (
    <div className="max-h-screen text-foreground flex">
      <SideBar />

      <div className="w-full">
        <NavBar />

        <main className="flex h-[calc(100vh-5rem)]">
          <ResizablePanelGroup direction="horizontal" className="h-full">
            <ResizablePanel
              minSize={30}
              className={`pl-8 pr-4 h-full ${!chatVisible ? "hidden" : ""}`}
            >
              <div className="h-full flex flex-col justify-between overflow-hidden">
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
                  <h3 className="font-semibold text-lg">Preview</h3>

                  {showPreview ? (
                    <div className="flex gap-4">
                      <Tooltip>
                        <TooltipTrigger asChild>
                          <Switch
                            className={`border-2 h-5 w-8 border-muted-foreground bg-muted-foreground`}
                            checked={editMode}
                            onCheckedChange={toggleEditMode}
                          />
                        </TooltipTrigger>
                        <TooltipContent side="right" className="text-xs">
                          Turn edit Mode {editMode ? "off" : "on"}
                        </TooltipContent>
                      </Tooltip>

                      <Save
                        className={`cursor-pointer w-5 h-5 ${
                          changes ? "" : "text-muted-foreground"
                        }`}
                        onClick={async () => {
                          if (!changes) return;
                          const ret = updatedb({
                            style: stylesFromLLM,
                            content: detailsFromLLM,
                          });
                          if (await ret) {
                            toast("Details updated successfullly!");
                            setChanges(false);
                          } else toast("Error while updating details");
                        }}
                      />

                      <StyleSettings
                        stylesFromLLM={stylesFromLLM}
                        setStylesFromLLM={setStylesFromLLM}
                        initialStyles={initialStyles}
                        setChanges={setChanges}
                      />

                      <ExternalLink
                        className="cursor-pointer w-5 h-5"
                        onClick={openInNewWindow}
                      ></ExternalLink>
                    </div>
                  ) : null}
                </div>

                {showPreview ? (
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
                  <PreviewFrame />
                )}
              </div>
            </ResizablePanel>
          </ResizablePanelGroup>

          {showImgBox && (
            <ImageSearcher
              access_token={user.accessToken}
              cancel={setShowImgBox}
              updateImage={updateImage}
            />
          )}
        </main>
      </div>
    </div>
  );
}
