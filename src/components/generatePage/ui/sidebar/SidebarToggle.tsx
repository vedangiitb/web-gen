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
    <div
      className={`relative flex items-center justify-between ${
        isExpanded ? "p-2" : "p-0"
      } mb-4`}
    >
      {isExpanded ? (
        <span className="font-extrabold text-lg tracking-wider text-transparent bg-gradient-to-tr from-teal-400/70 via-purple-500/70 to-cyan-400/70 bg-clip-text drop-shadow select-none ml-2 transition">
          Web Gen
        </span>
      ) : null}
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            onClick={onToggle}
            className={`
              flex justify-center items-center p-2 rounded-xl shadow hover:shadow-xl border
              hover:bg-muted
              transition-colors duration-150
              ${isExpanded ? "" : "w-full"}
            `}
            aria-label={isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
            tabIndex={0}
          >
            <SidebarIcon className="w-5 h-5 text-chart-2" />
          </button>
        </TooltipTrigger>
        <TooltipContent side="right" className="text-xs">
          {isExpanded ? "Collapse Sidebar" : "Expand Sidebar"}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
