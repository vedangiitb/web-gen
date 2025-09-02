"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Sparkles } from "lucide-react";
import { useState } from "react";
import { AIPopoverContent } from "./AIPopoverContent";

export function AIButtonWithPopover({
  content,
  replaceContent,
}: {
  content?: string;
  replaceContent?: (content: string) => void;
}) {
  const [open, setOpen] = useState(false);

  return (
    <Popover open={open} onOpenChange={setOpen}>
      <PopoverTrigger asChild>
        <button
          onClick={() => setOpen(true)}
          className="p-1 rounded-full shadow-lg bg-gradient-to-br from-purple-500 to-indigo-600 text-white hover:from-purple-600 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-purple-500 focus:ring-opacity-75 transition-all duration-200 ease-in-out"
          aria-label="Generate with AI"
        >
          <Sparkles size={16} className="drop-shadow-sm" />
        </button>
      </PopoverTrigger>
      <PopoverContent className="w-80 p-0 shadow-lg border ml-2">
        <AIPopoverContent
          onClose={() => setOpen(false)}
          content={content}
          replaceContent={replaceContent}
        />
      </PopoverContent>
    </Popover>
  );
}
