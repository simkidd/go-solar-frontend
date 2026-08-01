"use client";
import { useAuthStore } from "@/lib/stores/auth.store";
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
import { Bell, Menu, LogOut, Settings, User } from "lucide-react";
import { ThemeSwitcher } from "../../../components/ThemeSwitcher";
import { useSession } from "@/context/SessionContext";

const AdminHeader = () => {
  const { user, logout, loading } = useSession();
  const { setShowSidebar } = useAuthStore();

  return (
    <div className="h-14 md:h-16 w-full flex bg-white dark:bg-[#222327] shadow-sm sticky top-0 right-0 left-0 z-40 border-b border-gray-100 dark:border-zinc-800">
      <div className="w-full px-4 flex items-center justify-between">
        <button 
          className="md:hidden p-2 rounded-md hover:bg-zinc-100 dark:hover:bg-zinc-800 transition-colors" 
          onClick={() => setShowSidebar(true)}
        >
          <Menu className="h-5 w-5 dark:text-white" />
        </button>
        <div className="ms-auto flex items-center space-x-3">
          <Button variant="ghost" size="icon" className="relative hover:bg-zinc-100 dark:hover:bg-zinc-800">
            <Bell className="h-5 w-5 dark:text-white" />
            <span className="absolute top-1.5 right-1.5 h-2 w-2 rounded-full bg-red-500" />
          </Button>
          <ThemeSwitcher />
          <div className="flex items-center">
            {loading ? (
              <Skeleton className="h-9 w-9 rounded-full" />
            ) : (
              <DropdownMenu>
                <DropdownMenuTrigger className="focus:outline-none">
                  <Avatar className="h-9 w-9 cursor-pointer hover:opacity-90 transition-opacity border border-zinc-200 dark:border-zinc-700">
                    <AvatarImage src="" />
                    <AvatarFallback className="bg-primary/10 text-primary font-semibold text-sm">
                      {user?.firstname?.[0] || <User className="h-4 w-4" />}
                    </AvatarFallback>
                  </Avatar>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-56 mt-2">
                  <DropdownMenuLabel className="font-normal">
                    <div className="flex flex-col space-y-1">
                      <p className="text-sm font-semibold leading-none">
                        {user?.firstname + " " + user?.lastname}
                      </p>
                      <p className="text-xs leading-none text-muted-foreground">
                        {user?.email || "Administrator"}
                      </p>
                    </div>
                  </DropdownMenuLabel>
                  <DropdownMenuSeparator />
                  <DropdownMenuItem className="cursor-pointer">
                    <Settings className="mr-2 h-4 w-4" />
                    <span>My Settings</span>
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
    </div>
  );
};

export default AdminHeader;
