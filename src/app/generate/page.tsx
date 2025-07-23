"use client";
import { useAuth } from "@/components/auth/AuthContext";
import { getHeroImg } from "@/components/generatePage/network/getHeroImg";
import ChatPanel from "@/components/generatePage/ui/chat/ChatPanel";
import PreviewTopbar from "@/components/generatePage/ui/preview/PreviewTopbar";
import NavBar from "@/components/others/navbar";
import {
  ResizableHandle,
  ResizablePanel,
  ResizablePanelGroup,
} from "@/components/ui/resizable";
import { supabase } from "@/lib/supabaseClient";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useState } from "react";
import { captureWebsiteDetails } from "../../components/generatePage/network/captureWebsiteDetails";
import { generateSite } from "../../components/generatePage/network/generateSite";
import { generateSiteStyles } from "../../components/generatePage/network/generateSiteStyles";
import { updatedb } from "../../components/generatePage/network/updateDb";
import ImageSearcher from "../../components/generatePage/ui/imageSearcher/imageSearcher";
import SideBar from "../../components/generatePage/ui/sidebar/sidebar";
import PreviewBar from "@/components/generatePage/ui/preview/PreviewBar";

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

  useEffect(() => {
    const handleMessage = (event: any) => {
      if (event.data?.type === "showImgBox") {
        setShowImgBox((prev) => !prev);
      }
    };

    window.addEventListener("message", handleMessage);
    return () => window.removeEventListener("message", handleMessage);
  }, []);

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
    updateWebsiteData();
  }, [detailsFromLLM, stylesFromLLM, heroImg]);

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
              <ChatPanel
                conversationHistory={conversationHistory}
                isLoading={isLoading}
                generatingsite={generatingsite}
                prompt={prompt}
                submitPrompt={submitPrompt}
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
                showPreview={showPreview}
                editMode={editMode}
                toggleEditMode={toggleEditMode}
                stylesFromLLM={stylesFromLLM}
                setStylesFromLLM={setStylesFromLLM}
                initialStyles={initialStyles}
                setChanges={setChanges}
                changes={changes}
                openInNewWindow={openInNewWindow}
                detailsFromLLM={detailsFromLLM}
              />
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
