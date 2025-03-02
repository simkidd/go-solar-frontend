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

  const Icon =
    theme === "light" ? Sun : theme === "dark" ? MoonStar : BiDesktop;

  return (
    <Dropdown>
      <DropdownTrigger>
        <Button variant="flat" size="sm" isIconOnly>
          <Icon className="h-[1.2rem] w-[1.2rem] transition-all dark:text-white" />
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
