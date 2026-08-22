"use client";
import { useSidebar, SidebarTrigger } from "@/components/ui/sidebar";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Skeleton } from "@/components/ui/skeleton";
import { Bell, LogOut, Settings, User, Clock } from "lucide-react";
import { useSession } from "@/context/SessionContext";
import { usePathname } from "next/navigation";
import Link from "next/link";
import React, { useState, useEffect } from "react";

const AdminHeader = () => {
  const { user, logout, loading } = useSession();
  const pathname = usePathname();

  // Digital clock state
  const [time, setTime] = useState<Date | null>(null);

  useEffect(() => {
    setTime(new Date());
    const interval = setInterval(() => {
      setTime(new Date());
    }, 1000);
    return () => clearInterval(interval);
  }, []);

  const formatTime = (date: Date) => {
    return date.toLocaleTimeString("en-US", {
      hour: "2-digit",
      minute: "2-digit",
      second: "2-digit",
      hour12: true,
    });
  };

  const formatDateLabel = (date: Date) => {
    return date.toLocaleDateString("en-US", {
      weekday: "short",
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  const paths = pathname.split("/").filter((path) => path !== "");

  return (
    <header className="h-16 w-full flex bg-white/90 dark:bg-[#1a1b1e]/90 backdrop-blur-md sticky top-0 z-20 border-b border-zinc-100 dark:border-zinc-800 transition-all">
      <div className="w-full px-4 md:px-6 flex items-center justify-between gap-4">
        {/* Left Section: Sidebar Toggle & Real-time Clock */}
        <div className="flex items-center gap-4">
          <SidebarTrigger className="h-9 w-9 text-zinc-600 dark:text-zinc-300 hover:text-zinc-950 dark:hover:text-white hover:bg-zinc-100 dark:hover:bg-zinc-800/60 rounded-lg focus-visible:ring-0 focus-visible:ring-offset-0 focus:outline-none transition-colors" />
          
          {time && (
            <div className="hidden md:flex items-center gap-2 text-xs font-bold text-zinc-400 dark:text-zinc-500 select-none bg-zinc-50 dark:bg-zinc-900 border border-zinc-150/40 dark:border-zinc-800/50 rounded-xl px-3 py-1.5 shadow-2xs">
              <Clock className="h-3.5 w-3.5 text-primary animate-pulse" />
              <span className="text-zinc-800 dark:text-zinc-200 tabular-nums">{formatTime(time)}</span>
              <span className="text-zinc-300 dark:text-zinc-800">•</span>
              <span>{formatDateLabel(time)}</span>
            </div>
          )}
        </div>

        {/* Right Section: Notifications, Theme, Profile */}
        <div className="flex items-center space-x-3 ml-auto">
          {/* Notifications */}
          <Button
            variant="ghost"
            size="icon"
            className="h-9 w-9 rounded-lg hover:bg-zinc-50 dark:hover:bg-zinc-800 relative text-zinc-500 hover:text-zinc-900 dark:hover:text-white"
          >
            <Bell className="h-5 w-5" />
            <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 ring-2 ring-white dark:ring-[#1a1b1e]" />
          </Button>

          {/* User profile details */}
          <div className="flex items-center">
            {loading ? (
              <Skeleton className="h-9 w-9 rounded-lg" />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <Avatar className="h-9 w-9 cursor-pointer hover:opacity-90 transition-opacity border border-zinc-200 dark:border-zinc-700 rounded-lg">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm rounded-lg">
                      {user?.firstname?.[0] || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none">
                        {user ? `${user.firstname} ${user.lastname}` : "Admin"}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || "Administrator"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard/profile" className="flex items-center">
                      <User className="mr-2 h-4 w-4" />
                      <span>My Profile</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuItem asChild className="cursor-pointer">
                    <Link href="/dashboard/settings" className="flex items-center">
                      <Settings className="mr-2 h-4 w-4" />
                      <span>Store Settings</span>
                    </Link>
                  </DropdownMenuItem>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem
                    onClick={() => logout()}
                    className="cursor-pointer text-red-600 focus:text-red-600 focus:bg-red-50/50 dark:focus:bg-red-950/20"
                  >
                    <LogOut className="mr-2 h-4 w-4" />
                    <span>Log Out</span>
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            )}
          </div>
        </div>
      </div>
    </header>
  );
};

export default AdminHeader;
