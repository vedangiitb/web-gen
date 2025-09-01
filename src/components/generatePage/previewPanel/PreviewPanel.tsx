import { useState } from "react";
import PreviewFrame from "./PreviewFrame";
import PreviewTopbar from "./Topbar/PreviewTopbar";
export default function PreviewBar({
  chatVisible,
  setChatVisible,
  showPreview,
  editMode,
  setEditMode,
  stylesFromLLM,
  setStylesFromLLM,
  initialStyles,
  setChanges,
  changes,
  openInNewWindow,
  detailsFromLLM,
}: {
  chatVisible: boolean;
  setChatVisible: (visible: boolean) => void;
  showPreview?: boolean;
  editMode?: boolean;
  setEditMode?: React.Dispatch<React.SetStateAction<boolean>>;
  stylesFromLLM?: any;
  setStylesFromLLM?: (styles: any) => void;
  initialStyles?: any;
  setChanges?: React.Dispatch<React.SetStateAction<boolean>>;
  changes?: boolean;
  openInNewWindow?: () => void;
  detailsFromLLM?: any;
}) {
  const toggleEditMode = () => {
    if (!setEditMode) return;
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

  const [width, setW] = useState("100%");

  const setWidth = (mode: "phone" | "tablet" | "pc") => {
    if (mode == "phone") {
      setW("375px");
    } else if (mode == "tablet") {
      setW("600px");
    } else setW("100%");
  };

  return (
    <div className="h-full flex flex-col p-2">
      <PreviewTopbar
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
        setWidth={setWidth}
        width={width}
      />

      {showPreview ? (
        <iframe
          id="preview-frame"
          src="/preview"
          style={{
            margin: "auto",
            height: "800px",
            width: width,
            border: "1px solid #ddd",
            borderRadius: "6px",
          }}
        />
      ) : (
        <PreviewFrame />
      )}
    </div>
  );
}
