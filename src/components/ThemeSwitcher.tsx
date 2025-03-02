"use client";

import {
  Button,
  Dropdown,
  DropdownItem,
  DropdownMenu,
  DropdownTrigger,
} from "@heroui/react";
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

  if (!mounted) return null;

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="flat" size="sm" isIconOnly>
          {theme === "light" && (
            <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
          )}
          {theme === "dark" && (
            <MoonStar className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100 dark:text-white" />
          )}
          {theme === "system" && (
            <BiDesktop className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:rotate-0 dark:scale-100 dark:text-white" />
          )}
          <span className="sr-only">Toggle theme</span>
        </Button>
      </DropdownTrigger>
      <DropdownMenu>
      <DropdownItem key='light' onPress={() => setTheme("light")}>Light</DropdownItem>
        <DropdownItem key='dark' onPress={() => setTheme("dark")}>Dark</DropdownItem>
        <DropdownItem key='system' onPress={() => setTheme("system")}>System</DropdownItem>
      </DropdownMenu>
    </Dropdown>
  );
}
