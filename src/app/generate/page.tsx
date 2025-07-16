"use client";
import { useAuth } from "@/components/auth/AuthContext";
import NavBar from "@/components/others/navbar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { supabase } from "@/lib/supabaseClient";
import { ExternalLink, PanelLeftClose, PanelLeftOpen } from "lucide-react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { captureWebsiteDetails } from "./captureWebsiteDetails";
import ChatBox from "./ChatBox";
import ChatHistory from "./ChatHistory";
import { generateSite } from "./generateSite";
import { generateSiteStyles } from "./generateSiteStyles";
import PreviewFrame from "./PreviewFrame";
import SideBar from "./sidebar";
import { getHeroImg } from "./stylesEdit";
import StyleSettings from "./StyleSettings";

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
  const [detailsFromLLM, setDetailsFromLLM] = useState({});
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

  const openInNewWindow = () => {
    const previewData = {
      content: detailsFromLLM,
      styles: stylesFromLLM,
      heroImg: heroImg,
    };

    // ✅ Save data BEFORE opening the tab
    localStorage.setItem("previewData", JSON.stringify(previewData));

    // ✅ Then open the new tab
    window.open("/preview", "_blank");
  };

  const getConversation = async (id: string) => {
    const { data, error } = await supabase
      .from("user_conversations")
      .select("*")
      .eq("id", id);
    console.log(data);
    if (error) {
      console.error(error);
      return;
    }

    if (data && data[0]?.conv_history) {
      setConversationHistory(data[0]?.conv_history);
      setChatId(data[0]?.id);

      if (data[0]?.content) {
        setDetailsFromLLM(data[0]?.content);
        setShowPreview(true);
      }
      if (data[0].style) {
        setStylesFromLLM(data[0]?.style);
        setInitialStyles(data[0]?.style);
      }
      if (data[0]?.hero_img) {
        setHeroImg(data[0]?.hero_img);
      }

      if (data[0]?.conv_history.length <= 2)
        captureWebsiteDetails(
          data[0]?.conv_history[1].parts[0].text,
          setConversationHistory,
          data[0]?.conv_history,
          setIsLoading,
          websiteDetails,
          setWebsiteDetails,
          setGeneratingSite,
          setShowPreview,
          user.accessToken,
          chatId,
          updatedb
        );
    }
  };

  const updatedb = async (updateData: any) => {
    if (!chatId) return;
    const { data, error } = await supabase
      .from("user_conversations")
      .update(updateData)
      .eq("id", chatId)
      .select("id");

    if (error) console.error(error);
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
          chatId,
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

  useEffect(() => {
    if (!detailsFromLLM || !stylesFromLLM) return;

    const previewData = {
      content: detailsFromLLM,
      styles: stylesFromLLM,
      heroImg: heroImg,
    };

    // Save to localStorage
    localStorage.setItem("previewData", JSON.stringify(previewData));
    console.log("📦 Saved to localStorage:", previewData);

    // Send postMessage to iframe if it's present
    const iframe = document.getElementById(
      "preview-frame"
    ) as HTMLIFrameElement;
    iframe?.contentWindow?.postMessage(
      {
        type: "previewDataUpdated",
      },
      window.location.origin
    );
  }, [detailsFromLLM, stylesFromLLM, heroImg]);

  return (
    <div className="max-h-screen text-foreground flex">
      {/* Header */}
      <SideBar />

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
                <ChatHistory
                  conversationHistory={conversationHistory}
                  isLoading={isLoading}
                  generatingsite={generatingsite}
                />

                {/* Input Form */}
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
              className={`pl-2 ${!isGen ? "hidden" : ""}`}
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

                  <div className="flex gap-4">
                    {showPreview ? (
                      <StyleSettings
                        stylesFromLLM={stylesFromLLM}
                        setStylesFromLLM={setStylesFromLLM}
                        initialStyles={initialStyles}
                      />
                    ) : null}

                    {showPreview ? (
                      <ExternalLink
                        className="cursor-pointer"
                        onClick={openInNewWindow}
                      ></ExternalLink>
                    ) : null}
                  </div>
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
        </main>
      </div>
    </div>
  );
}
