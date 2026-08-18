"use client";

import { Skeleton } from "@/components/ui/skeleton";
import { MoonStar, Sun } from "lucide-react";
import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { BiDesktop } from "react-icons/bi";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) {
    return <Skeleton className="w-[84px] h-[28px] rounded-full" />;
  }

  // Fallback to "system" if theme is not set
  const currentTheme = theme || "system";

  // Translate slider position based on active theme
  const getTranslateClass = () => {
    switch (currentTheme) {
      case "light":
        return "translate-x-0";
      case "dark":
        return "translate-x-[24px]";
      case "system":
      default:
        return "translate-x-[48px]";
    }
  };

  return (
    <div
      className="flex items-center bg-zinc-150 dark:bg-zinc-800 p-0.5 rounded-full relative w-[76px] h-[28px] select-none shadow-inner transition-colors duration-300"
      role="radiogroup"
      aria-label="Theme Selection"
    >
      {/* Sliding indicator element */}
      <div
        className={`absolute top-0.5 left-0.5 h-6 w-6 rounded-full bg-white dark:bg-zinc-950 shadow-xs border border-zinc-200/50 dark:border-zinc-850/50 transition-transform duration-300 ease-out z-0 ${getTranslateClass()}`}
      />

      {/* Light Theme Button */}
      <button
        onClick={() => setTheme("light")}
        className={`w-6 h-6 rounded-full flex items-center justify-center relative z-10 transition-colors duration-300 cursor-pointer ${
          currentTheme === "light"
            ? "text-[#08AA08] dark:text-[#08AA08]"
            : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-650 dark:hover:text-zinc-350"
        }`}
        aria-label="Light Theme"
      >
        <Sun className="h-3.5 w-3.5" />
      </button>

      {/* Dark Theme Button */}
      <button
        onClick={() => setTheme("dark")}
        className={`w-6 h-6 rounded-full flex items-center justify-center relative z-10 transition-colors duration-300 cursor-pointer ${
          currentTheme === "dark"
            ? "text-[#08AA08] dark:text-[#08AA08]"
            : "text-zinc-400 dark:text-zinc-500 hover:text-zinc-650 dark:hover:text-zinc-350"
        }`}
        aria-label="Dark Theme"
      >
        <MoonStar className="h-3.5 w-3.5" />
      </button>

      {/* System Theme Button */}
      <button
        onClick={() => setTheme("system")}
        className={`w-6 h-6 rounded-full flex items-center justify-center relative z-10 transition-colors duration-300 cursor-pointer ${
          currentTheme === "system"
            ? "text-[#08AA08] dark:text-[#08AA08]"
            : "text-zinc-400 dark:text-zinc-500 hover:text-[#08AA08]/50 dark:hover:text-zinc-350"
        }`}
        aria-label="System Theme"
      >
        <BiDesktop className="h-3.5 w-3.5" />
      </button>
    </div>
  );
}
export default ThemeSwitcher;
