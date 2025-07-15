"use client";
import { Link, LogOut, Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useAuth } from "../auth/AuthContext";
import { Button } from "../ui/button";
import { useRouter } from "next/navigation";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";

export default function NavBar() {
  const user = useAuth();
  const { logout } = useAuth();
  const router = useRouter();
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div>
      <header className="sticky top-0 z-30 flex items-center justify-between px-8 py-4">
        <div className="flex items-center gap-3">
          <h1 className="text-xl font-medium tracking-tight orbitron">
            Web Gen
          </h1>
        </div>

        <div className="flex items-center gap-8">
          <Button
            variant="ghost"
            size="icon"
            onClick={() => setDarkMode(!darkMode)}
            aria-label="Toggle theme"
            className="cursor-pointer"
          >
            {darkMode ? <Moon size={18} /> : <Sun size={18} />}
          </Button>
          {user.currentUser === "Login" ? (
            <Link
              href="/login"
              className="cursor-pointer text-[#00289f] bg-transparent border-none outline-none"
              type="button"
            >
              {user.currentUser}
            </Link>
          ) : (
            <Popover>
              <PopoverTrigger>
                <span className="cursor-pointer">{user.currentUser}</span>
              </PopoverTrigger>
              <PopoverContent className="space-y-2">
                <div
                  className="flex items-center cursor-pointer"
                  onClick={() => {
                    logout();
                    router.push("/");
                  }}
                >
                  <LogOut className="h-4 w-4 mr-2" />
                  <p>Logout</p>
                </div>
              </PopoverContent>
            </Popover>
          )}
        </div>
      </header>
    </div>
  );
}
