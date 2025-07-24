"use client";
import { useState } from "react";
import SidebarToggle from "./SidebarToggle";
import NavItems from "./NavItems";
import RecentChats from "./RecentChats";
import UserPopover from "./UserPopover";

export default function Sidebar() {
  const [isExpanded, setIsExpanded] = useState(false);

  return (
    <div
      className={`border-r text-card-foreground transition-all duration-300 ease-in-out flex flex-col justify-between p-3 h-screen ${
        isExpanded ? "w-64 bg-card" : "w-16 bg-background"
      }`}
    >
      <div className="flex flex-col gap-4">
        <SidebarToggle
          isExpanded={isExpanded}
          onToggle={() => setIsExpanded(!isExpanded)}
        />
        <NavItems isExpanded={isExpanded} />
        <RecentChats isExpanded={isExpanded} />
      </div>
      <UserPopover isExpanded={isExpanded} />
    </div>
  );
}
