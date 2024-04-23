"use client";
import React from "react";
import { ThemeSwitcher } from "../../../components/ThemeSwitcher";
import { ChevronDown, Menu } from "lucide-react";
import { Avatar } from "@nextui-org/react";
import { useAuth } from "@/contexts/auth.context";

const AdminHeader = () => {
  const { currentUser } = useAuth();

  return (
    <div className="h-14 md:h-16 w-full flex bg-white dark:bg-[#222327] shadow-md sticky top-0 right-0 left-0 z-40">
      <div className="w-full px-4 flex items-center justify-between">
        <button className="">
          <Menu />
        </button>
        <div className="flex items-center space-x-4">
          <ThemeSwitcher />
          <div>
            <div className="flex items-center">
              {currentUser && (
                <p className="mr-2">
                  {currentUser?.firstname + " " + currentUser?.lastname}
                </p>
              )}
              <Avatar />
              <ChevronDown size={14} className="ms-1" />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminHeader;
