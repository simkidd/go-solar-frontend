"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Sun, MoonStar } from "lucide-react";

export function ThemeSwitcher() {
  const [mounted, setMounted] = useState(false);
  const { theme, setTheme } = useTheme();

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="space-x-2 flex items-center">
      <button
        className={`rounded-full size-8 bg-transparent flex items-center justify-center ${
          theme === "light" && "!bg-primary"
        }`}
        onClick={() => setTheme("light")}
      >
        <Sun size={18} />
      </button>
      <button
        className={`rounded-full size-8 bg-transparent flex items-center justify-center ${
          theme === "dark" && "!bg-primary"
        }`}
        onClick={() => setTheme("dark")}
      >
        <MoonStar size={18} />
      </button>
    </div>
  );
}
