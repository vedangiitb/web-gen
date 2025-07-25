"use client";
import { Sidebar as SidebarIcon } from "lucide-react";
import {
  Tooltip,
  TooltipContent,
  TooltipTrigger,
} from "@/components/ui/tooltip";

export default function SidebarToggle({
  isExpanded,
  onToggle,
}: {
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className={`flex justify-between items-center ${isExpanded?"p-2":""}`}>
      {isExpanded ? <p>Web Gen</p> : null}
      <Tooltip>
        <TooltipTrigger asChild className="p-0">
          <button
            onClick={onToggle}
            className={`flex justify-center items-center p-2 rounded-md hover:bg-muted transition cursor-pointer ${
              !isExpanded ? "w-full" : ""
            }`}
          >
            <SidebarIcon className="w-5 h-5" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          {isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
