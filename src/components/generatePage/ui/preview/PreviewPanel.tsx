import PreviewFrame from "./PreviewFrame";
import PreviewTopbar from "./PreviewTopbar";
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
      />

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
  );
}
