import { Switch } from "@/components/ui/switch";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import {
  ExternalLink,
  PanelLeftClose,
  PanelLeftOpen,
  Save,
} from "lucide-react";
import { toast } from "sonner";
import { updatedb } from "../../network/updateDb";
import StyleSettings from "./StyleSettings";

export default function PreviewTopbar({
  chatVisible,
  setChatVisible,
  showPreview,
  editMode,
  toggleEditMode,
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
  toggleEditMode?: () => void;
  stylesFromLLM?: any;
  setStylesFromLLM?: (styles: any) => void;
  initialStyles?: any;
  setChanges?: React.Dispatch<React.SetStateAction<boolean>>;
  changes?: boolean;
  openInNewWindow?: () => void;
  detailsFromLLM?: any;
}) {
  return (
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

      {showPreview && setChanges ? (
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
  );
}
