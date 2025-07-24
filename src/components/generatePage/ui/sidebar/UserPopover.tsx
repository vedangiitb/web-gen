"use client";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { CircleUser, HelpCircle, LogOut } from "lucide-react";
import { useRouter } from "next/navigation";
import { useAuth } from "@/components/auth/AuthContext";
import PrefDialog from "./prefDialog";
import SettingsDialog from "./settingsDialog";

export default function UserPopover({ isExpanded }: { isExpanded: boolean }) {
  const router = useRouter();
  const { currentUser, logout } = useAuth();

  if (currentUser === "Login") return null;

  return (
    <Popover>
      <PopoverTrigger className={`${isExpanded ? "border-t" : ""}`}>
        <div className="flex gap-4 p-1 mt-2 rounded-md hover:bg-muted transition cursor-pointer items-center justify-start">
          <Avatar>
            <AvatarFallback className="bg-secondary">
              {currentUser?.[0] || ""}
            </AvatarFallback>
          </Avatar>
          {isExpanded && <span className="cursor-pointer">{currentUser}</span>}
        </div>
      </PopoverTrigger>
      <PopoverContent className="ml-2 bg-accent px-3 rounded-xl">
        <div className="pb-1">
          <div className="flex items-center cursor-pointer px-2 pb-3 text-muted-foreground">
            <CircleUser className="h-4 w-4 mr-2" />
            <p className="text-sm">{currentUser}</p>
          </div>
          <PrefDialog />
          <SettingsDialog />
        </div>
        <div className="border-t pt-1">
          <div className="flex items-center cursor-pointer p-2 hover:bg-border transition-colors duration-300 rounded-md">
            <HelpCircle className="h-4 w-4 mr-2" />
            <p className="text-sm">Help</p>
          </div>
          <div
            className="flex items-center cursor-pointer p-2 hover:bg-border transition-colors duration-300 rounded-md"
            onClick={() => {
              logout();
              router.push("/");
            }}
          >
            <LogOut className="h-4 w-4 mr-2" />
            <p className="text-sm">Logout</p>
          </div>
        </div>
      </PopoverContent>
    </Popover>
  );
}
