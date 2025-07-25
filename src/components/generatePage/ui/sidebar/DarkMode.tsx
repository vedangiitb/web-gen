"use client";
import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";

export default function DarkMode({ isExpanded }: { isExpanded: boolean }) {
  const [darkMode, setDarkMode] = useState<boolean>(true);

  useEffect(() => {
    document.documentElement.classList.toggle("dark", darkMode);
  }, [darkMode]);

  return (
    <div className="mb-2">
      <button
        onClick={() => setDarkMode(!darkMode)}
        className={`flex w-full items-center p-2 rounded-md hover:bg-muted transition cursor-pointer ${
          isExpanded ? "justify-between gap-2" : "justify-center"
        }`}
      >
        {darkMode ? <Moon className="w-5 h-5" /> : <Sun className="w-5 h-5" />}
        <p className="text-sm">
          {isExpanded ? <p>{darkMode ? "Dark Mode" : "Light Mode"}</p> : null}
        </p>
      </button>
    </div>
  );
}
