import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { Monitor, Smartphone, Tablet } from "lucide-react";
export default function WidthSetting({
  width,
  setWidth,
}: {
  width: string;
  setWidth: (mode: "phone" | "tablet" | "pc") => void;
}) {
  return (
    <div>
      {width == "100%" ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Tablet
              className="cursor-pointer w-5 h-5"
              onClick={() => setWidth("tablet")}
            />
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            Switch to Tablet View
          </TooltipContent>
        </Tooltip>
      ) : width == "600px" ? (
        <Tooltip>
          <TooltipTrigger asChild>
            <Smartphone
              className="cursor-pointer w-5 h-5"
              onClick={() => setWidth("phone")}
            />
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            Switch to Phone View
          </TooltipContent>
        </Tooltip>
      ) : (
        <Tooltip>
          <TooltipTrigger asChild>
            <Monitor
              className="cursor-pointer w-5 h-5"
              onClick={() => setWidth("pc")}
            />
          </TooltipTrigger>
          <TooltipContent side="right" className="text-xs">
            Switch to Pc View
          </TooltipContent>
        </Tooltip>
      )}
    </div>
  );
}
