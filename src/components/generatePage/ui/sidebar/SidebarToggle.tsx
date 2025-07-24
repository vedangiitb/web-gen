"use client";
import { Sidebar as SidebarIcon } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function SidebarToggle({
  isExpanded,
  onToggle,
}: {
  isExpanded: boolean;
  onToggle: () => void;
}) {
  return (
    <div className="flex justify-end">
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onToggle}
            className="p-2 rounded-md hover:bg-muted transition cursor-pointer"
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
