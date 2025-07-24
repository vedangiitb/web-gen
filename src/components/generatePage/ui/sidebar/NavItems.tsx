"use client";
import { useRouter } from "next/navigation";
import { SquarePen, Search } from "lucide-react";
import { Tooltip, TooltipContent, TooltipTrigger } from "@/components/ui/tooltip";

export default function NavItems({ isExpanded }: { isExpanded: boolean }) {
  const router = useRouter();

  const navItems = [
    {
      icon: <SquarePen className="w-5 h-5" />,
      label: "New Chat",
      action: () => router.push("/"),
    },
    {
      icon: <Search className="w-5 h-5" />,
      label: "Search",
      action: () => {},
    },
  ];

  return (
    <div className="flex flex-col gap-2">
      {navItems.map((item, idx) => (
        <Tooltip key={idx}>
          <TooltipTrigger asChild>
            <button
              className={`flex items-center gap-3 cursor-pointer w-full text-sm p-2 rounded-md hover:bg-muted transition ${
                !isExpanded && "justify-center"
              }`}
              onClick={item.action}
            >
              {item.icon}
              {isExpanded && <span>{item.label}</span>}
            </button>
          </TooltipTrigger>
          {!isExpanded && (
            <TooltipContent side="right" className="text-xs">
              {item.label}
            </TooltipContent>
          )}
        </Tooltip>
      ))}
    </div>
  );
}
